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

  describe "handle_response/3" do
    test "returns error and old signs when it receives an error code" do
      old_signs = %{"old" => %Sign{id: "old"}}
      new_signs = %{"new" => %Sign{id: "new"}}
      assert handle_response({:error, :timeout}, old_signs, new_signs) == {:error, old_signs}
    end

    test "returns ok and new signs when it receives an error code" do
      old_signs = %{"old" => %Sign{id: "old"}}
      new_signs = %{"new" => %Sign{id: "new"}}
      assert handle_response({:ok, :term}, old_signs, new_signs) == {:ok, new_signs}
    end
  end
end
