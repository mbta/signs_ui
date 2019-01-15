defmodule SignsUI.Signs.SignsTest do
  use ExUnit.Case, async: true
  import SignsUI.Signs.Signs
  alias SignsUI.Signs.Sign

  @signs %{
    "sign1" => Sign.new("sign1", true),
    "sign2" => Sign.new("sign2", false),
    "sign3" => Sign.new("sign3", true)
  }

  describe "format_signs_for_json/1" do
    test "puts all signs in json format" do
      expected = %{
        "sign1" => %{"id" => "sign1", "enabled" => true, "mode" => "auto"},
        "sign2" => %{"id" => "sign2", "enabled" => false, "mode" => "off", "expires" => nil},
        "sign3" => %{"id" => "sign3", "enabled" => true, "mode" => "auto"}
      }

      assert format_signs_for_json(@signs) == expected
    end
  end
end
