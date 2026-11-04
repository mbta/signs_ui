defmodule SignsUi.Alerts.State do
  @moduledoc """
  Keeps track of currently active subway alerts, so that PIOs can associate
  them with signs to auto-expire.
  """

  use GenServer

  require Logger
  alias SignsUi.Alerts.Alert
  alias SignsUi.Alerts.Display

  @type t :: %{Alert.id() => Alert.multi_route()}

  @valid_route_types [0, 1]

  @spec start_link(keyword) :: :ignore | {:error, any} | {:ok, pid}
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, [], opts)
  end

  @spec active_alert_ids(:ets.table()) :: MapSet.t(Alert.id())
  def active_alert_ids(table \\ :alerts) do
    get_alerts(table) |> Map.keys() |> MapSet.new()
  end

  @spec all(:ets.table()) :: Display.t()
  def all(table \\ :alerts) do
    get_alerts(table) |> Display.format_state()
  end

  @impl GenServer
  def init(_) do
    :ets.new(:alerts, [:named_table, read_concurrency: true])
    send(self(), :update)
    {:ok, %{table: :alerts, last_modified: nil}}
  end

  @impl GenServer
  def handle_info(:update, state) do
    existing_alerts = get_alerts(state.table)

    v3_api = Application.get_env(:signs_ui, :v3_api)

    {result, last_modified, logs} =
      case v3_api.fetch_alerts(state.last_modified) do
        {:ok, :not_modified} ->
          {:ok, state.last_modified, "not_modified"}

        {:ok, [], _last_modified} ->
          {:ok, state.last_modified, "empty_response"}

        {:ok, alerts, last_modified} ->
          new_value =
            for alert <- alerts,
                valid_route_type?(alert),
                parsed_alert = parse_alert(alert),
                mode_and_effect_unchanged?(existing_alerts, parsed_alert),
                into: %{} do
              {parsed_alert.id, parsed_alert}
            end

          SignsUiWeb.Endpoint.broadcast!(
            "alerts:all",
            "new_alert_state",
            Display.format_state(new_value)
          )

          :ets.insert(state.table, {:value, new_value})
          {:ok, last_modified, "alerts=#{inspect(new_value)}"}

        {:error, value} ->
          {:error, state.last_modified, "value=#{inspect(value)}"}
      end

    Logger.info("fetch_alerts: result=#{result} #{logs}")
    schedule_update(self(), 5_000)
    {:noreply, %{state | last_modified: last_modified}}
  end

  defp valid_route_type?(alert) do
    Enum.any?(get_route_types(alert), &(&1 in @valid_route_types))
  end

  defp get_route_types(alert) do
    alert
    |> get_in(["attributes", Access.key("informed_entity", []), Access.all(), "route_type"])
    |> Enum.uniq()
  end

  @spec mode_and_effect_unchanged?(t(), Alert.multi_route()) :: boolean()
  defp mode_and_effect_unchanged?(existing_alerts, alert) do
    case Map.get(existing_alerts, alert.id) do
      nil ->
        true

      existing ->
        not is_nil(existing.route_types) and not is_nil(alert.route_types) and
          MapSet.equal?(existing.route_types, alert.route_types) and
          existing.service_effect == alert.service_effect
    end
  end

  @spec parse_alert(map()) :: Alert.multi_route()
  defp parse_alert(alert) do
    {created_at, service_effect, routes, route_types} = parse_attributes(alert["attributes"])

    %{
      id: alert["id"],
      created_at: created_at,
      service_effect: service_effect,
      affected_routes: routes,
      route_types: route_types
    }
  end

  @spec parse_attributes(nil | map()) ::
          {DateTime.t() | nil, String.t() | nil, MapSet.t(Alert.route_id()) | nil,
           MapSet.t(Alert.route_type()) | nil}
  defp parse_attributes(nil), do: {nil, nil, nil, nil}

  defp parse_attributes(attributes) do
    {get_created_at(attributes), attributes["service_effect"], parse_routes(attributes),
     parse_route_types(attributes)}
  end

  @spec get_created_at(map()) :: DateTime.t() | nil
  defp get_created_at(attributes) do
    case DateTime.from_iso8601(attributes["created_at"]) do
      {:ok, created_at, _} ->
        created_at

      {:error, reason} ->
        Logger.error([
          "Failed to parse created_at, reason=",
          inspect(reason),
          " attributes=",
          inspect(attributes)
        ])

        nil
    end
  end

  @spec parse_routes(map()) :: MapSet.t(Alert.route_id())
  defp parse_routes(attributes) do
    attributes
    |> get_in([Access.key("informed_entity", []), Access.all(), "route"])
    |> MapSet.new()
  end

  @spec parse_route_types(map()) :: MapSet.t(Alert.route_type())
  defp parse_route_types(attributes) do
    attributes
    |> get_in([Access.key("informed_entity", []), Access.all(), "route_type"])
    |> MapSet.new()
  end

  defp schedule_update(pid, ms) do
    Process.send_after(pid, :update, ms)
  end

  @spec get_alerts(:ets.tab()) :: t() | %{}
  defp get_alerts(table) do
    case :ets.lookup(table, :value) do
      [{:value, value}] -> value
      _ -> %{}
    end
  end
end
