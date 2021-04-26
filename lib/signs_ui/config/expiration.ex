defmodule SignsUi.Config.Expiration do
  @moduledoc """
  Handle cleaning up settings in the configuration that have since expired
  """
  use GenServer
  require Logger
  alias SignsUi.Config.Sign

  @type state :: %{
          time_fetcher: (() -> DateTime.t()),
          loop_ms: integer(),
          sign_state_server: GenServer.server()
        }

  @spec start_link(Keyword.t()) :: GenServer.on_start()
  def start_link(opts \\ []) do
    name = Keyword.get(opts, :name, __MODULE__)

    GenServer.start_link(__MODULE__, opts, name: name)
  end

  @spec init(Keyword.t()) :: {:ok, state()}
  def init(opts) do
    time_fetcher = Keyword.get(opts, :time_fetcher, fn -> DateTime.utc_now() end)
    loop_ms = Keyword.get(opts, :loop_ms, 5_000)
    sign_state_server = Keyword.get(opts, :sign_state_server, SignsUi.Config.State)
    schedule_loop(self(), loop_ms)
    {:ok, %{time_fetcher: time_fetcher, loop_ms: loop_ms, sign_state_server: sign_state_server}}
  end

  @spec handle_info(:process_expired, state()) :: {:noreply, state()}
  def handle_info(:process_expired, state) do
    updates =
      state.sign_state_server
      |> SignsUi.Config.State.get_all()
      |> expire_signs_via_time(state.time_fetcher)

    if updates != %{} do
      Logger.info("Cleaning expired settings for sign IDs: #{inspect(Map.keys(updates))}")

      {:ok, _new_state} =
        SignsUi.Config.State.update_sign_configs(state.sign_state_server, updates)
    end

    schedule_loop(self(), state.loop_ms)

    {:noreply, state}
  end

  @spec expire_signs_via_time(SignsUi.Config.State.t(), (() -> DateTime.t())) :: %{
          Sign.id() => Sign.t()
        }
  def expire_signs_via_time(state, time_fetcher) do
    current_dt = time_fetcher.()

    state
    |> Map.get(:signs)
    |> Enum.flat_map(&expire_single_sign(&1, current_dt))
    |> Enum.into(%{})
  end

  @spec expire_signs_via_alert(list(SignsUi.Config.State.t()), MapSet.t()) :: list(SignsUi.Config.State.t())
  def expire_signs_via_alert(sign_states, alert_ids) do
    IO.puts("---ENTERED expire_signs_via_alert---")
    expired_sign_states = get_expired_sign_states(
      sign_states, alert_ids, []
    )

    expired_sign_states
  end

  def get_expired_sign_states(remaining_sign_states, alert_ids, expired_sign_states) do
      if remaining_sign_states == [] do
        expired_sign_states
      else
        [sign_state | tail] = remaining_sign_states
        cond do
          sign_state.config.mode == :auto ->
            get_expired_sign_states(tail, alert_ids, expired_sign_states)
          Enum.member?(alert_ids, sign_state.config.alert_id) ->
            get_expired_sign_states(tail, alert_ids, expired_sign_states)
          true ->
            expired_sign_states = [%SignsUi.Config.Sign{
              id: sign_state.config.alert_id,
              config: %{mode: :auto}} | expired_sign_states]
            get_expired_sign_states(tail, alert_ids, expired_sign_states)
        end
      end
  end

  @spec get_active_alert_ids(SignsUi.Alerts.State.t()) :: MapSet.t()
  def get_active_alert_ids(alert_state) do
    alerts = alert_state.alerts
    routes = Map.keys(alerts)
    alert_ids = for route <- routes, do: Map.keys(alerts[route])

    MapSet.new(List.flatten(alert_ids))
  end

  @spec expire_single_sign({Sign.id(), Sign.t()}, DateTime.t()) :: [{Sign.id(), Sign.t()}]
  defp expire_single_sign(
         {id, %Sign{config: %{expires: expiration}} = sign},
         current_dt
       )
       when not is_nil(expiration) do
    if DateTime.compare(expiration, current_dt) == :lt do
      [{id, %Sign{sign | config: %{mode: :auto}}}]
    else
      []
    end
  end

  defp expire_single_sign(_, _) do
    []
  end

  @spec schedule_loop(pid(), integer()) :: reference()
  defp schedule_loop(pid, loop_ms) do
    Process.send_after(pid, :process_expired, loop_ms)
  end
end
