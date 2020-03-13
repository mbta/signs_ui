defmodule SignsUi.Config.S3 do
  alias SignsUi.Config

  @spec update(SignsUi.Config.State.t()) :: ExAws.Operation.S3.t() | {:error, any}
  def update(%{signs: signs, multi_sign_headways: multi_sign_headways}) do
    json =
      Jason.encode(
        %{
          "signs" => Config.Signs.format_signs_for_json(signs),
          "multi_sign_headways" =>
            Config.MultiSignHeadways.format_multi_sign_headways_for_json(multi_sign_headways)
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
