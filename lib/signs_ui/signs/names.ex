defmodule SignsUI.Signs.Names do

  def sign_routes() do
    %{
      mattapan: "Mattapan",
      silver_line: "Silver Line",
      blue: "Blue Line"
    }
  end

  def mattapan() do
    [
      {"ashmont_mezzanine", "Ashmont Mezzanine"},
      {"cedar_grove_outbound", "Cedar Grove Outbound"},
      {"cedar_grove_inbound", "Cedar Grove Inbound"},
      {"butler_outbound", "Butler Outbound"},
      {"butler_inbound", "Butler Inbound"},
      {"milton_outbound", "Milton Outbound"},
      {"milton_inbound", "Milton Inbound"},
      {"central_avenue_outbound", "Central Avenue Outbound"},
      {"central_avenue_inbound", "Central Avenue Inbound"},
      {"valley_road_outbound", "Valley Road Outbound"},
      {"valley_road_inbound", "Valley Road Inbound"},
      {"capen_street_outbound", "Capen Street Outbound"},
      {"capen_street_inbound", "Capen Street Inbound"},
    ]
  end

  def silver_line() do
    [
      {"chelsea_inbound", "Chelsea Inbound"},
      {"bellingham_square_inbound", "Bellingham Square Inbound"},
      {"bellingham_square_outbound", "Bellingham Square Outbound"},
      {"box_district_inbound", "Box District Inbound"},
      {"box_district_outbound", "Box District Outbound"},
      {"eastern_ave_inbound", "Eastern Ave Inbound"},
      {"eastern_ave_outbound", "Eastern Ave Outbound"},
      {"south_station_silver_line_outbound", "South Station Silver Line Outbound"},
      {"courthouse_station_outbound", "Courthouse Station Outbound"},
      {"world_trade_center_outbound", "World Trade Center Outbound"},
      {"world_trade_center_mezzanine", "World Trade Center Mezzanine"},
      {"courthouse_station_mezzanine", "Courthouse Station Mezzanine"},
      {"south_station_mezzanine", "South Station Mezzanine"},
    ]
  end

  def blue_line() do
    [
      {"wonderland_westbound", "Wonderland Westbound"},
      {"wonderland_mezzanine", "Wonderland Mezzanine"},
      {"revere_beach_eastbound", "Revere Beach Eastbound"},
      {"revere_beach_mezzanine_westbound", "Revere Beach Mezzanine Westbound"},
      {"revere_beach_mezzanine_eastbound", "Revere Beach Mezzanine Eastbound"},
      {"revere_beach_westbound", "Revere Beach Westbound"},
      {"beachmont_westbound", "Beachmont Westbound"},
      {"beachmont_eastbound", "Beachmont Eastbound"},
      {"suffolk_downs_eastbound", "Suffolk Downs Eastbound"},
      {"suffolk_downs_westbound", "Suffolk Downs Westbound"},
      {"orient_heights_eastbound", "Orient Heights Eastbound"},
      {"orient_heights_mezzanine_westbound", "Orient Heights Mezzanine Westbound"},
      {"orient_heights_mezzanine_eastbound", "Orient Heights Mezzanine Eastbound"},
      {"orient_heights_westbound", "Orient Heights Westbound"},
      {"wood_island_eastbound", "Wood Island Eastbound"},
      {"wood_island_mezzanine_westbound", "Wood Island Mezzanine Westbound"},
      {"wood_island_mezzanine_eastbound", "Wood Island Mezzanine Eastbound"},
      {"wood_island_westbound", "Wood Island Westbound"},
      {"airport_eastbound", "Airport Eastbound"},
      {"airport_westbound", "Airport Westbound"},
      {"maverick_eastbound", "Maverick Eastbound"},
      {"maverick_westbound", "Maverick Westbound"},
      {"aquarium_eastbound", "Aquarium Eastbound"},
      {"aquarium_mezzanine_westbound", "Aquarium Mezzanine Westbound"},
      {"aquarium_mezzanine_eastbound", "Aquarium Mezzanine Eastbound"},
      {"aquarium_westbound", "Aquarium Westbound"},
      {"state_blue_eastbound", "State Eastbound"},
      {"state_blue_mezzanine_westbound", "State Mezzanine Westbound"},
      {"state_blue_mezzanine_eastbound", "State Mezzanine Eastbound"},
      {"state_blue_westbound", "State Westbound"},
      {"government_center_eastbound", "Government Center Eastbound"},
      {"government_center_mezzanine_westbound", "Government Center Mezzanine Westbound"},
      {"government_center_mezzanine_eastbound", "Government Center Mezzanine Eastbound"},
      {"government_center_westbound", "Government Center Westbound"},
      {"bowdoin_eastbound", "Bowdoin Eastbound"},
      {"bowdoin_mezzanine", "Bowdoin Mezzanine"}
    ]
  end
end
