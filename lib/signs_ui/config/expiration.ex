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
    #|> expire_signs_via_time(state.time_fetcher)
    #|> expire_signs(state.time_fetcher, state.alert_fetcher)
    #updates =
    #  state.sign_state_server
    #  |> SignsUi.Config.State.get_all()
    #  |> expire_signs(state.time_fetcher)

    updates =
      state.sign_state_server
      |> SignsUi.Config.State.get_all()
      |> expire_signs_via_time_and_alert(state.time_fetcher, state.alert_fetcher)

    if updates != %{} do
      Logger.info("Cleaning expired settings for sign IDs: #{inspect(Map.keys(updates))}")

      {:ok, _new_state} =
        SignsUi.Config.State.update_sign_configs(state.sign_state_server, updates)
    end

    schedule_loop(self(), state.loop_ms)

    {:noreply, state}
  end

  def expire_signs(state, time_fetcher) do
    current_dt = time_fetcher.()
    #alert_ids = alert_fetcher.()

    IO.puts("---state---")
    IO.inspect(state)

    converted = state
    |> Map.get(:signs)
    |> Enum.flat_map(fn sign -> expire_single_sign(sign, current_dt) end)

    IO.puts("---converted---")
    IO.inspect(converted)

    #|> Enum.flat_map(&expire_single_sign(&1, current_dt, alert_ids))
    state
    |> Map.get(:signs)
    |> Enum.flat_map(fn sign -> expire_single_sign(sign, current_dt) end)
    |> Enum.into(%{})
  end

  #@spec expire_single_sign({Sign.id(), Sign.t()}, DateTime.t()) :: [{Sign.id(), Sign.t()}]
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

  def expire_signs_via_time_and_alert(state, time_fetcher, alert_fetcher) do
    current_dt = time_fetcher.()
    alert_ids = alert_fetcher.()
    IO.puts("---expire_signs_via_time_and_alert---")
    IO.puts("---state---")
    IO.inspect(state)
    IO.puts("---current_dt---")
    IO.inspect(current_dt)
    IO.puts("---alert_ids---")
    IO.inspect(alert_ids)

    #converted = state
    #|> Map.get(:signs)
    #|> Enum.flat_map(expire_single_sign(state, current_dt, alert_ids))

    #IO.puts("---converted---")
    #IO.inspect(converted)

    state
    |> Map.get(:signs)
    |> Enum.flat_map(fn sign -> expire_single_sign(sign, current_dt, alert_ids) end)
    |> Enum.into(%{})
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

  @spec expire_signs_via_alert(list(SignsUi.Config.Sign.t()), MapSet.t()) ::
          list(any())
  def expire_signs_via_alert(sign_states, alert_ids) do
    expired_signs =
      expired_sign_states(
        sign_states,
        alert_ids,
        []
      )

    expired_signs
  end

  @spec expired_sign_states(
          list(SignsUi.Config.Sign.t()),
          MapSet.t(),
          list(SignsUi.Config.State.t())
        ) :: list(any())
  defp expired_sign_states([], _, expired_signs) do
    expired_signs
  end

  defp expired_sign_states([sign_state | sign_states], alert_ids, expired_signs) do
    cond do
      sign_state.config.mode == :auto ->
        expired_sign_states(sign_states, alert_ids, expired_signs)

      Enum.member?(alert_ids, sign_state.config.alert_id) ->
        expired_sign_states(sign_states, alert_ids, expired_signs)

      true ->
        new_sign_state = %SignsUi.Config.Sign{
          id: sign_state.id,
          config: %{mode: :auto}
        }

        expired_signs = [new_sign_state | expired_signs]
        expired_sign_states(sign_states, alert_ids, expired_signs)
    end
  end

  @spec active_alert_ids(SignsUi.Alerts.State.state()) ::
          MapSet.t(String.t())
  def active_alert_ids(alert_state) do
    alerts = alert_state.alerts
    routes = Map.keys(alerts)
    alert_ids = for route <- routes, do: Map.keys(alerts[route])

    MapSet.new(List.flatten(alert_ids))
  end

  #@spec expire_single_sign({Sign.id(), Sign.t()}, DateTime.t(), MapSet.t(String.t())) :: [{Sign.id(), Sign.t()}]
  defp expire_single_sign({id, %Sign{config: %{expires: expiration, alert_id: alert_id}} = sign},
    current_dt,
    alert_ids) do
    cond do
      ((not is_nil(expiration)) and DateTime.compare(expiration, current_dt) == :lt) ->
        [{id, %Sign{sign | config: %{mode: :auto}}}]
        #[%SignsUi.Config.Sign{
        #  id: sign.id,
        #  config: %{mode: :auto}
        #}]
      is_nil(alert_id) ->
        []
      not MapSet.member?(alert_ids, alert_id) ->
        #expire_signs_via_alert(sign, alert_ids)
        [{id, %Sign{sign | config: %{mode: :auto}}}]
      true ->
        []
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
