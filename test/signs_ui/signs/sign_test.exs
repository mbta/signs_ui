defmodule SignsUI.Signs.SignTest do
  use ExUnit.Case, async: true
  import SignsUI.Signs.Sign
  alias SignsUI.Signs.Sign

  describe "from_json" do
    test "builds a Sign struct from json" do
      values = %{"enabled" => true}
      expected = %Sign{id: "Sign", enabled?: true}
      assert from_json("Sign", values) == expected
    end
  end

  describe "update_enabled/2" do
    test "updates with boolean of enabled_string" do
      sign = %Sign{id: "sign", enabled?: false}
      updated = update_enabled(sign, "true")
      assert updated.enabled?
    end
  end
end
