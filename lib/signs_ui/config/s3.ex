defmodule SignsUi.Config.S3 do
  @moduledoc """
  Serializes and uploads the SignsUi.Config.State to the S3 bucket.
  """

  def write(content) do
    {:ok, _} = ExAws.S3.put_object(bucket_name(), path_name(), content) |> ExAws.request()
  end

  def read do
    {:ok, %{body: content}} = ExAws.S3.get_object(bucket_name(), path_name()) |> ExAws.request()
    content
  end

  defp bucket_name, do: Application.get_env(:signs_ui, :aws_signs_bucket)
  defp path_name, do: Application.get_env(:signs_ui, :aws_signs_path)
end
