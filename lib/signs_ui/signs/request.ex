defmodule SignsUI.Signs.Request do
  require Logger
  alias SignsUI.Signs.{Sign, S3}

  def get_signs() do
    case S3.get_object() do
      {:ok, %{body: json}} ->
        parse(json)
      {:error, reason} ->
        Logger.warn("Could not load Signs config from AWS: #{inspect reason}")
        %{}
    end
  end

  defp parse(json) do
    case Poison.decode(json) do
      {:ok, response} ->
        Map.new(response, fn {sign_id, values} -> {sign_id, Sign.from_json(sign_id, values)} end)
      {:error, reason} ->
        Logger.warn("Could not decode response: #{inspect reason}")
        %{}
    end
  end
end
