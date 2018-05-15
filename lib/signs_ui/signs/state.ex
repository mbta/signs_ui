defmodule SignsUI.Signs.State do
  @moduledoc """
    Keeps an internal state of all the signs
  """
  use GenServer
  require Logger
  alias SignsUI.Signs

  def start_link(opts \\ []) do
    name = opts[:name] || __MODULE__
    GenServer.start_link(__MODULE__, [], name: name)
  end

  def get_all(pid \\ __MODULE__) do
    GenServer.call(pid, :get_all)
  end

  def init(_) do
    signs_url = Application.get_env(:signs_ui, :signs_url)
    signs = Signs.Request.get_signs(signs_url)
    {:ok, signs}
  end

  def handle_call(:get_all, _from, signs) do
    {:reply, signs, signs}
  end
end
