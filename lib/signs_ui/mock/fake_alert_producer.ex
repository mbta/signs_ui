defmodule SignsUi.Mock.FakeAlertProducer do
  @moduledoc """
  A stub GenServer for testing SignsUi.Alerts.State.
  """
  use GenServer

  def start_link(args) do
    GenServer.start_link(__MODULE__, args)
  end

  @impl GenServer
  def init(state), do: {:ok, state}
end
