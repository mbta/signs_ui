defmodule SignsUi.Config.ConfiguredHeadwaysTest do
  use ExUnit.Case, async: true
  alias SignsUi.Config.ConfiguredHeadway
  import SignsUi.Config.ConfiguredHeadways

  @configured_headways %{
    "red_trunk" => %{
      "peak" => %ConfiguredHeadway{
        range_low: 8,
        range_high: 10
      }
    }
  }

  describe "format_configured_headways_for_json/1" do
    test "returns expected format" do
      expected = %{
        "red_trunk" => %{
          "peak" => %{
            "range_low" => 8,
            "range_high" => 10
          }
        }
      }

      assert format_configured_headways_for_json(@configured_headways) == expected
    end
  end
end
