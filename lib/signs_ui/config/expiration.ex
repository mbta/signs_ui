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
          sign_state_server: GenServer.server(),
          alert_fetcher: (() -> MapSet.t(SignsUi.Alerts.Alert.id()))
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
    alert_fetcher = Keyword.get(opts, :alert_fetcher, &SignsUi.Alerts.State.active_alert_ids/0)
    schedule_loop(self(), loop_ms)

    {:ok,
     %{
       alert_fetcher: alert_fetcher,
       time_fetcher: time_fetcher,
       loop_ms: loop_ms,
       sign_state_server: sign_state_server
     }}
  end

  @spec handle_info(:process_expired, state()) :: {:noreply, state()}
  def handle_info(:process_expired, state) do
    updates =
      state.sign_state_server
      |> SignsUi.Config.State.get_all()
      |> expire_signs(state.time_fetcher, state.alert_fetcher)

    if updates != %{} do
      Logger.info("Cleaning expired settings for sign IDs: #{inspect(Map.keys(updates))}")

      {:ok, _new_state} =
        SignsUi.Config.State.update_sign_configs(state.sign_state_server, updates)
    end

    schedule_loop(self(), state.loop_ms)

    {:noreply, state}
  end

  @spec expire_signs(
          SignsUi.Config.State.t(),
          (() -> DateTime.t()),
          (() -> MapSet.t(SignsUi.Alerts.Alert.id()))
        ) :: %{
          Sign.id() => Sign.t()
        }
  def expire_signs(state, time_fetcher, alert_fetcher) do
    current_dt = time_fetcher.()
    alert_ids = alert_fetcher.()

    state
    |> Map.get(:signs)
    |> Enum.flat_map(fn sign -> expire_single_sign(sign, current_dt, alert_ids) end)
    |> Enum.into(%{})
  end

  @spec expire_single_sign({Sign.id(), Sign.t()}, DateTime.t(), MapSet.t(String.t())) :: [
          {Sign.id(), Sign.t()}
        ]
  defp expire_single_sign(
         {id, %Sign{config: %{expires: expiration}} = sign},
         current_dt,
         _alert_ids
       )
       when not is_nil(expiration) do
    if DateTime.compare(expiration, current_dt) == :lt do
      [{id, %Sign{sign | config: %{mode: :auto}}}]
    else
      []
    end
  end

  defp expire_single_sign(
         {id, %Sign{config: %{alert_id: alert_id}} = sign},
         _current_dt,
         alert_ids
       )
       when not is_nil(alert_id) do
    if MapSet.member?(alert_ids, alert_id) do
      []
    else
      [{id, %Sign{sign | config: %{mode: :auto}}}]
    end
  end

  defp expire_single_sign(_, _, _) do
    []
  end

  @spec schedule_loop(pid(), integer()) :: reference()
  defp schedule_loop(pid, loop_ms) do
    Process.send_after(pid, :process_expired, loop_ms)
  end
end
