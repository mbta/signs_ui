defmodule SignsUi.Config.State do
  @moduledoc """
    Keeps an internal state of all the signs
  """
  use GenServer
  require Logger

  alias SignsUi.Config
  alias SignsUi.Config.ConfiguredHeadways
  alias SignsUi.Config.SignGroups

  @type t :: %{
          signs: %{Config.Sign.id() => Config.Sign.t()},
          configured_headways: ConfiguredHeadways.t(),
          chelsea_bridge_announcements: String.t(),
          sign_groups: SignGroups.t()
        }

  @type route_id :: String.t()
  @type data :: map()

  def start_link(opts \\ []) do
    name = opts[:name] || __MODULE__
    GenServer.start_link(__MODULE__, [], name: name)
  end

  def get_all(pid \\ __MODULE__) do
    GenServer.call(pid, :get_all)
  end

  @spec update_sign_configs(GenServer.server(), %{Config.Sign.id() => Config.Sign.t()}) ::
          {:ok, t()}
  def update_sign_configs(pid \\ __MODULE__, changes) do
    GenServer.call(pid, {:update_sign_configs, changes})
  end

  @spec update_configured_headways(GenServer.server(), %{
          String.t() => Config.ConfiguredHeadway.t()
        }) ::
          {:ok, t()}
  def update_configured_headways(pid \\ __MODULE__, changes) do
    GenServer.call(pid, {:update_configured_headways, changes})
  end

  @spec update_chelsea_bridge_announcements(GenServer.server(), %{
          String.t() => String.t()
        }) ::
          {:ok, t()}
  def update_chelsea_bridge_announcements(pid \\ __MODULE__, changes) do
    GenServer.call(pid, {:update_chelsea_bridge_announcements, changes})
  end

  @spec update_sign_group_changes(GenServer.server(),
          %{
            String.t() => route_id(),
            String.t() => %{
              String.t() => data
            }
          }) ::
          {:ok, t()}
  def update_sign_group_changes(pid \\ __MODULE__, changes) do
    GenServer.call(pid, {:update_sign_group_changes, changes})
  end

  @spec init(any()) :: {:ok, t()} | {:stop, any()}
  def init(_) do
    case Config.Request.get_state() do
      {:ok, config} ->
        # re-save state, since format was updated
        save_state(config)

        {:ok, config}

      {:error, reason} ->
        {:stop, reason}
    end
  end

  def handle_call(:get_all, _from, signs) do
    {:reply, signs, signs}
  end

  def handle_call({:update_sign_configs, changes}, _from, old_state) do
    new_state = save_sign_config_changes(changes, old_state)
    {:reply, {:ok, new_state}, new_state}
  end

  def handle_call({:update_configured_headways, changes}, _from, old_state) do
    new_state = save_configured_headways_changes(changes, old_state)
    {:reply, {:ok, new_state}, new_state}
  end

  def handle_call({:update_chelsea_bridge_announcements, changes}, _from, old_state) do
    new_state = save_chelsea_bridge_announcements(changes, old_state)
    {:reply, {:ok, new_state}, new_state}
  end

  def handle_call({:update_sign_groups, changes}, _from, old_state) do
    new_state = save_sign_groups_changes(changes, old_state)
    {:reply, {:ok, new_state}, new_state}
  end

  @spec save_sign_config_changes(%{Config.Sign.id() => Config.Sign.t()}, t()) :: t()
  defp save_sign_config_changes(changes, %{signs: old_signs} = old_state) do
    signs = Map.merge(old_signs, changes)
    {:ok, _} = save_state(%{old_state | signs: signs})

    broadcast_data =
      signs
      |> Enum.map(fn {_id, sign} -> {sign.id, sign.config} end)
      |> Enum.into(%{})

    SignsUiWeb.Endpoint.broadcast!("signs:all", "new_sign_configs_state", broadcast_data)

    %{old_state | signs: signs}
  end

  @spec save_configured_headways_changes(%{String.t() => Config.ConfiguredHeadway.t()}, t()) ::
          t()
  defp save_configured_headways_changes(
         new_configured_headways,
         old_state
       ) do
    new_state = %{old_state | configured_headways: new_configured_headways}

    {:ok, _} = save_state(new_state)

    SignsUiWeb.Endpoint.broadcast!(
      "headways:all",
      "new_configured_headways_state",
      Config.ConfiguredHeadways.format_configured_headways_for_json(new_configured_headways)
    )

    new_state
  end

  @spec save_chelsea_bridge_announcements(String.t(), t()) :: t()
  defp save_chelsea_bridge_announcements(value, old_state) do
    new_state = Map.put(old_state, :chelsea_bridge_announcements, value)
    {:ok, _} = save_state(new_state)

    SignsUiWeb.Endpoint.broadcast!(
      "chelseaBridgeAnnouncements:all",
      "new_chelsea_bridge_announcements_state",
      %{chelsea_bridge_announcements: value}
    )

    new_state
  end

  defp save_sign_groups_changes(
         new_sign_groups,
         old_state
       ) do
    new_state = %{old_state | sign_groups: new_sign_groups}

    {:ok, _} = save_state(new_state)

    #SignsUiWeb.Endpoint.broadcast!(
    #  "headways:all",
    #  "new_configured_headways_state",
    #  Config.ConfiguredHeadways.format_configured_headways_for_json(new_configured_headways)
    #)

    new_state
  end

  defp save_state(new_state) do
    external_post_mod = Application.get_env(:signs_ui, :signs_external_post_mod)
    {:ok, _} = external_post_mod.update(new_state)
  end
end
