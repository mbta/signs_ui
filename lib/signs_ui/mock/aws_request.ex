defmodule SignsUI.Mock.AwsRequest do
  def request(%{http_method: :put} = put_object) do
    {:ok, put_object}
  end
  def request(%{http_method: :get}) do
    signs = %{
      "test_sign_1" => %{"enabled" => true},
      "test_sign_2" => %{"enabled" => false},
      "test_sign_3" => %{"enabled" => true},
      "test_sign_4" => %{"enabled" => false},
      "test_sign_5" => %{"enabled" => true}
    }
    {:ok, %{body: Poison.encode!(signs)}}
  end
end
