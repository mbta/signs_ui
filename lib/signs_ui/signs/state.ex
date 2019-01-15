defmodule SignsUI.Signs.State do
  @moduledoc """
    Keeps an internal state of all the signs
  """
  use GenServer
  require Logger
  alias SignsUI.Signs

  @type t :: %{
          Signs.Sign.id() => Signs.Sign.t()
        }

  def start_link(opts \\ []) do
    name = opts[:name] || __MODULE__
    GenServer.start_link(__MODULE__, [], name: name)
  end

  def get_all(pid \\ __MODULE__) do
    GenServer.call(pid, :get_all)
  end

  @spec update(atom() | pid() | {atom(), any()} | {:via, atom(), any()}, any()) :: any()
  def update(_pid \\ __MODULE__, _enabled_values) do
    :ok
  end

  @spec update_some(GenServer.server(), %{Signs.Sign.id() => boolean()}) :: :ok
  def update_some(pid \\ __MODULE__, changes) do
    GenServer.call(pid, {:update_some, changes})
  end

  @spec init(any()) :: {:ok, t()} | {:stop, any()}
  def init(_) do
    case Signs.Request.get_signs() do
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

  defp save_changes(changes, old_state) do
    external_post_mod = Application.get_env(:signs_ui, :signs_external_post_mod)

    new_signs =
      changes
      |> Enum.map(fn {id, enabled?} -> {id, Signs.Sign.new(id, enabled?)} end)
      |> Enum.into(%{})

    signs = Map.merge(old_state, new_signs)
    {:ok, _} = external_post_mod.update(signs)
    signs
  end
end
