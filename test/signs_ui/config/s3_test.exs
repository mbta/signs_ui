defmodule SignsUi.Config.S3Test do
  use ExUnit.Case, async: true
  import SignsUi.Config.S3
  alias SignsUi.Config.Sign

  describe "update/1" do
    test "sends_update" do
      config = %{
        signs: %{
          "sign1" => %Sign{id: "sign1", config: %{mode: :auto}},
          "sign2" => %Sign{id: "sign2", config: %{mode: :auto}}
        },
        multi_sign_headways: %{}
      }

      {:ok, object} = update(config)
      assert object.body =~ "sign1"
      assert object.body =~ "sign2"
    end
  end
end
