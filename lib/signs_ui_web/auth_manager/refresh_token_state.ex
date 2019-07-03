defmodule SignsUiWeb.AuthManager.RefreshTokenState do
  require Logger
  use GenServer

  @type username :: String.t()
  @type refresh_token :: String.t()
  @type t :: %{username() => refresh_token()}

  @spec start_link(t()) :: GenServer.on_start()
  def start_link(opts \\ []) do
    name = opts[:name] || __MODULE__
    GenServer.start_link(__MODULE__, opts, name: name)
  end

  @spec query(username(), pid()) :: refresh_token() | nil
  def query(username, pid \\ __MODULE__) do
    GenServer.call(pid, {:query, username})
  end

  @spec store(username(), refresh_token(), pid()) :: :ok
  def store(username, refresh_token, pid \\ __MODULE__) do
    GenServer.cast(pid, {:store, username, refresh_token})
  end

  def init(_opts) do
    {:ok, %{}}
  end

  def handle_call({:query, username}, _from, state) do
    {:reply, Map.get(state, username), state}
  end

  def handle_cast({:store, username, refresh_token}, state) do
    new_state = Map.put(state, username, refresh_token)

    {:noreply, new_state}
  end
end
