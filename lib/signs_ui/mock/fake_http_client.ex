defmodule SignsUi.Mock.FakeHttpClient do
  def get(_, _, _) do
    {:ok, %HTTPoison.Response{status_code: 200, body: "{}"}}
  end
end
