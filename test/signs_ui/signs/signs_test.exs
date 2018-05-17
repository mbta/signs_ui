defmodule SignsUI.Signs.SignsTest do
  use ExUnit.Case, async: true
  import SignsUI.Signs.Signs
  alias SignsUI.Signs.Sign

  @signs %{
    "sign1" => %Sign{id: "sign1", enabled?: true},
    "sign2" => %Sign{id: "sign2", enabled?: false},
    "sign3" => %Sign{id: "sign3", enabled?: true}
  }

  describe "format_signs_for_json/1" do
    test "puts all signs in json format" do
      expected = %{
        "sign1" => %{"enabled" => true},
        "sign2" => %{"enabled" => false},
        "sign3" => %{"enabled" => true},
      }
      assert format_signs_for_json(@signs) == expected
    end
  end
end
