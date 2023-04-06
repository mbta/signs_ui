defmodule SignsUi.Config.Local do
  @moduledoc "Stores signs configs in a local file"

  def write(content) do
    File.write!(path(), content)
  end

  def read do
    case File.read(path()) do
      {:ok, content} -> content
      {:error, :enoent} -> "{}"
    end
  end

  defp path, do: :code.priv_dir(:signs_ui) |> Path.join("config.json")
end
