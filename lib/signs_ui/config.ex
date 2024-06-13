defmodule SignsUi.Config do
  @moduledoc """
  Keeps an internal state of all the signs
  """
  use Supervisor
  require Logger

  alias SignsUi.Config
  alias SignsUi.Config.ConfiguredHeadways
  alias SignsUi.Config.Sign
  alias SignsUi.Config.SignGroups
  alias SignsUi.Setup
  # alias SignsUi.Config.Utilities

  @type t :: %{
          signs: %{Config.Sign.id() => Config.Sign.t()},
          configured_headways: ConfiguredHeadways.t(),
          chelsea_bridge_announcements: String.t(),
          sign_groups: SignGroups.t(),
          sign_stops: map(),
          scus_migrated: %{String.t() => boolean()}
        }

  @cache __MODULE__

  def start_link(opts \\ []) do
    name = opts[:name] || __MODULE__
    Supervisor.start_link(__MODULE__, opts, name: Module.concat(name, Supervisor))
  end

  @impl true
  def init(opts) do
    name = opts[:name] || __MODULE__

    children = [
      {Cachex, name: name},
      {Setup, fn -> setup(name) end}
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
  @spec get_all(atom()) :: t()
  def get_all(cache \\ @cache) do
    cache
    |> Cachex.stream!()
    |> Map.new(&from_cachex_entry/1)
  end

  @doc """
  Updates the state with new sign configurations by merging them in.
  """
  @spec update_sign_configs(atom(), %{Config.Sign.id() => Config.Sign.t()}) ::
          {:ok, t()}
  def update_sign_configs(cache \\ @cache, changes) do
    old_state = get_all(cache)

    new_state = save_sign_config_changes(cache, changes, old_state)

    {:ok, new_state}
  end

  @doc """
  Sets configured headways to the provided value.
  """
  @spec update_configured_headways(atom(), %{
          String.t() => Config.ConfiguredHeadway.t()
        }) ::
          {:ok, t()}
  def update_configured_headways(cache \\ @cache, changes) do
    old_state = get_all(cache)

    new_state = save_configured_headways_changes(cache, changes, old_state)

    {:ok, new_state}
  end

  @doc """
  Sets Chelsea Bridge announcements to the provided value.
  """
  @spec update_chelsea_bridge_announcements(atom(), %{
          String.t() => String.t()
        }) ::
          {:ok, t()}
  def update_chelsea_bridge_announcements(cache \\ @cache, changes) do
    old_state = get_all(cache)

    new_state = save_chelsea_bridge_announcements(cache, changes, old_state)

    {:ok, new_state}
  end

  @doc """
  Applies the given SignGroups changes (inserts, updates, and deletes).
  """
  @spec update_sign_groups(atom(), SignGroups.t()) :: {:ok, t()}
  def update_sign_groups(cache \\ @cache, changes) do
    old_state = get_all(cache)

    sign_config_changes = SignsUi.Config.SignGroupToSignConfigs.apply(changes, old_state)
    new_sign_group_state = save_sign_group_changes(cache, changes, old_state)
    new_state = save_sign_config_changes(cache, sign_config_changes, new_sign_group_state)

    {:ok, new_state}
  end

  @spec update_scu(atom(), String.t(), boolean()) :: :ok
  def update_scu(cache \\ @cache, id, migrated) do
    state = get_all(cache)

    state = update_in(state, [:scus_migrated], &Map.replace(&1, id, migrated))
    save_state(cache, state)

    :ok
  end

  # @impl true
  # def handle_info(:clean, %{signs: sign_configs} = state) do
  #   new_state = %{state | signs: Utilities.clean_configs(sign_configs)}
  #   save_state(new_state)
  #   schedule_clean()
  #   {:noreply, new_state}
  # end

  @spec save_sign_config_changes(atom(), %{Config.Sign.id() => Config.Sign.t()}, t()) :: t()
  defp save_sign_config_changes(cache, changes, %{signs: old_signs} = old_state) do
    signs = Map.merge(old_signs, changes)
    save_state(cache, %{old_state | signs: signs})

    broadcast_data =
      signs
      |> Enum.map(fn {_id, sign} -> {sign.id, sign.config} end)
      |> Enum.into(%{})

    SignsUiWeb.Endpoint.broadcast!("signs:all", "new_sign_configs_state", broadcast_data)

    %{old_state | signs: signs}
  end

  @spec save_configured_headways_changes(
          atom(),
          %{String.t() => Config.ConfiguredHeadway.t()},
          t()
        ) ::
          t()
  defp save_configured_headways_changes(
         cache,
         new_configured_headways,
         old_state
       ) do
    new_state = %{old_state | configured_headways: new_configured_headways}

    save_state(cache, new_state)

    SignsUiWeb.Endpoint.broadcast!(
      "headways:all",
      "new_configured_headways_state",
      Config.ConfiguredHeadways.format_configured_headways_for_json(new_configured_headways)
    )

    new_state
  end

  @spec save_chelsea_bridge_announcements(atom(), String.t(), t()) :: t()
  defp save_chelsea_bridge_announcements(cache, value, old_state) do
    new_state = Map.put(old_state, :chelsea_bridge_announcements, value)
    save_state(cache, new_state)

    SignsUiWeb.Endpoint.broadcast!(
      "chelseaBridgeAnnouncements:all",
      "new_chelsea_bridge_announcements_state",
      %{chelsea_bridge_announcements: value}
    )

    new_state
  end

  @spec save_sign_group_changes(atom(), SignGroups.t(), t()) :: t()
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

  defp save_state(
         cache,
         %{
           signs: signs,
           configured_headways: configured_headways,
           chelsea_bridge_announcements: chelsea_bridge_announcements,
           sign_groups: sign_groups,
           sign_stops: sign_stops,
           scus_migrated: scus_migrated
         } = state
       ) do
    config_store = Application.get_env(:signs_ui, :config_store)

    Jason.encode!(
      %{
        "signs" => Config.Signs.format_signs_for_json(signs),
        "configured_headways" =>
          Config.ConfiguredHeadways.format_configured_headways_for_json(configured_headways),
        "chelsea_bridge_announcements" => chelsea_bridge_announcements,
        "sign_groups" => sign_groups,
        "scus_migrated" => scus_migrated
      },
      pretty: true
    )
    |> config_store.write()

    for {%{stop_id: stop_id, route_id: route_id, direction_id: direction_id}, ids} <- sign_stops do
      %{
        stop_id: stop_id,
        route_id: route_id,
        direction_id: direction_id,
        predictions:
          if Enum.any?(ids, fn id ->
               case signs[id] do
                 nil -> false
                 sign -> sign.config.mode == :headway
               end
             end) do
            "flagged"
          else
            "normal"
          end
      }
    end
    |> then(&%{"stops" => &1})
    |> Jason.encode!(pretty: true)
    |> config_store.write_stops()

    entries = Enum.map(state, &to_cachex_entry/1)
    Cachex.import(cache, entries)
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
end
