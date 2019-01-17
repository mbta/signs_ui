defmodule SignsUI.Signs.Expiration do
  @moduledoc """
  Handle cleaning up settings in the configuration that have since expired
  """

  @type state :: %{
          time_fetcher: (() -> DateTime.t()),
          loop_ms: integer()
        }

  @spec start_link(Keyword.t()) :: GenServer.on_start()
  def start_link(opts \\ []) do
    name = opts[:name] || __MODULE__

    GenServer.start_link(__MODULE__, opts, name: name)
  end

  @spec init(Keyword.t()) :: {:ok, state()}
  def init(opts) do
    time_fetcher = opts[:time_fetcher] || fn -> DateTime.utc_now() end
    loop_ms = opts[:loop_ms] || 5_000
    schedule_loop(self(), loop_ms)
    {:ok, %{time_fetcher: time_fetcher, loop_ms: loop_ms}}
  end

  @spec handle_info(:process_expired, state()) :: state()
  def handle_info(:process_expired, state) do
    signs =
      SignsUI.Signs.State.get_all()
      |> Enum.map(&expire_sign(&1, state))
      |> Enum.into(%{})

    SignsUI.Signs.State.update_some(signs)

    schedule_loop(self(), state.loop_ms)

    {:noreply, state}
  end

  @spec expire_sign({SignsUI.Signs.Sign.id(), SignsUI.Signs.Sign.t()}, state()) ::
          {SignsUI.Signs.Sign.id(), SignsUI.Signs.Sign.t()}
  defp expire_sign({id, %{expires: expiration} = sign}, state) do
    if expiration and DateTime.compare(expiration, state.time_fetcher.()) == :lt do
      {id,
       %SignsUI.Signs.Sign{
         sign
         | config: %{mode: :auto}
       }}
    else
      {id, sign}
    end
  end

  defp expire_sign({id, sign}, _) do
    {id, sign}
  end

  @spec schedule_loop(pid(), integer()) :: reference()
  defp schedule_loop(pid, loop_ms) do
    Process.send_after(pid, :process_expired, loop_ms)
  end
end
