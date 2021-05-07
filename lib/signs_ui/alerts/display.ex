defmodule SignsUi.Alerts.Display do
  alias SignsUi.Alerts.Alert
  alias SignsUi.Alerts.State

  @typep alert_map :: %{Alert.id() => Alert.t()}
  @typep route_alerts_map :: %{Alert.route_id() => alert_map()}

  @typep t :: route_alerts_map()

  @spec format_state(State.t()) :: t()
  def format_state(state) do
    state
    |> Stream.flat_map(&expand_routes/1)
    |> Enum.group_by(fn alert -> alert.route end)
    |> Stream.map(&alert_map_for_route/1)
    |> Map.new()
  end

  @spec expand_routes({Alert.id(), Alert.multi_route()}) :: [Alert.single_route()]
  defp expand_routes({id, alert}) do
    Enum.map(alert.affected_routes, fn route ->
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
