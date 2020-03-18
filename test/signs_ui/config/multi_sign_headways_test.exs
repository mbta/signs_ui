defmodule SignsUi.Config.MultiSignHeadwaysTest do
  use ExUnit.Case, async: true
  alias SignsUi.Config.MultiSignHeadway
  import SignsUi.Config.MultiSignHeadways

  @multi_sign_headways %{
    "red_trunk" => %MultiSignHeadway{
      range_low: 8,
      range_high: 10
    }
  }

  describe "format_multi_sign_headways_for_json/1" do
    test "returns expected format" do
      expected = %{
        "red_trunk" => %{
          "range_low" => 8,
          "range_high" => 10
        }
      }

      assert format_multi_sign_headways_for_json(@multi_sign_headways) == expected
    end
  end
end
