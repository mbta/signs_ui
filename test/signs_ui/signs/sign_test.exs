defmodule SignsUI.Signs.SignTest do
  use ExUnit.Case, async: true
  import SignsUI.Signs.Sign
  alias SignsUI.Signs.Sign

  describe "from_json" do
    test "builds a Sign struct from json" do
      values = %{"disabled" => false}
      expected = %Sign{id: "Sign", disabled?: false}
      assert from_json("Sign", values) == expected
    end
  end
end
