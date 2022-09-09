defmodule SignsUi.Config.Utilities do
  @moduledoc """
  Utility functions for interacting with the arinc_to_realtime.json file
  """

  def clean_configs(sign_configs) do
    registered_ids = get_realtime_ids()

    :maps.filter(
      fn key, _ ->
        key in registered_ids
      end,
      sign_configs
    )
  end

  def get_realtime_ids do
    Map.values(get_arinc_to_realtime_mapping())
  end

  # sobelow_skip ["Traversal"]
  def get_arinc_to_realtime_mapping do
    :signs_ui
    |> :code.priv_dir()
    |> Path.join("arinc_to_realtime.json")
    |> File.read!()
    |> Jason.decode!()
  end
end
