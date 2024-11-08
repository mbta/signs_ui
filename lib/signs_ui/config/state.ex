defmodule SignsUi.Config.State do
  @moduledoc """
    Keeps an internal state of all the signs
  """
  use GenStage
  require Logger

  alias SignsUi.Config
  alias SignsUi.Config.ConfiguredHeadways
  alias SignsUi.Config.Sign
  alias SignsUi.Config.SignGroups
  alias SignsUi.Config.Utilities
  alias SignsUi.Signs

  @sl_waterfront_route_ids ["741", "742", "743", "746"]

  @type t :: %{
          signs: %{Config.Sign.id() => Config.Sign.t()},
          configured_headways: ConfiguredHeadways.t(),
          chelsea_bridge_announcements: String.t(),
          sign_groups: SignGroups.t(),
          sign_stops: map(),
          scus_migrated: %{String.t() => boolean()}
        }

  def start_link(opts \\ []) do
    name = opts[:name] || __MODULE__
    GenStage.start_link(__MODULE__, [], name: name)
  end

  @doc """
  Gets all the current state.
  """
  @spec get_all(GenStage.stage()) :: t()
  def get_all(pid \\ __MODULE__) do
    GenStage.call(pid, :get_all)
  end

  @doc """
  Updates the state with new sign configurations by merging them in.
  """
  @spec update_sign_configs(GenStage.stage(), %{Config.Sign.id() => Config.Sign.t()}) ::
          {:ok, t()}
  def update_sign_configs(pid \\ __MODULE__, changes) do
    GenStage.call(pid, {:update_sign_configs, changes})
  end

  @doc """
  Sets configured headways to the provided value.
  """
  @spec update_configured_headways(GenStage.stage(), %{
          String.t() => Config.ConfiguredHeadway.t()
        }) ::
          {:ok, t()}
  def update_configured_headways(pid \\ __MODULE__, changes) do
    GenStage.call(pid, {:update_configured_headways, changes})
  end

  @doc """
  Sets Chelsea Bridge announcements to the provided value.
  """
  @spec update_chelsea_bridge_announcements(GenStage.stage(), %{
          String.t() => String.t()
        }) ::
          {:ok, t()}
  def update_chelsea_bridge_announcements(pid \\ __MODULE__, changes) do
    GenStage.call(pid, {:update_chelsea_bridge_announcements, changes})
  end

  @doc """
  Applies the given SignGroups changes (inserts, updates, and deletes).
  """
  @spec update_sign_groups(GenStage.stage(), SignGroups.t()) :: {:ok, t()}
  def update_sign_groups(pid \\ __MODULE__, changes) do
    GenStage.call(pid, {:update_sign_groups, changes})
  end

  @spec update_scu(GenStage.stage(), String.t(), boolean()) :: :ok
  def update_scu(pid \\ __MODULE__, id, migrated) do
    GenStage.call(pid, {:update_scu, id, migrated})
  end

  @impl true
  def init(_) do
    schedule_clean(self(), 60_000)
    config_store = Application.get_env(:signs_ui, :config_store)
    response = config_store.read() |> Jason.decode!()

    {sign_stops, scu_ids} = Signs.Config.get() |> parse_signs_config()
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

    {:producer, state}
  end

  @impl true
  def handle_call(:get_all, _from, signs) do
    {:reply, signs, [], signs}
  end

  def handle_call({:update_sign_configs, changes}, _from, old_state) do
    new_state = save_sign_config_changes(changes, old_state)
    {:reply, {:ok, new_state}, [new_state], new_state}
  end

  def handle_call({:update_configured_headways, changes}, _from, old_state) do
    new_state = save_configured_headways_changes(changes, old_state)
    {:reply, {:ok, new_state}, [new_state], new_state}
  end

  def handle_call({:update_chelsea_bridge_announcements, changes}, _from, old_state) do
    new_state = save_chelsea_bridge_announcements(changes, old_state)
    {:reply, {:ok, new_state}, [new_state], new_state}
  end

  def handle_call({:update_sign_groups, changes}, _from, old_state) do
    sign_config_changes = SignsUi.Config.SignGroupToSignConfigs.apply(changes, old_state)
    new_sign_group_state = save_sign_group_changes(changes, old_state)
    new_state = save_sign_config_changes(sign_config_changes, new_sign_group_state)
    {:reply, {:ok, new_state}, [new_state], new_state}
  end

  def handle_call({:update_scu, id, migrated}, _from, state) do
    state = update_in(state, [:scus_migrated], &Map.replace(&1, id, migrated))
    {:reply, :ok, [state], state}
  end

  @impl true
  def handle_info(:clean, %{signs: sign_configs} = state) do
    schedule_clean(self(), 60_000)
    new_state = %{state | signs: Utilities.clean_configs(sign_configs)}
    {:noreply, [new_state], new_state}
  end

  @impl true
  def handle_demand(_, state) do
    {:noreply, [], state}
  end

  @spec save_sign_config_changes(%{Config.Sign.id() => Config.Sign.t()}, t()) :: t()
  defp save_sign_config_changes(changes, %{signs: old_signs} = old_state) do
    signs = Map.merge(old_signs, changes)

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

    SignsUiWeb.Endpoint.broadcast!(
      "chelseaBridgeAnnouncements:all",
      "new_chelsea_bridge_announcements_state",
      %{chelsea_bridge_announcements: value}
    )

    new_state
  end

  @spec save_sign_group_changes(SignGroups.t(), t()) :: t()
  defp save_sign_group_changes(changes, old_state) do
    new_groups = Enum.reduce(changes, old_state.sign_groups, &SignGroups.update/2)

    new_state = %{old_state | sign_groups: new_groups}

    SignsUiWeb.Endpoint.broadcast!(
      "signGroups:all",
      "new_sign_groups_state",
      SignGroups.by_route(new_groups)
    )

    new_state
  end

  defp parse_signs_config(signs_json) do
    sl_sign_stops =
      for %{id: id, configs: configs} <- signs_json,
          %{sources: sources} <- configs,
          %{stop_id: stop_id, route_id: route_id, direction_id: direction_id}
          when route_id in @sl_waterfront_route_ids <- sources,
          reduce: %{} do
        acc ->
          Map.update(
            acc,
            %{stop_id: stop_id, route_id: route_id, direction_id: direction_id},
            [id],
            &[id | &1]
          )
      end

    subway_sign_stops =
      for %{id: id, source_config: %{sources: sources}} <- signs_json,
          %{stop_id: stop_id, routes: routes, direction_id: direction_id} <- sources,
          route_id <- routes,
          reduce: sl_sign_stops do
        acc ->
          Map.update(
            acc,
            %{stop_id: stop_id, route_id: route_id, direction_id: direction_id},
            [id],
            &[id | &1]
          )
      end

    include_all_bidirectional_signs =
      for %{id: id, source_config: [_ | _] = source_config} <- signs_json,
          %{sources: sources} <- source_config,
          %{stop_id: stop_id, routes: routes, direction_id: direction_id} <- sources,
          route_id <- routes,
          reduce: subway_sign_stops do
        acc ->
          Map.update(
            acc,
            %{stop_id: stop_id, route_id: route_id, direction_id: direction_id},
            [id],
            &[id | &1]
          )
      end

    singular_bidirectionals =
      Enum.group_by(
        include_all_bidirectional_signs,
        fn {stop, signs} -> {stop.route_id, signs} end,
        &elem(&1, 0)
      )
      |> Enum.filter(fn {_, stops} ->
        Enum.uniq_by(stops, & &1.direction_id) |> length() > 1
      end)
      |> Enum.reduce(%{}, fn {{_, signs}, stops}, acc ->
        Enum.into(stops, acc, fn stop -> {stop, signs} end)
      end)

    scu_ids =
      for %{scu_id: scu_id} <- signs_json,
          uniq: true do
        scu_id
      end

    {Map.merge(subway_sign_stops, singular_bidirectionals), scu_ids}
  end

  defp schedule_clean(pid, ms) do
    Process.send_after(pid, :clean, ms)
  end
end
