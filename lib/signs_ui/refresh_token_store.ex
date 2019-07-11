defmodule SignsUi.RefreshTokenStore do
  @moduledoc """
  Stores refresh tokens for user authentication. Currently these are
  just kept in memory because there's only one instance of the
  application running and deploys / restarts are rare, but if need be
  the data could be moved into persistent storage in the future.
  """

  use Agent

  @type state :: %{
          String.t() => String.t()
        }

  def start_link(opts \\ []) do
    name = opts[:name] || __MODULE__
    Agent.start_link(fn -> %{} end, name: name)
  end

  @spec put_refresh_token(GenServer.server(), String.t(), String.t()) :: :ok
  def put_refresh_token(pid \\ __MODULE__, username, refresh_token) do
    Agent.update(pid, &Map.put(&1, username, refresh_token))
  end

  @spec get_refresh_token(GenServer.server(), String.t()) :: String.t() | nil
  def get_refresh_token(pid \\ __MODULE__, username) do
    Agent.get(pid, &Map.get(&1, username))
  end

  @spec clear_refresh_token(GenServer.server(), String.t()) :: :ok
  def clear_refresh_token(pid \\ __MODULE__, username) do
    Agent.update(pid, &Map.delete(&1, username))
  end
end
