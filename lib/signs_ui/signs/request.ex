defmodule SignsUI.Signs.Request do
  require Logger
  alias SignsUI.Signs.Sign

  def get_signs(nil), do: %{}
  def get_signs(url) do
    http_client = Application.get_env(:signs_ui, :http_client)
    case http_client.get(url) do
      {:ok, %HTTPoison.Response{status_code: status, body: body}} when status >= 200 and status < 300 ->
        parse(body)
      {:ok, %HTTPoison.Response{status_code: status}} ->
        Logger.warn("Could not load signs. Response returned with status code #{inspect status}")
        %{}
      {:error, %HTTPoison.Error{reason: reason}} ->
        Logger.warn("Could not load signs: #{inspect reason}")
        %{}
    end
  end

  defp parse(json) do
    case Poison.decode(json) do
      {:ok, response} ->
        response
        |> Map.get("data")
        |> Map.new(fn {sign_id, values} -> {sign_id, Sign.from_json(sign_id, values)} end)
      {:error, reason} ->
        Logger.warn("Could not decode response: #{inspect reason}")
        %{}
    end
  end
end
