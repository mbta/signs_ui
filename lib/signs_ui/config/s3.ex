defmodule SignsUi.Config.S3 do
  @moduledoc """
  Serializes and uploads the SignsUi.Config.State to the S3 bucket.
  """

  alias SignsUi.Config

  @spec update(SignsUi.Config.State.t()) :: {:ok, any()} | {:error, any()}
  def update(%{
        signs: signs,
        configured_headways: configured_headways,
        chelsea_bridge_announcements: chelsea_bridge_announcements,
        sign_groups: sign_groups
      }) do
    json =
      Jason.encode(
        %{
          "signs" => Config.Signs.format_signs_for_json(signs),
          "configured_headways" =>
            Config.ConfiguredHeadways.format_configured_headways_for_json(configured_headways),
          "chelsea_bridge_announcements" => chelsea_bridge_announcements,
          "sign_groups" => sign_groups
        },
        pretty: true
      )

    do_update(json)
  end

  @spec do_update({:ok, String.t()} | {:error, any()}) :: {:ok, any()} | {:error, any()}
  def do_update({:error, reason}) do
    {:error, reason}
  end

  def do_update({:ok, json}) do
    {aws_requestor, bucket_name, path_name} = get_aws_vars()
    bucket_name |> ExAws.S3.put_object(path_name, json) |> aws_requestor.request()
  end

  @spec get_object() :: {:ok, any()} | {:error, any()}
  def get_object do
    {aws_requestor, bucket_name, path_name} = get_aws_vars()
    bucket_name |> ExAws.S3.get_object(path_name) |> aws_requestor.request()
  end

  @spec get_aws_vars() :: {module(), String.t(), String.t()}
  defp get_aws_vars do
    bucket_name = Application.get_env(:signs_ui, :aws_signs_bucket)
    path_name = Application.get_env(:signs_ui, :aws_signs_path)
    aws_requestor = Application.get_env(:signs_ui, :aws_requestor)
    {aws_requestor, bucket_name, path_name}
  end
end
