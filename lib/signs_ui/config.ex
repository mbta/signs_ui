defmodule SignsUi.Config do
  @moduledoc """
  Keeps an internal state of all the signs
  """
  use Supervisor
  require Logger

  alias SignsUi.Config
  alias SignsUi.Config.Cleaner
  alias SignsUi.Config.ConfiguredHeadways
  alias SignsUi.Config.Sign
  alias SignsUi.Config.SignGroups
  alias SignsUi.Config.Utilities
  alias SignsUi.Config.Writer
  alias SignsUi.Setup

  @type t :: %{
          signs: %{Config.Sign.id() => Config.Sign.t()},
          configured_headways: ConfiguredHeadways.t(),
          chelsea_bridge_announcements: String.t(),
          sign_groups: SignGroups.t(),
          sign_stops: map(),
          scus_migrated: %{String.t() => boolean()}
        }
  @type cache() :: atom()

  @cache __MODULE__

  def start_link(opts \\ []) do
    name = opts[:name] || __MODULE__
    Supervisor.start_link(__MODULE__, opts, name: Module.concat(name, Supervisor))
  end

  @impl true
  def init(opts) do
    cache = opts[:name] || __MODULE__
    task_supervisor = Module.concat(cache, TaskSupervisor)

    children = [
      {Cachex, name: cache},
      {Task.Supervisor, name: task_supervisor},
      {Setup, fn -> setup(cache) end},
      {Cleaner, cache: cache},
      {Writer, cache: cache, task_supervisor: task_supervisor, name: writer_name(cache)}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end

  defp setup(cache) do
    config_store = Application.get_env(:signs_ui, :config_store)
    response = config_store.read() |> Jason.decode!()

    {sign_stops, scu_ids} = parse_signs_json()
    scu_lookup = Map.get(response, "scus_migrated", %{})

    state = %{
      signs:
        response
        |> Map.get("signs", %{})
        |> Map.new(fn {sign_id, config} -> {sign_id, Sign.from_json(sign_id, config)} end),
      configured_headways:
        response
        |> Map.get("configured_headways", %{})
        |> ConfiguredHeadways.parse_configured_headways_json(),
      chelsea_bridge_announcements: Map.get(response, "chelsea_bridge_announcements", "off"),
      sign_groups: response |> Map.get("sign_groups", %{}) |> SignGroups.from_json(),
      sign_stops: sign_stops,
      scus_migrated: Map.new(scu_ids, &{&1, Map.get(scu_lookup, &1, false)})
    }

    entries = Enum.map(state, &to_cachex_entry/1)
    Cachex.import(cache, entries)

    :ok
  end

  @doc """
  Gets all the current state.
  """
  @spec get_all(cache()) :: t()
  def get_all(cache \\ @cache) do
    cache
    |> Cachex.stream!()
    |> Map.new(&from_cachex_entry/1)
  end

  @doc """
  Updates the state with new sign configurations by merging them in.
  """
  @spec update_sign_configs(cache(), %{Config.Sign.id() => Config.Sign.t()}) ::
          {:ok, t()}
  def update_sign_configs(cache \\ @cache, changes) do
    new_state = save_sign_config_changes(cache, changes)

    {:ok, new_state}
  end

  @doc """
  Sets configured headways to the provided value.
  """
  @spec update_configured_headways(cache(), %{
          String.t() => Config.ConfiguredHeadway.t()
        }) ::
          {:ok, t()}
  def update_configured_headways(cache \\ @cache, changes) do
    new_state = save_configured_headways_changes(cache, changes)

    {:ok, new_state}
  end

  @doc """
  Sets Chelsea Bridge announcements to the provided value.
  """
  @spec update_chelsea_bridge_announcements(cache(), String.t()) ::
          {:ok, t()}
  def update_chelsea_bridge_announcements(cache \\ @cache, changes) do
    new_state = save_chelsea_bridge_announcements(cache, changes)

    {:ok, new_state}
  end

  @doc """
  Applies the given SignGroups changes (inserts, updates, and deletes).
  """
  @spec update_sign_groups(cache(), SignGroups.t()) :: {:ok, t()}
  def update_sign_groups(cache \\ @cache, changes) do
    old_state = get_all(cache)

    sign_config_changes = SignsUi.Config.SignGroupToSignConfigs.apply(changes, old_state)
    _new_sign_group_state = save_sign_group_changes(cache, changes, old_state)
    # TODO: Make sure this works right
    new_state = save_sign_config_changes(cache, sign_config_changes)

    {:ok, new_state}
  end

  @spec update_scu(cache(), String.t(), boolean()) :: :ok
  def update_scu(cache \\ @cache, id, migrated) do
    state = get_all(cache)

    state = update_in(state, [:scus_migrated], &Map.replace(&1, id, migrated))
    save_state(cache, state)

    :ok
  end

  @spec clean_configs(cache()) :: :ok
  def clean_configs(cache \\ @cache) do
    state = get_all(cache)
    %{signs: sign_configs} = state
    new_state = %{state | signs: Utilities.clean_configs(sign_configs)}
    save_state(cache, new_state)
    :ok
  end

  @spec save_sign_config_changes(cache(), %{Config.Sign.id() => Config.Sign.t()}) :: t()
  defp save_sign_config_changes(cache, changes) do
    signs = merge(cache, :signs, changes)

    broadcast_data =
      signs
      |> Enum.map(fn {_id, sign} -> {sign.id, sign.config} end)
      |> Enum.into(%{})

    SignsUiWeb.Endpoint.broadcast!("signs:all", "new_sign_configs_state", broadcast_data)

    get_all(cache)
  end

  @spec save_configured_headways_changes(
          cache(),
          %{String.t() => Config.ConfiguredHeadway.t()}
        ) ::
          t()
  defp save_configured_headways_changes(
         cache,
         new_configured_headways
       ) do
    put(cache, :configured_headways, new_configured_headways)

    # TODO: save_state(cache, new_state)

    SignsUiWeb.Endpoint.broadcast!(
      "headways:all",
      "new_configured_headways_state",
      Config.ConfiguredHeadways.format_configured_headways_for_json(new_configured_headways)
    )

    get_all(cache)
  end

  @spec save_chelsea_bridge_announcements(cache(), String.t()) :: t()
  defp save_chelsea_bridge_announcements(cache, value) do
    put(cache, :chelsea_bridge_announcements, value)
    # TODO: save_state(cache, new_state)

    SignsUiWeb.Endpoint.broadcast!(
      "chelseaBridgeAnnouncements:all",
      "new_chelsea_bridge_announcements_state",
      %{chelsea_bridge_announcements: value}
    )

    get_all(cache)
  end

  @spec save_sign_group_changes(cache(), SignGroups.t(), t()) :: t()
  defp save_sign_group_changes(cache, changes, old_state) do
    new_groups = Enum.reduce(changes, old_state.sign_groups, &SignGroups.update/2)

    new_state = %{old_state | sign_groups: new_groups}

    save_state(cache, new_state)

    SignsUiWeb.Endpoint.broadcast!(
      "signGroups:all",
      "new_sign_groups_state",
      SignGroups.by_route(new_groups)
    )

    new_state
  end

  defp save_state(cache, state) do
    Logger.info("[SignsUi.Config] saving state")

    entries = Enum.map(state, &to_cachex_entry/1)
    Cachex.import(cache, entries)

    cache
    |> writer_name()
    |> Writer.queue_write()
  end

  # sobelow_skip ["Traversal"]
  defp parse_signs_json do
    signs_json =
      :code.priv_dir(:signs_ui)
      |> Path.join("signs.json")
      |> File.read!()
      |> Jason.decode!(keys: :atoms)

    sign_stops =
      for %{id: id, source_config: %{sources: sources}} <- signs_json,
          %{stop_id: stop_id, routes: routes, direction_id: direction_id} <- sources,
          route_id <- routes,
          reduce: %{} do
        acc ->
          Map.update(
            acc,
            %{stop_id: stop_id, route_id: route_id, direction_id: direction_id},
            [id],
            &[id | &1]
          )
      end

    scu_ids =
      for %{scu_id: scu_id} <- signs_json,
          uniq: true do
        scu_id
      end

    {sign_stops, scu_ids}
  end

  defp from_cachex_entry({:entry, key, _touched, _ttl, value}), do: {key, value}

  defp to_cachex_entry({key, value}, touched \\ System.os_time()),
    do: {:entry, key, touched, nil, value}

  defp merge(cache, key, value) do
    {_, updated} =
      Cachex.get_and_update(cache, key, fn
        nil -> {:commit, value}
        current -> {:commit, Map.merge(current, value)}
      end)

    updated
  end

  defp put(cache, key, value) do
    {:ok, _} = Cachex.put(cache, key, value)
  end

  defp writer_name(cache), do: Module.concat(cache, Writer)
end
