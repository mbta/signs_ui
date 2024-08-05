defmodule SignsUi.Signs.Lookup do
  @moduledoc """
  Utility process for looking things up via signs.json
  """
  use Agent

  # sobelow_skip ["Traversal"]
  def start_link([]) do
    Agent.start_link(
      fn ->
        :code.priv_dir(:signs_ui)
        |> Path.join("signs.json")
        |> File.read!()
        |> Jason.decode!(keys: :atoms)
        |> Map.new(fn %{scu_id: scu_id, text_zone: text_zone, pa_ess_loc: pa_ess_loc} ->
          {{scu_id, text_zone}, pa_ess_loc}
        end)
      end,
      name: __MODULE__
    )
  end

  def lookup_station_code(scu_id, zone) do
    Agent.get(__MODULE__, &Map.get(&1, {scu_id, zone}))
  end
end
