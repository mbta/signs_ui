defmodule SignsUi.TestUpdater do
  use GenServer
  require Logger

  def start_link do
    GenServer.start_link(__MODULE__, [])
  end

  def init([]) do
    schedule_loop(self())
    {:ok, 0}
  end

  def handle_info(:loop, n) do
    SignsUiWeb.Endpoint.broadcast!("signs:all", "new_msg", %{body: "message #{n}"})
    schedule_loop(self())
    {:noreply, n+1}
  end

  defp schedule_loop(pid) do
    Process.send_after(pid, :loop, 2_000)
  end
end
