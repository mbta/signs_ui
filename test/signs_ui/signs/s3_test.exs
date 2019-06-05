defmodule SignsUi.Signs.S3Test do
  use ExUnit.Case, async: true
  import SignsUi.Signs.S3
  alias SignsUi.Signs.Sign

  describe "update/1" do
    test "sends_update" do
      signs = %{
        "sign1" => %Sign{id: "sign1", config: %{mode: :auto}},
        "sign2" => %Sign{id: "sign2", config: %{mode: :auto}}
      }

      {:ok, object} = update(signs)
      assert object.body =~ "sign1"
      assert object.body =~ "sign2"
    end
  end
end
