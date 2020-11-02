defmodule SignsUi.Config.Request do
  require Logger
  alias SignsUi.Config.S3
  alias SignsUi.Config.Sign
  alias SignsUi.Config.ConfiguredHeadways

  @spec get_signs({module(), atom(), []}) ::
          {:ok,
           %{
             signs: %{String.t() => Sign.t()},
             configured_headways: ConfiguredHeadways.t(),
             chelsea_bridge_announcements: String.t()
           }}
          | {:error, any()}
  def get_signs({mod, fun, args} \\ {S3, :get_object, []}) do
    case apply(mod, fun, args) do
      {:ok, %{body: json}} ->
        parse(json)

      {:error, reason} ->
        Logger.warn("Could not load Signs config from AWS: #{inspect(reason)}")
        {:error, :failed_to_load_config}
    end
  end

  @spec parse(String.t()) ::
          {:ok,
           %{
             signs: %{String.t() => Sign.t()},
             configured_headways: ConfiguredHeadways.t(),
             chelsea_bridge_announcements: String.t()
           }}
          | {:error, any()}
  defp parse(json) do
    case Jason.decode(json) do
      {:ok, response} ->
        # To handle two formats of signs config:
        # old: { "sign_id": { ... }, "sign_id2": { ... }}
        # new: { "signs": { "sign_id" => { sign_config }, ...}}
        sign_configs = Map.get(response, "signs", response)
        configured_headways = Map.get(response, "configured_headways", %{})
        chelsea_bridge_announcements = Map.get(response, "chelsea_bridge_announcements", "off")

        {:ok,
         %{
           signs:
             Map.new(sign_configs, fn {sign_id, config} ->
               {sign_id, Sign.from_json(sign_id, config)}
             end),
           configured_headways:
             ConfiguredHeadways.parse_configured_headways_json(configured_headways),
           chelsea_bridge_announcements: chelsea_bridge_announcements
         }}

      {:error, reason} ->
        Logger.warn("Could not decode response: #{inspect(reason)}")
        {:error, :failed_to_parse_response}
    end
  end
end
