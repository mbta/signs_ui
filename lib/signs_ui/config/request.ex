defmodule SignsUi.Config.Request do
  require Logger
  alias SignsUi.Config.S3
  alias SignsUi.Config.Sign

  @spec get_signs({module(), atom(), []}) :: {:ok, %{String.t() => Sign.t()}} | {:error, any()}
  def get_signs({mod, fun, args} \\ {S3, :get_object, []}) do
    case apply(mod, fun, args) do
      {:ok, %{body: json}} ->
        parse(json)

      {:error, reason} ->
        Logger.warn("Could not load Signs config from AWS: #{inspect(reason)}")
        {:error, :failed_to_load_config}
    end
  end

  @spec parse(String.t()) :: {:ok, %{String.t() => Sign.t()}} | {:error, any()}
  defp parse(json) do
    case Jason.decode(json) do
      {:ok, response} ->
        # To handle two formats of signs config:
        # old: { "sign_id": { ... }, "sign_id2": { ... }}
        # new: { "signs": { "sign_id" => { sign_config }, ...}}
        sign_configs = Map.get(response, "signs", response)

        {:ok,
         Map.new(sign_configs, fn {sign_id, config} ->
           {sign_id, Sign.from_json(sign_id, config)}
         end)}

      {:error, reason} ->
        Logger.warn("Could not decode response: #{inspect(reason)}")
        {:error, :failed_to_parse_response}
    end
  end
end
