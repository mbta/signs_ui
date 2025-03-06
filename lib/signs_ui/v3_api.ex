defmodule SignsUi.V3Api do
  require Logger

  @spec fetch_alerts() :: {:ok, [map()]} | :error
  def fetch_alerts() do
    url = "#{Application.get_env(:signs_ui, :api_v3_url)}/alerts"
    headers = [{"x-api-key", Application.get_env(:signs_ui, :api_v3_key)}]
    params = [params: %{"filter[datetime]" => "NOW"}]

    case HTTPoison.get(url, headers, params) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        {:ok, Jason.decode!(body) |> Map.get("data", [])}

      {:ok, %HTTPoison.Response{status_code: status_code}} ->
        Logger.error("HTTP error, status=#{status_code}")
        :error

      {:error, reason} ->
        Logger.error([
          "alerts_fetch_failed, reason=",
          inspect(reason)
        ])

        :error
    end
  end
end
