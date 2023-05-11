defmodule SignsUi.Signs.State do
  @moduledoc """
  Stores the state of all the countdown viewer's signs, as built up by
  the received messages from realtime_signs.
  """

  use GenServer

  alias SignsUi.Messages.SignContent
  alias SignsUi.Messages.Canned
  alias SignsUi.Messages.AdHoc
  alias SignsUi.Signs.Sign

  @type sign_id :: String.t()

  @type state :: %{
          sign_id => Sign.t()
        }

  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, %{}, opts)
  end

  def init(_opts) do
    {:ok, %{}}
  end

  @spec list_signs(GenServer.server()) :: %{sign_id() => [map()]}
  def list_signs(pid \\ __MODULE__) do
    GenServer.call(pid, :list_signs)
  end

  @spec get_single_sign(GenServer.server(), String.t()) :: %{sign_id: String.t(), lines: map()}
  def get_single_sign(pid \\ __MODULE__, sign_id) do
    GenServer.call(pid, {:get_single_sign, sign_id})
  end

  @spec process_message(GenServer.server(), SignContent.t() | Canned.t() | AdHoc.t()) :: :ok
  def process_message(pid \\ __MODULE__, message) do
    GenServer.call(pid, {:process_message, message})
  end

  def handle_call(:list_signs, _from, state) do
    signs =
      Map.new(state, fn {sign_id, sign} ->
        {sign_id, Sign.to_json(sign)}
      end)

    {:reply, signs, state}
  end

  def handle_call({:get_single_sign, sign_id}, _from, state) do
    case Map.get(state, sign_id) do
      %Sign{} = sign ->
        {:reply, Sign.to_json(sign), state}

      nil ->
        {:reply, %{sign_id: sign_id, lines: %{}}, state}
    end
  end

  def handle_call({:process_message, %SignContent{} = message}, _from, state) do
    %{station: station, zone: zone} = message

    new_state =
      update_sign(state, station, zone, fn sign ->
        Sign.update_from_message(sign, message)
        |> tap(&broadcast_update/1)
      end)

    {:reply, :ok, new_state}
  end

  def handle_call({:process_message, %Canned{} = message}, _from, state) do
    {:reply, :ok, insert_audio(state, message)}
  end

  def handle_call({:process_message, %AdHoc{} = message}, _from, state) do
    {:reply, :ok, insert_audio(state, message)}
  end

  @spec broadcast_update(Sign.t()) :: :ok
  defp broadcast_update(sign) do
    sign = Sign.to_json(sign)
    SignsUiWeb.Endpoint.broadcast!("signs:all", "sign_update", sign)
    SignsUiWeb.Endpoint.broadcast!("sign:" <> sign.sign_id, "sign_update", sign)
  end

  defp update_sign(state, station, zone, update_fn) do
    sign_id = "#{station}-#{zone}"

    sign =
      state
      |> Map.get(sign_id, %Sign{station: station, zone: zone, lines: %{}, audios: []})
      |> update_fn.()

    Map.put(state, sign_id, sign)
  end

  defp insert_audio(state, audio) do
    now = DateTime.utc_now() |> DateTime.to_unix(:millisecond)

    Enum.reduce(audio.zones, state, fn zone, acc ->
      update_sign(acc, audio.station, zone, fn sign ->
        Map.update!(sign, :audios, fn audios ->
          # Filter out expired audios. Note that this only happens when a new audio is being
          # added, so the front-end is expected to do its own filtering of stale audios.
          Enum.concat(audios, [audio])
          |> Enum.reject(&(now > &1.timestamp + &1.timeout))
        end)
        |> tap(&broadcast_update/1)
      end)
    end)
  end
end
