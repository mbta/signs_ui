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
    start_opts = Keyword.put_new(start_opts, :name, __MODULE__)
    GenStage.start_link(__MODULE__, init_opts, start_opts)
  end

  @impl GenStage
  @spec init(keyword) :: {:consumer, %SignsUi.Alerts.State{}, [{:subscribe_to, [atom()]}]}
  def init(opts) do
    {:consumer, %__MODULE__{}, subscribe_to: Keyword.fetch!(opts, :subscribe_to)}
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
    new_state = update_state(events, state)
    display_state = display_state(new_state)
    Logger.info(["new_state ", inspect(display_state, pretty: true)])
    SignsUiWeb.Endpoint.broadcast!("signs:all", "new_alert_state", display_state.alerts)
    {:noreply, [], new_state}
  end

  @doc """
  Uses events to update the current state.
  """
  @spec update_state(Event.t() | [Event.t()], state()) :: state()
  def update_state(events, state) when is_list(events) do
    Enum.reduce(events, state, &update_state(&1, &2))
  end

  def update_state(%Event{event: "reset", data: data}, _) do
    new_state = convert_payload(data)
    Logger.info(["reset ", inspect(new_state, pretty: true)])
    Map.new(new_state)
  end

  def update_state(%Event{event: "update", data: data}, state) do
    {id, alert} = convert_payload(data)
    Logger.info(["update ", id, " ", inspect(alert, pretty: true)])
    Map.put(state, id, alert)
  end

  def update_state(%Event{event: "add", data: data}, state) do
    {id, alert} = convert_payload(data)
    Logger.info(["add ", id, " ", inspect(alert, pretty: true)])
    Map.put(state, id, alert)
  end

  def update_state(%Event{event: "remove", data: data}, state) do
    {id, _} = convert_payload(data)
    Logger.info(["remove ", id])
    Map.delete(state, id)
  end

  @doc """
  Takes every alert in the current state, produces a list of
  single_route_alert()s for each alert, groups them by the route they affect,
  builds an alert_map() for every route_id(), and finally converts them into a
  route_alerts_map().
  """
  @spec display_state(state()) :: display()
  def display_state(state) do
    %__MODULE__{
      alerts:
        state
        |> Enum.flat_map(&expand_routes/1)
        |> Enum.group_by(fn alert -> alert.route end)
        |> Enum.map(&alert_map_for_route/1)
        |> Map.new()
    }
  end

  @doc """
  Takes a multi_route_alert(), maps over its affected_routes, and creates a
  single_route_alert() for every affected route.
  """
  @spec expand_routes({Alert.id(), multi_route_alert()}) :: [single_route_alert()]
  def expand_routes({id, alert}) do
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

  @doc """
  Takes a route_id() and a list of single_route_alert()s affecting it, converts
  each single_route_alert into an Alert.t(), and produces an alert_map() for the
  route_id().
  """
  @spec alert_map_for_route({route_id(), [single_route_alert()]}) :: {route_id(), alert_map()}
  def alert_map_for_route({route, alerts}) do
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

  @doc """
  Converts a raw JSON payload into a state_row() or a list of state_row()s.
  """
  @spec convert_payload(String.t() | list() | map()) :: [state_row()] | state_row()
  def convert_payload(payload) when is_binary(payload) do
    {:ok, decoded} = Jason.decode(payload)

    convert_payload(decoded)
  end

  def convert_payload(payload) when is_list(payload) do
    Enum.map(payload, &convert_payload/1)
  end

  def convert_payload(payload) when is_map(payload) do
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
    {:ok, created_at_utc} = DateTime.shift_zone(created_at_local, "Etc/UTC")
    routes = parse_routes(attributes)
    {created_at_utc, attributes["service_effect"], routes}
  end

  @spec parse_routes(map()) :: MapSet.t(route_id())
  defp parse_routes(attributes) do
    attributes
    |> get_in([Access.key("informed_entity", []), Access.all(), "route"])
    |> MapSet.new()
  end
end
