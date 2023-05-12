defmodule Utilities.Common do
  @moduledoc false

  def parse_station_and_zones(station_and_zones) do
    {station, zone_map} = String.split_at(station_and_zones, -6)

    zones =
      for {c, i} <- Enum.with_index(["m", "c", "n", "s", "e", "w"]),
          String.at(zone_map, i) == "1" do
        c
      end

    {station, zones}
  end

  def parse_av_type("0"), do: :audio_visual
  def parse_av_type("1"), do: :audio
  def parse_av_type("2"), do: :visual
end
