defmodule SignsUI.Signs.SignsTest do
  use ExUnit.Case, async: true
  import SignsUI.Signs.Signs
  alias SignsUI.Signs.Sign

  describe "update_enabled_flags/2" do
    test "updates signs with map of ids to enabled_values" do
      signs = %{
        "sign1" => %Sign{id: "sign1", enabled?: true},
        "sign2" => %Sign{id: "sign2", enabled?: false},
        "sign3" => %Sign{id: "sign3", enabled?: true}
      }
      enabled_map = %{
        "sign1" => false,
        "sign2" => true,
        "sign3" => true
      }
      expected = %{
        "sign1" => %Sign{id: "sign1", enabled?: false},
        "sign2" => %Sign{id: "sign2", enabled?: true},
        "sign3" => %Sign{id: "sign3", enabled?: true}
      }
      assert update_enabled_flags(enabled_map, signs) == expected
    end
  end
end
