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

  def update(pid \\ __MODULE__, enabled_values) do
    GenServer.call(pid, {:update, enabled_values})
  end

  def init(_) do
    case Signs.Request.get_signs() do
      {:ok, state} -> {:ok, state}
      {:error, reason} -> {:stop, reason}
    end
  end

  def handle_call(:get_all, _from, signs) do
    {:reply, signs, signs}
  end
  def handle_call({:update, updated_signs}, _from, old_signs) do
    external_post_mod = Application.get_env(:signs_ui, :signs_external_post_mod)
    {status, new_sign_state} = updated_signs
                               |> external_post_mod.update()
                               |> handle_response(old_signs, updated_signs)

    {:reply, status, new_sign_state}
  end

  defp handle_response({:error, _reason}, old_signs, _updated_signs) do
    {:error, old_signs}
  end
  defp handle_response({:ok, _}, _old_signs, updated_signs) do
    {:ok, updated_signs}
  end
end
