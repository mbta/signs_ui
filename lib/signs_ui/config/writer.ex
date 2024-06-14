defmodule SignsUi.Config.Writer do
  @moduledoc """
  Writes out `SignsUi.Config` data to the configured store.

  There will always be at most one active task writing configuration.

  Multiple requests to write while an existing write is in-progress are
  de-duplicated and a single write will happen once the existing task
  completes.
  """
  use GenServer

  alias SignsUi.Config

  @enforce_keys [:cache, :task_supervisor]
  defstruct @enforce_keys ++ [:task, changes?: false]

  def start_link(opts) do
    {init_arg, opts} = Keyword.split(opts, [:cache, :task_supervisor])
    GenServer.start_link(__MODULE__, init_arg, opts)
  end

  @impl true
  def init(opts) do
    cache = Keyword.fetch!(opts, :cache)
    task_supervisor = Keyword.fetch!(opts, :task_supervisor)

    state = %__MODULE__{
      cache: cache,
      task_supervisor: task_supervisor
    }

    {:ok, state}
  end

  @impl true
  def handle_cast(:queue_write, state) do
    {:noreply, %{state | changes?: true}, {:continue, :process}}
  end

  @impl true
  def handle_continue(:process, %{changes?: true, task: nil} = state) do
    task = Task.Supervisor.async(state.task_supervisor, __MODULE__, :do_write, [state.cache])

    {:noreply, %{state | task: task, changes?: false}}
  end

  def handle_continue(_, state), do: {:noreply, state}

  @impl true
  def handle_info({:DOWN, ref, :process, _pid, _reason}, %{task: %{ref: ref}} = state) do
    {:noreply, %{state | task: nil}, {:continue, :process}}
  end

  def handle_info(_, state), do: {:noreply, state}

  @spec queue_write(GenServer.server()) :: :ok
  def queue_write(writer) do
    GenServer.cast(writer, :queue_write)
  end

  @doc false
  def do_write(cache) do
    config_store = Application.get_env(:signs_ui, :config_store)

    %{
      signs: signs,
      configured_headways: configured_headways,
      chelsea_bridge_announcements: chelsea_bridge_announcements,
      sign_groups: sign_groups,
      sign_stops: sign_stops,
      scus_migrated: scus_migrated
    } = SignsUi.Config.get_all(cache)

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

    :ok
  end
end
