defmodule SignsUi.Alerts.State do
  @moduledoc """
  Keeps track of currently active subway alerts, so that PIOs can associate
  them with signs to auto-expire.
  """

  use GenStage

  require Logger
  alias ServerSentEventStage.Event
  alias SignsUi.Alerts.Alert
  alias SignsUi.Alerts.Display
  alias SignsUi.Alerts.Events

  @type t :: %{Alert.id() => Alert.multi_route()}

  @spec start_link(keyword) :: :ignore | {:error, any} | {:ok, pid}
  def start_link(opts \\ []) do
    {start_opts, init_opts} = Keyword.split(opts, [:name])
    GenStage.start_link(__MODULE__, init_opts, start_opts)
  end

  @impl GenStage
  def init(opts) do
    {:consumer, %{}, opts}
  end

  @impl GenStage
  def handle_info(msg, state) do
    Logger.warn("#{__MODULE__} unknown_message #{inspect(msg)}")
    {:noreply, [], state}
  end

  @spec active_alert_ids(GenStage.stage()) :: MapSet.t(Alert.id())
  def active_alert_ids(pid \\ __MODULE__) do
    GenStage.call(pid, :active_alert_ids)
  end

  @impl GenStage
  def handle_call(:active_alert_ids, _from, state) do
    alert_ids = state |> Map.keys() |> MapSet.new()

    {:reply, alert_ids, [], state}
  end

  @impl GenStage
  @spec handle_events([Event.t()], GenStage.from(), t()) :: {:noreply, [], t()}
  def handle_events(events, _from, state) do
    # Works in two primary phases. First, we generate fresh t using the
    # provided events:
    new_state = update_state(events, state)
    Logger.debug(["Alert state updated: ", inspect(new_state)])

    # Next, we convert our internal model to the specified format:
    display_state = Display.format_state(new_state)
    SignsUiWeb.Endpoint.broadcast!("signs:all", "new_alert_state", display_state)
    {:noreply, [], new_state}
  end

  @spec update_state(Event.t() | [Event.t()], t()) :: t()
  defp update_state(events, state) when is_list(events) do
    # This reduce combines the effects of a  set of operations into a single new
    # state.
    Enum.reduce(events, state, &update_state(&1, &2))
  end

  defp update_state(%Event{event: "reset", data: data}, _) do
    alerts = Events.parse(data)
    Map.new(alerts, &{&1.id, &1})
  end

  defp update_state(%Event{event: "update", data: data}, state) do
    alert = Events.parse(data)
    Map.put(state, alert.id, alert)
  end

  defp update_state(%Event{event: "add", data: data}, state) do
    alert = Events.parse(data)
    Map.put(state, alert.id, alert)
  end

  defp update_state(%Event{event: "remove", data: data}, state) do
    alert = Events.parse(data)
    Map.delete(state, alert.id)
  end
end
