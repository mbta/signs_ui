defmodule SignsUi.Signs.Messages do
  use GenServer

  @type message :: String.t

  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, opts)
  end

  def init(_opts) do
    {:ok, []}
  end

  def list_messages(pid \\ __MODULE__) do
    GenServer.call(pid, :list_messages)
  end

  def add_message(pid \\ __MODULE__, message) do
    GenServer.call(pid, {:add_message, message})
  end

  def handle_call(:list_messages, _from, messages) do
    {:reply, messages, messages}
  end

  def handle_call({:add_message, message}, _from, messages) do
    SignsUiWeb.Endpoint.broadcast!("signs:all", "new_msg", %{body: "#{inspect(message)}"})
    messages = Enum.take([message | messages], 10)
    {:reply, {:ok, messages}, messages}
  end
end
