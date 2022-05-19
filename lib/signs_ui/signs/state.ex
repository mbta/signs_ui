defmodule SignsUi.Signs.State do
  @moduledoc """
  Stores the state of all the countdown viewer's signs, as built up by
  the received messages from realtime_signs.
  """

  use GenServer

  alias SignsUi.Messages.SignContent
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

  @spec process_message(GenServer.server(), SignContent.t()) :: :ok
  def process_message(pid \\ __MODULE__, %SignContent{} = message) do
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
    sign = Map.get(state, sign_id)
    {:reply, Sign.to_json(sign), state}
  end

  def handle_call({:process_message, message}, _from, state) do
    sign_id = "#{message.station}-#{message.zone}"

    sign =
      state
      |> Map.get(sign_id, Sign.new_from_message(message))
      |> Sign.update_from_message(message)

    broadcast_update(sign)
    {:reply, :ok, Map.put(state, sign_id, sign)}
  end

  @spec broadcast_update(Sign.t()) :: :ok
  defp broadcast_update(sign) do
    sign = Sign.to_json(sign)
    SignsUiWeb.Endpoint.broadcast!("signs:all", "sign_update", sign)
    SignsUiWeb.Endpoint.broadcast!("sign:" <> sign.sign_id, "sign_update", sign)
  end
end
