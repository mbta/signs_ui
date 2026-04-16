defmodule SignsUi.V3Api do
  @moduledoc """
  Provides a lightweight interface to the V3 API.
  """

  require Logger

  @spec fetch_alerts(String.t() | nil) :: {:ok, [map()]} | :error
  def fetch_alerts(last_modified) do
    url = "#{Application.get_env(:signs_ui, :api_v3_url)}/alerts"

    headers =
      [{"x-api-key", Application.get_env(:signs_ui, :api_v3_key)}] ++
        if(last_modified, do: [{"if-modified-since", last_modified}], else: [])

    params = [params: %{"filter[datetime]" => "NOW"}]

    case HTTPoison.get(url, headers, params) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body, headers: headers}} ->
        {:ok, Jason.decode!(body) |> Map.get("data", []), Map.new(headers)["last-modified"]}

      {:ok, %HTTPoison.Response{status_code: 304}} ->
        {:ok, :not_modified}

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
