defmodule SignsUi.Config.Request do
  @moduledoc """
  Loads, decodes, and parses the SignsUi.Config.State from the S3 bucket on
  app start-up.
  """

  require Logger
  alias SignsUi.Config.ConfiguredHeadways
  alias SignsUi.Config.S3
  alias SignsUi.Config.Sign
  alias SignsUi.Config.SignGroup
  alias SignsUi.Config.State

  @spec get_state({module(), atom(), []}) :: {:ok, State.t()} | {:error, any()}
  def get_state({mod, fun, args} \\ {S3, :get_object, []}) do
    case apply(mod, fun, args) do
      {:ok, %{body: json}} ->
        parse(json)

      {:error, reason} ->
        Logger.warn("Could not load Signs config from AWS: #{inspect(reason)}")
        {:error, :failed_to_load_config}
    end
  end

  @spec parse(String.t()) :: {:ok, State.t()} | {:error, any()}
  defp parse(json) do
    case Jason.decode(json) do
      {:ok, response} ->
        # To handle two formats of signs config:
        # old: { "sign_id": { ... }, "sign_id2": { ... }}
        # new: { "signs": { "sign_id" => { sign_config }, ...}}
        sign_configs = Map.get(response, "signs", response)
        configured_headways = Map.get(response, "configured_headways", %{})
        chelsea_bridge_announcements = Map.get(response, "chelsea_bridge_announcements", "off")

        sign_groups =
          Map.get(response, "sign_groups", %{
            "Red" => %{},
            "Blue" => %{},
            "Orange" => %{},
            "Green" => %{},
            "Mattapan" => %{}
          })

        {:ok,
         %{
           signs:
             Map.new(sign_configs, fn {sign_id, config} ->
               {sign_id, Sign.from_json(sign_id, config)}
             end),
           configured_headways:
             ConfiguredHeadways.parse_configured_headways_json(configured_headways),
           chelsea_bridge_announcements: chelsea_bridge_announcements,
           sign_groups: sign_groups
         }}

      {:error, reason} ->
        Logger.warn("Could not decode response: #{inspect(reason)}")
        {:error, :failed_to_parse_response}
    end
  end
end
