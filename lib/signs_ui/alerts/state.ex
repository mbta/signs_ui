defmodule SignsUi.Alerts.State do
  @moduledoc """
  Keeps track of currently active subway alerts, so that PIOs can associate
  them with signs to auto-expire.
  """

  use GenStage

  require Logger
  alias ServerSentEventStage.Event
  alias SignsUi.Alerts.Alert

  defstruct alerts: %{}

  @type route_id :: String.t()
  @type alert_map :: %{Alert.id() => Alert.t()}
  @type route_alerts_map :: %{route_id() => alert_map()}

  @type display :: %__MODULE__{
          alerts: route_alerts_map()
        }

  @doc """
  An alert that affects multiple routes.
  """
  @type multi_route_alert :: %{
          created_at: DateTime.t() | nil,
          service_effect: String.t() | nil,
          affected_routes: MapSet.t(route_id()) | nil
        }

  @type single_route_alert :: %{
          id: Alert.id(),
          created_at: DateTime.t(),
          service_effect: String.t(),
          route: route_id()
        }

  @type state_row :: {Alert.id(), multi_route_alert()}

  @type state :: %{Alert.id() => multi_route_alert()}

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

  @spec active_alert_ids(GenServer.server()) :: [Alert.id()]
  def active_alert_ids(pid \\ __MODULE__) do
    GenServer.call(pid, :active_alert_ids)
  end

  @impl GenStage
  def handle_call(:active_alert_ids, _from, state) do
    alert_ids = Map.keys(state)

    {:reply, alert_ids, [], state}
  end

  @impl GenStage
  @spec handle_events([Event.t()], GenStage.from(), state()) :: {:noreply, [], state()}
  def handle_events(events, _from, state) do
    # Works in two primary phases. First, we generate fresh state using the
    # provided events:
    new_state = update_state(events, state)

    # Next, we convert our internal state model to the specified format:
    display_state = display_state(new_state)
    SignsUiWeb.Endpoint.broadcast!("signs:all", "new_alert_state", display_state.alerts)
    {:noreply, [], new_state}
  end

  @spec update_state(Event.t() | [Event.t()], state()) :: state()
  def update_state(events, state) when is_list(events) do
    # This reduce combines the effects of a  set of operations into a single new
    # state.
    Enum.reduce(events, state, &update_state(&1, &2))
  end

  def update_state(%Event{event: "reset", data: data}, _) do
    new_state = convert_payload(data)
    Map.new(new_state)
  end

  def update_state(%Event{event: "update", data: data}, state) do
    {id, alert} = convert_payload(data)
    Map.put(state, id, alert)
  end

  def update_state(%Event{event: "add", data: data}, state) do
    {id, alert} = convert_payload(data)
    Map.put(state, id, alert)
  end

  def update_state(%Event{event: "remove", data: data}, state) do
    {id, _} = convert_payload(data)
    Map.delete(state, id)
  end

  @spec display_state(state()) :: display()
  def display_state(state) when state == %{} do
    %__MODULE__{
      alerts: %{}
    }
  end

  def display_state(state) do
    %__MODULE__{
      # Take every alert in the current state,
      alerts:
        state
        # generate a list of single_route_alerts from it, and flatten,
        |> Enum.flat_map(&expand_routes/1)
        # group them by route,
        |> Enum.group_by(fn alert -> alert.route end)
        # convert each group's list of alert tuples into a map,
        |> Enum.map(&alert_map_for_route/1)
        # and convert the list of route groups into a map.
        |> Map.new()
    }
  end

  @spec expand_routes({Alert.id(), multi_route_alert()}) :: [single_route_alert()]
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

  @spec alert_map_for_route({route_id(), [single_route_alert()]}) :: {route_id(), alert_map()}
  defp alert_map_for_route({route, alerts}) do
    # Take a route_id() and a list of single_route_alert()s affecting it,
    # convert each single_route_alert() into an Alert.t(), and produce an
    # alert_map() for the route_id().
    {route,
     alerts
     |> Enum.map(fn alert ->
       {alert.id,
        %Alert{
          id: alert.id,
          created_at: alert.created_at,
          service_effect: alert.service_effect
        }}
     end)
     |> Map.new()}
  end

  @spec convert_payload(String.t() | list() | map()) :: [state_row()] | state_row()
  defp convert_payload(payload) when is_binary(payload) do
    {:ok, decoded} = Jason.decode(payload)

    convert_payload(decoded)
  end

  defp convert_payload(payload) when is_list(payload) do
    Enum.map(payload, &convert_payload/1)
  end

  defp convert_payload(payload) when is_map(payload) do
    id = payload["id"]

    {created_at, service_effect, routes} = parse_attributes(payload["attributes"])

    {id,
     %{
       created_at: created_at,
       service_effect: service_effect,
       affected_routes: routes
     }}
  end

  @spec parse_attributes(nil | map()) ::
          {DateTime.t() | nil, String.t() | nil, MapSet.t(route_id()) | nil}
  defp parse_attributes(nil), do: {nil, nil, nil}

  defp parse_attributes(attributes) do
    {:ok, created_at_local, _} = DateTime.from_iso8601(attributes["created_at"])
    # Convert the created date into UTC
    {:ok, created_at_utc} = DateTime.shift_zone(created_at_local, "Etc/UTC")
    routes = parse_routes(attributes)
    {created_at_utc, attributes["service_effect"], routes}
  end

  @spec parse_routes(map()) :: MapSet.t(route_id())
  defp parse_routes(attributes) do
    # Collect the route names from the informed_entity list
    attributes
    |> get_in([Access.key("informed_entity", []), Access.all(), "route"])
    |> MapSet.new()
  end
end
