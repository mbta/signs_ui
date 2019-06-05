defmodule SignsUi.Config.State do
  @moduledoc """
    Keeps an internal state of all the signs
  """
  use GenServer
  require Logger

  alias SignsUi.Config

  @type t :: %{
          Config.Sign.id() => Config.Sign.t()
        }

  def start_link(opts \\ []) do
    name = opts[:name] || __MODULE__
    GenServer.start_link(__MODULE__, [], name: name)
  end

  def get_all(pid \\ __MODULE__) do
    GenServer.call(pid, :get_all)
  end

  @spec update_some(GenServer.server(), %{Config.Sign.id() => Config.Sign.t()}) :: {:ok, t()}
  def update_some(pid \\ __MODULE__, changes) do
    GenServer.call(pid, {:update_some, changes})
  end

  @spec init(any()) :: {:ok, t()} | {:stop, any()}
  def init(_) do
    case Config.Request.get_signs() do
      {:ok, state} ->
        # re-save state, since format was updated
        save_changes(%{}, state)
        {:ok, state}

      {:error, reason} ->
        {:stop, reason}
    end
  end

  def handle_call(:get_all, _from, signs) do
    {:reply, signs, signs}
  end

  def handle_call({:update_some, changes}, _from, old_state) do
    new_state = save_changes(changes, old_state)
    {:reply, {:ok, new_state}, new_state}
  end

  @spec save_changes(t(), t()) :: t()
  defp save_changes(changes, old_state) do
    external_post_mod = Application.get_env(:signs_ui, :signs_external_post_mod)

    signs = Map.merge(old_state, changes)
    {:ok, _} = external_post_mod.update(signs)

    broadcast_data =
      signs
      |> Enum.map(fn {_id, sign} -> {sign.id, sign.config} end)
      |> Enum.into(%{})

    SignsUiWeb.Endpoint.broadcast!("signs:all", "new_sign_configs_state", broadcast_data)

    signs
  end
end
