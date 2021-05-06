defmodule SignsUi.Alerts.State do
  @moduledoc """
  Keeps track of currently active subway alerts, so that PIOs can associate
  them with signs to auto-expire.
  """

  use GenStage

  require Logger
  alias ServerSentEventStage.Event
  alias SignsUi.Alerts.Alert
  alias SignsUi.Alerts.Events

  defstruct alerts: %{}

  @type alert_map :: %{Alert.id() => Alert.t()}
  @type route_alerts_map :: %{Alert.route_id() => alert_map()}

  @type display :: %__MODULE__{
          alerts: route_alerts_map()
        }

  @type row :: {Alert.id(), Alert.multi_route()}

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
  def handle_info(msg, t) do
    Logger.warn("#{__MODULE__} unknown_message #{inspect(msg)}")
    {:noreply, [], t}
  end

  @spec active_alert_ids(GenStage.stage()) :: MapSet.t(Alert.id())
  def active_alert_ids(pid \\ __MODULE__) do
    GenStage.call(pid, :active_alert_ids)
  end

  @impl GenStage
  def handle_call(:active_alert_ids, _from, t) do
    alert_ids = t |> Map.keys() |> MapSet.new()

    {:reply, alert_ids, [], t}
  end

  @impl GenStage
  @spec handle_events([Event.t()], GenStage.from(), t()) :: {:noreply, [], t()}
  def handle_events(events, _from, t) do
    # Works in two primary phases. First, we generate fresh t using the
    # provided events:
    new_state = update_state(events, t)

    # Next, we convert our internal t model to the specified format:
    display_state = display_state(new_state)
    SignsUiWeb.Endpoint.broadcast!("signs:all", "new_alert_state", display_state.alerts)
    {:noreply, [], new_state}
  end

  @spec update_state(Event.t() | [Event.t()], t()) :: t()
  defp update_state(events, t) when is_list(events) do
    # This reduce combines the effects of a  set of operations into a single new
    # t.
    Enum.reduce(events, t, &update_state(&1, &2))
  end

  defp update_state(%Event{event: "reset", data: data}, _) do
    new_state = Events.parse(data)
    Map.new(new_state)
  end

  defp update_state(%Event{event: "update", data: data}, t) do
    {id, alert} = Events.parse(data)
    Map.put(t, id, alert)
  end

  defp update_state(%Event{event: "add", data: data}, t) do
    {id, alert} = Events.parse(data)
    Map.put(t, id, alert)
  end

  defp update_state(%Event{event: "remove", data: data}, t) do
    {id, _} = Events.parse(data)
    Map.delete(t, id)
  end

  @spec display_state(t()) :: display()
  defp display_state(t) do
    %__MODULE__{
      # Take every alert in the current t,
      alerts:
        t
        # generate a list of single_route_alerts from it, and flatten,
        |> Stream.flat_map(&expand_routes/1)
        # group them by route,
        |> Enum.group_by(fn alert -> alert.route end)
        # convert each group's list of alerts into a map,
        |> Stream.map(&alert_map_for_route/1)
        # and convert the list of alert groups into a map.
        |> Map.new()
    }
  end

  @spec expand_routes({Alert.id(), Alert.multi_route()}) :: [Alert.single_route()]
  defp expand_routes({id, alert}) do
    # Take a multi_route_alert(), maps over its affected_routes, and create a
    # single_route_alert() for every affected route.
    alert.affected_routes
    |> Enum.map(fn route ->
      %{
        id: id,
        created_at: alert.created_at,
        service_effect: alert.service_effect,
        route: route
      }
    end)
  end

  @spec alert_map_for_route({Alert.route_id(), [Alert.single_route()]}) ::
          {Alert.route_id(), alert_map()}
  defp alert_map_for_route({route, alerts}) do
    # Take a route_id() and a list of single_route_alert()s affecting it,
    # convert each single_route_alert() into an Alert.t(), and produce an
    # alert_map() for the route_id().
    {route,
     alerts
     |> Stream.map(fn alert ->
       {alert.id,
        %Alert{
          id: alert.id,
          created_at: alert.created_at,
          service_effect: alert.service_effect
        }}
     end)
     |> Map.new()}
  end
end
