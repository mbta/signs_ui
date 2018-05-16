defmodule SignsUI.Signs.S3 do
  alias SignsUI.Signs

  @bucket_name Application.get_env(:signs_ui, :aws_signs_bucket)
  @path_name Application.get_env(:signs_ui, :aws_signs_path)

  def update(signs) do
    json = signs |> Signs.Signs.format_signs_for_json |> Poison.encode()
    do_update(json)
  end

  def do_update({:error, reason, _}) do
    {:error, reason}
  end
  def do_update({:ok, json}) do
    aws_requestor = Application.get_env(:signs_ui, :aws_requestor)
    ExAws.S3.put_object(@bucket_name, @path_name, json) |> aws_requestor.request()
  end

  def get_object() do
    aws_requestor = Application.get_env(:signs_ui, :aws_requestor)
    ExAws.S3.get_object(@bucket_name, @path_name) |> aws_requestor.request()
  end

  def handle_response({:error, _reason}, old_signs, _updated_signs) do
    {:error, old_signs}
  end
  def handle_response({:ok, _}, _old_signs, updated_signs) do
    {:ok, updated_signs}
  end
end
