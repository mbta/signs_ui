defmodule SignsUI.Signs.Names do

  def sign_routes() do
    %{
      mattapan: "Mattapan",
      silver: "Silver Line",
      blue: "Blue Line",
      orange: "Orange Line"
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
      {"bowdoin_mezzanine", "Bowdoin Mezzanine"},
    ]
  end

  def orange_line() do
    [
      {"oak_grove_mezzanine_northbound", "Oak Grove Mezzanine Northbound"},
      {"oak_grove_mezzanine_southbound", "Oak Grove Mezzanine Southbound"},
      {"oak_grove_northbound", "Oak Grove Northbound"},
      {"oak_grove_southbound", "Oak Grove Southbound"},
      {"oak_grove_eastbound", "Oak Grove Eastbound"},
      {"malden_center_mezzanine_northbound", "Malden Center Mezzanine Northbound"},
      {"malden_center_mezzanine_southbound", "Malden Center Mezzanine Southbound"},
      {"wellington_mezzanine_northbound", "Wellington Mezzanine Northbound"},
      {"wellington_mezzanine_southbound", "Wellington Mezzanine Southbound"},
      {"wellington_northbound", "Wellington Northbound"},
      {"wellington_southbound", "Wellington Southbound"},
      {"assembly_mezzanine_northbound", "Assembly Mezzanine Northbound"},
      {"assembly_mezzanine_southbound", "Assembly Mezzanine Southbound"},
      {"assembly_northbound", "Assembly Northbound"},
      {"assembly_southbound", "Assembly Southbound"},
      {"sullivan_mezzanine_northbound", "Sullivan Mezzanine Northbound"},
      {"sullivan_mezzanine_southbound", "Sullivan Mezzanine Southbound"},
      {"sullivan_northbound", "Sullivan Northbound"},
      {"sullivan_southbound", "Sullivan Southbound"},
      {"community_college_mezzanine_northbound", "Community College Mezzanine Northbound"},
      {"community_college_mezzanine_southbound", "Community College Mezzanine Southbound"},
      {"community_college_northbound", "Community College Northbound"},
      {"community_college_southbound", "Community College Southbound"},
      {"orange_north_station_northbound", "Orange North Station Northbound"},
      {"orange_north_station_southbound", "Orange North Station Southbound"},
      {"orange_north_station_center_northbound", "Orange North Station Center Northbound"},
      {"orange_north_station_center_southbound", "Orange North Station Center Southbound"},
      {"orange_north_station_mezzanine_northbound", "Orange North Station Mezzanine Northbound"},
      {"orange_north_station_mezzanine_southbound", "Orange North Station Mezzanine Southbound"},
      {"orange_haymarket_mezzanine_northbound", "Orange Haymarket Mezzanine Northbound"},
      {"orange_haymarket_mezzanine_southbound", "Orange Haymarket Mezzanine Southbound"},
      {"orange_haymarket_northbound", "Orange Haymarket Northbound"},
      {"orange_haymarket_southbound", "Orange Haymarket Southbound"},
      {"orange_state_mezzanine_northbound", "Orange State Mezzanine Northbound"},
      {"orange_state_mezzanine_southbound", "Orange State Mezzanine Southbound"},
      {"orange_state_northbound", "Orange State Northbound"},
      {"orange_state_southbound", "Orange State Southbound"},
      {"orange_downtown_crossing_northbound", "Orange Downtown Crossing Northbound"},
      {"downtown_crossing_southbound", "Downtown Crossing Southbound"},
      {"chinatown_mezzanine_northbound", "Chinatown Mezzanine Northbound"},
      {"chinatown_mezzanine_southbound", "Chinatown Mezzanine Southbound"},
      {"chinatown_northbound", "Chinatown Northbound"},
      {"chinatown_southbound", "Chinatown Southbound"},
      {"new_england_medical_mezzanine_northbound", "New England Medical Mezzanine Northbound"},
      {"new_england_medical_mezzanine_southbound", "New England Medical Mezzanine Southbound"},
      {"new_england_medical_northbound", "New England Medical Northbound"},
      {"new_england_medical_southbound", "New England Medical Southbound"},
      {"back_bay_mezzanine_northbound", "Back Bay Mezzanine Northbound"},
      {"back_bay_mezzanine_southbound", "Back Bay Mezzanine Southbound"},
      {"back_bay_northbound", "Back Bay Northbound"},
      {"back_bay_southbound", "Back Bay Southbound"},
      {"mass_ave_mezzanine_northbound", "Mass Ave Mezzanine Northbound"},
      {"mass_ave_mezzanine_southbound", "Mass Ave Mezzanine Southbound"},
      {"mass_ave_northbound", "Mass Ave Northbound"},
      {"mass_ave_southbound", "Mass Ave Southbound"},
      {"ruggles_northbound", "Ruggles Northbound"},
      {"ruggles_southbound", "Ruggles Southbound"},
      {"ruggles_center_northbound", "Ruggles Center Northbound"},
      {"ruggles_center_southbound", "Ruggles Center Southbound"},
      {"ruggles_mezzanine_northbound", "Ruggles Mezzanine Northbound"},
      {"ruggles_mezzanine_southbound", "Ruggles Mezzanine Southbound"},
      {"roxbury_crossing_mezzanine_northbound", "Roxbury Crossing Mezzanine Northbound"},
      {"roxbury_crossing_mezzanine_southbound", "Roxbury Crossing Mezzanine Southbound"},
      {"roxbury_crossing_northbound", "Roxbury Crossing Northbound"},
      {"roxbury_crossing_southbound", "Roxbury Crossing Southbound"},
      {"jackson_square_mezzanine_northbound", "Jackson Square Mezzanine Northbound"},
      {"jackson_square_mezzanine_southbound", "Jackson Square Mezzanine Southbound"},
      {"jackson_square_northbound", "Jackson Square Northbound"},
      {"jackson_square_southbound", "Jackson Square Southbound"},
      {"stony_brook_mezzanine_northbound", "Stony Brook Mezzanine Northbound"},
      {"stony_brook_mezzanine_southbound", "Stony Brook Mezzanine Southbound"},
      {"stony_brook_northbound", "Stony Brook Northbound"},
      {"stony_brook_southbound", "Stony Brook Southbound"},
      {"green_street_mezzanine_northbound", "Green Street Mezzanine Northbound"},
      {"green_street_mezzanine_southbound", "Green Street Mezzanine Southbound"},
      {"green_street_northbound", "Green Street Northbound"},
      {"green_street_southbound", "Green Street Southbound"},
      {"forest_hills_mezzanine_northbound", "Forest Hills Mezzanine Northbound"},
      {"forest_hills_mezzanine_southbound", "Forest Hills Mezzanine Southbound"},
      {"forest_hills_northbound", "Forest Hills Northbound"},
      {"forest_hills_southbound", "Forest Hills Southbound"},
      {"forest_hills_bus_mezzanine_northbound", "Forest Hills Bus Mezzanine Northbound"},
      {"forest_hills_bus_mezzanine_southbound", "Forest Hills Bus Mezzanine Southbound"},
      {"ruggles_bus_mezzanine_northbound", "Ruggles Bus Mezzanine Northbound"},
      {"ruggles_bus_mezzanine_southbound", "Ruggles Bus Mezzanine Southbound"}
    ]
  end
end
