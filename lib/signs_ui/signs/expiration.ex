defmodule SignsUI.Signs.Expiration do
  @moduledoc """
  Handle cleaning up settings in the configuration that have since expired
  """
  use GenServer

  @type state :: %{
          time_fetcher: (() -> DateTime.t()),
          loop_ms: integer(),
          sign_state_server: GenServer.server()
        }

  @spec start_link(Keyword.t()) :: GenServer.on_start()
  def start_link(opts \\ []) do
    name = Keyword.get(opts, :name) || __MODULE__

    GenServer.start_link(__MODULE__, opts, name: name)
  end

  @spec init(Keyword.t()) :: {:ok, state()}
  def init(opts) do
    time_fetcher = Keyword.get(opts, :time_fetcher) || fn -> DateTime.utc_now() end
    loop_ms = Keyword.get(opts, :loop_ms) || 5_000
    sign_state_server = Keyword.get(opts, :sign_state_server) || SignsUI.Signs.State
    schedule_loop(self(), loop_ms)
    {:ok, %{time_fetcher: time_fetcher, loop_ms: loop_ms, sign_state_server: sign_state_server}}
  end

  @spec handle_info(:process_expired, state()) :: state()
  def handle_info(:process_expired, state) do
    expire_signs(state.time_fetcher, state.sign_state_server)

    schedule_loop(self(), state.loop_ms)

    {:noreply, state}
  end

  @spec expire_signs((() -> DateTime.t()), GenServer.server()) :: :ok
  def expire_signs(time_fetcher, sign_state_server) do
    signs =
      SignsUI.Signs.State.get_all(sign_state_server)
      |> Enum.map(&expire_single_sign(&1, time_fetcher))
      |> Enum.into(%{})

    SignsUI.Signs.State.update_some(sign_state_server, signs)
  end

  @spec expire_single_sign(
          {SignsUI.Signs.Sign.id(), SignsUI.Signs.Sign.t()},
          (() -> DateTime.t())
        ) :: {SignsUI.Signs.Sign.id(), SignsUI.Signs.Sign.t()}
  defp expire_single_sign(
         {id, %SignsUI.Signs.Sign{config: %{expires: expiration}} = sign},
         time_fetcher
       ) do
    {:ok, expiration_dt, 0} = DateTime.from_iso8601(expiration)

    if expiration != nil and DateTime.compare(expiration_dt, time_fetcher.()) == :lt do
      {id,
       %SignsUI.Signs.Sign{
         sign
         | config: %{mode: :auto}
       }}
    else
      {id, sign}
    end
  end

  defp expire_single_sign({id, sign}, _) do
    {id, sign}
  end

  @spec schedule_loop(pid(), integer()) :: reference()
  defp schedule_loop(pid, loop_ms) do
    Process.send_after(pid, :process_expired, loop_ms)
  end
end
