defmodule SignsUi.Signs.Messages do
  use GenServer

  @type message :: String.t

  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, opts)
  end

  def init(_opts) do
    {:ok, %{}}
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
    sta = message["sta"]
    [duration, zone_line, text] = String.split(message["c"], ["~", "-"])
    {zone, line_no} = String.split_at(zone_line, 1)
    line_no = String.to_integer(line_no)
    sign_id = "#{sta}-#{zone}"
    sign_lines = Map.get(messages, sign_id, ["", ""])
    sign_lines = List.replace_at(sign_lines, line_no - 1, text)
    SignsUiWeb.Endpoint.broadcast!("signs:all", "sign_update", %{sign_id: sign_id, line_number: line_no, text: text})
    messages = Map.put(messages, sign_id, sign_lines)
    {:reply, {:ok, messages}, messages}
  end
end
