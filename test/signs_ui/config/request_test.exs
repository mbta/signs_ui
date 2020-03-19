defmodule SignsUi.Config.RequestTest do
  use ExUnit.Case, async: true

  alias SignsUi.Config.Request
  alias SignsUi.Config.Sign

  defmodule OldFormat do
    def get_object() do
      data = %{
        "sign_id" => %{"id" => "sign_id", "mode" => "auto"}
      }

      {:ok, %{body: Jason.encode!(data)}}
    end
  end

  defmodule NewFormat do
    def get_object() do
      data = %{
        "signs" => %{
          "sign_id" => %{"id" => "sign_id", "mode" => "auto"}
        }
      }

      {:ok, %{body: Jason.encode!(data)}}
    end
  end

  describe "get_signs/1" do
    test "works with old format" do
      assert {:ok,
              %{
                signs: %{
                  "sign_id" => %Sign{
                    id: "sign_id",
                    config: %{mode: :auto}
                  }
                },
                configured_headways: %{}
              }} = Request.get_signs({OldFormat, :get_object, []})
    end

    test "works with new format" do
      assert {:ok,
              %{
                signs: %{
                  "sign_id" => %Sign{
                    id: "sign_id",
                    config: %{mode: :auto}
                  }
                },
                configured_headways: %{}
              }} = Request.get_signs({NewFormat, :get_object, []})
    end
  end
end
