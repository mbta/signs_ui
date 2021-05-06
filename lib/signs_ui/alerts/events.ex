defmodule SignsUi.Alerts.Events do
  alias SignsUi.Alerts.Alert
  alias SignsUi.Alerts.State

  @spec parse(String.t() | list() | map()) :: [State.row()] | State.row()
  def parse(payload) when is_binary(payload) do
    {:ok, decoded} = Jason.decode(payload)

    parse(decoded)
  end

  def parse(payload) when is_list(payload) do
    Enum.map(payload, &parse/1)
  end

  def parse(payload) when is_map(payload) do
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
          {DateTime.t() | nil, String.t() | nil, MapSet.t(Alert.route_id()) | nil}
  defp parse_attributes(nil), do: {nil, nil, nil}

  defp parse_attributes(attributes) do
    {:ok, created_at_local, _} = DateTime.from_iso8601(attributes["created_at"])
    # Convert the created date into UTC
    {:ok, created_at_utc} = DateTime.shift_zone(created_at_local, "Etc/UTC")
    routes = parse_routes(attributes)
    {created_at_utc, attributes["service_effect"], routes}
  end

  @spec parse_routes(map()) :: MapSet.t(Alert.route_id())
  defp parse_routes(attributes) do
    # Collect the route names from the informed_entity list
    attributes
    |> get_in([Access.key("informed_entity", []), Access.all(), "route"])
    |> MapSet.new()
  end
end
