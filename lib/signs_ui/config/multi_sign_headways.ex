defmodule SignsUi.Config.MultiSignHeadways do
  alias SignsUi.Config.MultiSignHeadway

  def format_multi_sign_headways_for_json(multi_sign_headways) do
    Map.new(multi_sign_headways, fn {branch_id, multi_sign_headway} ->
      {branch_id, MultiSignHeadway.to_json(multi_sign_headway)}
    end)
  end
end
