defmodule SignsUi.Config.ConfiguredHeadways do
  alias SignsUi.Config.ConfiguredHeadway

  def format_configured_headways_for_json(configured_headways) do
    Map.new(configured_headways, fn {branch_id, multi_sign_headway} ->
      {branch_id, ConfiguredHeadway.to_json(multi_sign_headway)}
    end)
  end
end
