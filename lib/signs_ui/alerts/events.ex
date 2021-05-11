defmodule SignsUi.Alerts.Events do
  @moduledoc """
  Parses incoming alert data from the API into multi-route alerts for internal
  storage.
  """
  require Logger
  alias SignsUi.Alerts.Alert

  @spec parse(String.t() | list() | map()) :: [Alert.multi_route()] | Alert.multi_route()
  def parse(payload) when is_binary(payload) do
    payload |> Jason.decode!() |> parse()
  end

  def parse(payload) when is_list(payload) do
    Enum.map(payload, &parse/1)
  end

  def parse(payload) when is_map(payload) do
    id = payload["id"]

    {created_at, service_effect, routes} = parse_attributes(payload["attributes"])

    %{
      id: id,
      created_at: created_at,
      service_effect: service_effect,
      affected_routes: routes
    }
  end

  @spec parse_attributes(nil | map()) ::
          {DateTime.t() | nil, String.t() | nil, MapSet.t(Alert.route_id()) | nil}
  defp parse_attributes(nil), do: {nil, nil, nil}

  defp parse_attributes(attributes) do
    case DateTime.from_iso8601(attributes["created_at"]) do
      {:ok, created_at, _} ->
        {created_at, attributes["service_effect"], parse_routes(attributes)}

      {:error, reason} ->
        Logger.error([
          "Failed to parse created_at, reason=",
          inspect(reason),
          " attributes=",
          inspect(attributes)
        ])

        {nil, attributes["service_effect"], parse_routes(attributes)}
    end
  end

  @spec parse_routes(map()) :: MapSet.t(Alert.route_id())
  defp parse_routes(attributes) do
    attributes
    |> get_in([Access.key("informed_entity", []), Access.all(), "route"])
    |> MapSet.new()
  end
end
