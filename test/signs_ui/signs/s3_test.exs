defmodule SignsUI.Signs.S3Test do
  use ExUnit.Case, async: true
  import SignsUI.Signs.S3
  alias SignsUI.Signs.Sign

  describe "update/1" do
    test "sends_update" do
      signs = %{"sign1" => %Sign{id: "sign1"}, "sign2" => %Sign{id: "sign2"}}
      {:ok, object} = update(signs)
      assert object.body =~ "sign1"
      assert object.body =~ "sign2"
    end
  end
end
