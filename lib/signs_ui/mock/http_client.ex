defmodule SignsUI.Mock.HttpClient do

  def get("valid_json_response") do
    {:ok, %HTTPoison.Response{status_code: 200, body: valid_json()}}
  end
  def get("500_code") do
    {:ok, %HTTPoison.Response{status_code: 500}}
  end
  def get("http_error") do
    {:error, %HTTPoison.Error{reason: :timeout}}
  end
  def get("invalid_json") do
    {:ok, %HTTPoison.Response{status_code: 200, body: "string"}}
  end
  def get(_) do
    {:ok, %HTTPoison.Response{status_code: 200, body: valid_json()}}
  end

  defp valid_json() do
    json = %{
      "data"=> %{
        "sign1" => %{"disabled" => true},
        "sign2" => %{"disabled" => false}
      }
    }
    Poison.encode!(json)
  end
end
