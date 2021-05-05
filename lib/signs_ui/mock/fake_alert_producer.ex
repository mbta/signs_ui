defmodule SignsUi.Mock.FakeAlertProducer do
  use GenServer

  def start_link(args) do
    GenServer.start_link(__MODULE__, args)
  end

  @impl GenServer
  def init(state), do: {:ok, state}
end
