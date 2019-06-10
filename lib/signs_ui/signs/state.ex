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

  def handle_call({:process_message, message}, _from, state) do
    sign_id = "#{message.station}-#{message.zone}"

    sign =
      state
      |> Map.get(sign_id, Sign.new_from_message(message))
      |> Sign.update_from_message(message)

    broadcast_update(message)
    {:reply, :ok, Map.put(state, sign_id, sign)}
  end

  @spec broadcast_update(SignContent.t()) :: :ok
  defp broadcast_update(message) do
    SignsUiWeb.Endpoint.broadcast!("signs:all", "sign_update", %{
      sign_id: "#{message.station}-#{message.zone}",
      line_number: message.line_number,
      text: message.pages |> get_page() |> SignContent.page_to_text(),
      duration: message.expiration
    })
  end

  @spec get_page([SignContent.page()]) :: SignContent.page()
  defp get_page([_away, _stopped, n_stops]) do
    n_stops
  end

  defp get_page(pages) do
    List.first(pages)
  end
end
