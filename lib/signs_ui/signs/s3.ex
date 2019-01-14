defmodule SignsUI.Signs.S3 do
  alias SignsUI.Signs

  def update(signs) do
    json = signs |> Signs.Signs.format_signs_for_json() |> Poison.encode(pretty: true)
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
