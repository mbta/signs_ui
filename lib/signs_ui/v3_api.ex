defmodule SignsUi.V3Api do
  @moduledoc """
  Provides a lightweight interface to the V3 API.
  """

  @spec fetch_alerts(String.t() | nil) ::
          {:ok, [map()], String.t()} | {:ok, :not_modified} | {:error, term()}
  def fetch_alerts(last_modified) do
    url = "#{Application.get_env(:signs_ui, :api_v3_url)}/alerts"

    headers =
      [{"x-api-key", Application.get_env(:signs_ui, :api_v3_key)}] ++
        if(last_modified, do: [{"if-modified-since", last_modified}], else: [])

    params = [params: %{"filter[datetime]" => "NOW"}]

    case HTTPoison.get(url, headers, params) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body, headers: headers}} ->
        {:ok, JSON.decode!(body) |> Map.get("data", []), Map.new(headers)["last-modified"]}

      {:ok, %HTTPoison.Response{status_code: 304}} ->
        {:ok, :not_modified}

      {_, result} ->
        {:error, result}
    end
  end
end
