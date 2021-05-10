defmodule SignsUi.Alerts.State do
  @moduledoc """
  Keeps track of currently active subway alerts, so that PIOs can associate
  them with signs to auto-expire.
  """

  use GenServer
  require Logger
  alias SignsUi.Alerts.Alert

  defstruct alerts: %{}

  @type route_id :: String.t()
  @type alert_map :: %{Alert.id() => Alert.t()}
  @type route_alerts_map :: %{route_id() => alert_map()}

  @type state :: %__MODULE__{
          alerts: route_alerts_map()
        }

  def start_link(opts \\ []) do
    {start_opts, init_opts} = Keyword.split(opts, [:name])
    start_opts = Keyword.put_new(start_opts, :name, __MODULE__)
    GenServer.start_link(__MODULE__, init_opts, start_opts)
  end

  def init(opts) do
    interval_ms = Keyword.get(opts, :interval_ms, 15_000)
    :timer.send_interval(interval_ms, :twiddle_state)
    {:ok, %__MODULE__{}}
  end

  @spec active_alert_ids(GenServer.server()) :: MapSet.t(Alert.id())
  def active_alert_ids(pid \\ __MODULE__) do
    GenServer.call(pid, :active_alert_ids)
  end

  def handle_call(:active_alert_ids, _from, state) do
    alert_ids =
      for {_route_id, route_alerts} <- state.alerts,
          {alert_id, _alert_data} <- route_alerts,
          do: alert_id

    {:reply, MapSet.new(alert_ids), state}
  end

  def handle_info(:twiddle_state, state) do
    new_alert_state =
      case :rand.uniform(5) do
        1 ->
          state.alerts |> Enum.to_list() |> Enum.shuffle() |> List.delete_at(0) |> Map.new()

        _ ->
          route_id = Enum.random(["Red", "Orange", "Blue", "Green-B"])
          alert_id = 10_000 |> :rand.uniform() |> to_string()
          service_effect = "Alert #{alert_id} service text"

          Map.merge(
            state.alerts,
            %{
              route_id => %{
                alert_id => %Alert{
                  id: alert_id,
                  service_effect: service_effect,
                  created_at: DateTime.now!("America/New_York")
                }
              }
            }
          )
      end

    SignsUiWeb.Endpoint.broadcast!("signs:all", "new_alert_state", new_alert_state)
    Logger.info("new_alert_state: #{inspect(new_alert_state)}")

    {:noreply, put_in(state.alerts, new_alert_state)}
  end

  def handle_info(msg, state) do
    Logger.warn("#{__MODULE__} unknown_message #{inspect(msg)}")
    {:noreply, state}
  end
end
