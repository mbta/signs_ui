defmodule SignsUi.Config.ConfiguredHeadways do
  @moduledoc """
  Helpers for working with the ConfiguredHeadways data.
  """

  alias SignsUi.Config.ConfiguredHeadway
  @type t :: %{String.t() => %{String.t() => ConfiguredHeadway.t()}}

  def format_configured_headways_for_json(configured_headways) do
    Map.new(configured_headways, fn {branch_id, periods} ->
      {branch_id,
       Map.new(periods, fn {period_id, config} ->
         {period_id, ConfiguredHeadway.to_json(config)}
       end)}
    end)
  end

  @spec parse_configured_headways_json(map()) :: t()
  def parse_configured_headways_json(configured_headways) do
    Map.new(configured_headways, fn {branch_id, periods} ->
      {branch_id,
       Map.new(periods, fn {period_id, config} ->
         {period_id, ConfiguredHeadway.from_json(config)}
       end)}
    end)
  end
end
