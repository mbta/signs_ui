defmodule SignsUi.Config.Cleaner do
  @moduledoc """
  Regularly calls `SignsUi.Config.clean_configs/1`
  """
  use GenServer
  require Logger

  @interval :timer.minutes(1)

  @enforce_keys [:cache]
  defstruct @enforce_keys

  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts)
  end

  @impl true
  def init(opts) do
    cache = Keyword.fetch!(opts, :cache)

    state = %__MODULE__{cache: cache}

    schedule_clean()

    {:ok, state}
  end

  @impl true
  def handle_info(:clean, %{cache: cache} = state) do
    Logger.info("[SignsUi.Config.Cleaner] cleaning configs")
    :ok = SignsUi.Config.clean_configs(cache)

    schedule_clean()

    {:noreply, state}
  end

  defp schedule_clean do
    Process.send_after(self(), :clean, @interval)
  end
end
