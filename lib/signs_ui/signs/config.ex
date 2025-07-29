defmodule SignsUi.Signs.Config do
  @moduledoc """
  Contains a copy of `signs.json` from `realtime_signs`, and functions for looking up data in it.
  """

  @config_path Mix.Project.deps_paths()
               |> Map.fetch!(:realtime_signs)
               |> Path.join("signs.json")
  @config @config_path |> File.read!() |> Jason.decode!(keys: :atoms)
  @external_resource @config_path

  def get, do: @config
end
