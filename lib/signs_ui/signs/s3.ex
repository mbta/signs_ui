defmodule SignsUI.Signs.S3 do
  alias SignsUI.Signs

  def update(signs) do
    bucket_name = Application.get_env(:signs_ui, :aws_signs_bucket)
    path_name = Application.get_env(:signs_ui, :aws_signs_path)
    json = signs |> Signs.Signs.format_signs_for_json |> Poison.encode()
    do_update(bucket_name, path_name, json)
  end

  def do_update(_bucket_name, {:error, reason}) do
    {:error, reason}
  end
  def do_update(bucket_name, path_name, {:ok, json}) do
    aws_requestor = Application.get_env(:signs_ui, :aws_requestor)
    ExAws.S3.put_object(bucket_name, path_name, json) |> aws_requestor.request()
  end

  def handle_response({:error, _reason}, old_signs, _updated_signs) do
    {:error, old_signs}
  end
  def handle_response({:ok, _}, _old_signs, updated_signs) do
    {:ok, updated_signs}
  end
end
