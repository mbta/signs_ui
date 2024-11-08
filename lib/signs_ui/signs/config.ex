defmodule SignsUi.Signs.Config do
  @moduledoc """
  Contains a copy of `signs.json` from `realtime_signs`, and functions for looking up data in it.
  """

  @config_path Mix.Project.deps_paths()
               |> Map.fetch!(:realtime_signs)
               |> Path.join("signs.json")
  @config @config_path |> File.read!() |> Jason.decode!(keys: :atoms)
  @external_resource @config_path

  @station_codes Map.new(@config, fn %{
                                       scu_id: scu_id,
                                       text_zone: text_zone,
                                       pa_ess_loc: pa_ess_loc
                                     } ->
                   {{scu_id, text_zone}, pa_ess_loc}
                 end)

  def get, do: @config

  @spec station_code(String.t(), String.t()) :: String.t() | nil
  def station_code(scu_id, zone), do: Map.get(@station_codes, {scu_id, zone})
end
