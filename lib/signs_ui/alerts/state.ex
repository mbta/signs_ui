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

  @spec start_link(keyword) :: :ignore | {:error, any} | {:ok, pid}
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, [], opts)
  end

  @spec active_alert_ids(SignsUi.Alerts.State) :: MapSet.t(Alert.id())
  def active_alert_ids(pid \\ __MODULE__) do
    GenServer.call(pid, :active_alert_ids)
  end

  @spec all(SignsUi.Alerts.State) :: Display.t()
  def all(pid \\ __MODULE__) do
    GenServer.call(pid, :all)
  end

  @impl GenServer
  def init(_) do
    send(self(), :update)
    {:ok, %{}}
  end

  @impl GenServer
  def handle_call(:active_alert_ids, _from, state) do
    alert_ids = state |> Map.keys() |> MapSet.new()

    {:reply, alert_ids, state}
  end

  @impl GenServer
  def handle_call(:all, _from, state) do
    {:reply, Display.format_state(state), state}
  end

  @impl GenServer
  def handle_info(:update, state) do
    state =
      case fetch_alerts() do
        {:ok, response} ->
          new_state = Enum.into(parse_response(response), %{}, &{&1.id, &1})

          SignsUiWeb.Endpoint.broadcast!(
            "alerts:all",
            "new_alert_state",
            Display.format_state(new_state)
          )

          Logger.info(["alert_state_updated ", inspect(new_state)])
          new_state

        {:error, error} ->
          Logger.error([
            "alerts_fetch_failed, reason=",
            inspect(error)
          ])

          state
      end

    schedule_update(self(), 5_000)
    {:noreply, state}
  end

  defp fetch_alerts do
    http_client = Application.get_env(:signs_ui, :http_client)
    url = "#{Application.get_env(:signs_ui, :api_v3_url)}/alerts"
    headers = [{"x-api-key", Application.get_env(:signs_ui, :api_v3_key)}]

    case http_client.get(
           url,
           headers,
           params: %{
             "filter[datetime]" => "NOW",
             "filter[route_type]" => "0,1"
           }
         ) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        {:ok, body}

      error ->
        {:error, error}
    end
  end

  def parse_response(payload) when is_binary(payload) do
    payload |> Jason.decode!() |> Map.get("data", []) |> Enum.map(&parse_alert/1)
  end

  def parse_alert(alert) when is_map(alert) do
    id = alert["id"]

    {created_at, service_effect, routes} = parse_attributes(alert["attributes"])

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

  defp schedule_update(pid, ms) do
    Process.send_after(pid, :update, ms)
  end
end
