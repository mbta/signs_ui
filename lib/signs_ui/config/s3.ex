defmodule SignsUi.Config.S3 do
  alias SignsUi.Config

  @spec update(SignsUi.Config.State.t()) :: ExAws.Operation.S3.t() | {:error, any}
  def update(%{
        signs: signs,
        configured_headways: configured_headways,
        chelsea_bridge_announcements: chelsea_bridge_announcements
      }) do
    json =
      Jason.encode(
        %{
          "signs" => Config.Signs.format_signs_for_json(signs),
          "configured_headways" =>
            Config.ConfiguredHeadways.format_configured_headways_for_json(configured_headways),
          "chelsea_bridge_announcements" => chelsea_bridge_announcements
        },
        pretty: true
      )

    do_update(json)
  end

  def do_update({:error, reason, _}) do
    {:error, reason}
  end

  def do_update({:ok, json}) do
    {aws_requestor, bucket_name, path_name} = get_aws_vars()
    ExAws.S3.put_object(bucket_name, path_name, json) |> aws_requestor.request()
  end

  def get_object() do
    {aws_requestor, bucket_name, path_name} = get_aws_vars()
    ExAws.S3.get_object(bucket_name, path_name) |> aws_requestor.request()
  end

  defp get_aws_vars() do
    bucket_name = Application.get_env(:signs_ui, :aws_signs_bucket)
    path_name = Application.get_env(:signs_ui, :aws_signs_path)
    aws_requestor = Application.get_env(:signs_ui, :aws_requestor)
    {aws_requestor, bucket_name, path_name}
  end
end
