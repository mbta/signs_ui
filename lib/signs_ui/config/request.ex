defmodule SignsUi.Config.Request do
  require Logger
  alias SignsUi.Config.S3
  alias SignsUi.Config.Sign

  def get_signs() do
    case S3.get_object() do
      {:ok, %{body: json}} ->
        parse(json)

      {:error, reason} ->
        Logger.warn("Could not load Signs config from AWS: #{inspect(reason)}")
        {:error, :failed_to_load_config}
    end
  end

  defp parse(json) do
    case Jason.decode(json) do
      {:ok, response} ->
        {:ok,
         Map.new(response, fn {sign_id, config} -> {sign_id, Sign.from_json(sign_id, config)} end)}

      {:error, reason} ->
        Logger.warn("Could not decode response: #{inspect(reason)}")
        {:error, :failed_to_parse_response}
    end
  end
end
