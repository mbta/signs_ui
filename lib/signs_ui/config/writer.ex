defmodule SignsUi.Config.Writer do
  @moduledoc """
  Writes state updates out to storage
  """
  use GenStage

  alias SignsUi.Config

  def start_link(opts) do
    {name, opts} = Keyword.pop(opts, :name, __MODULE__)
    GenStage.start_link(__MODULE__, opts, name: name)
  end

  @impl true
  def init(opts) do
    producer =
      opts
      |> Keyword.get(:producer, SignsUi.Config.State)
      |> List.wrap()

    state = :ok

    {:consumer, state, subscribe_to: producer}
  end

  @impl true
  def handle_events(events, _from, state) do
    most_recent_state = List.last(events)

    unless is_nil(most_recent_state), do: save_state(most_recent_state)

    {:noreply, [], state}
  end

  defp save_state(%{
         signs: signs,
         configured_headways: configured_headways,
         chelsea_bridge_announcements: chelsea_bridge_announcements,
         sign_groups: sign_groups,
         sign_stops: sign_stops,
         scus_migrated: scus_migrated
       }) do
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
                 sign -> sign.config.mode == :headway or sign.config.mode == :static_text
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
  end
end
