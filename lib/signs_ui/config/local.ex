defmodule SignsUi.Config.Local do
  @moduledoc "Stores signs configs in a local file"

  # sobelow_skip ["Traversal"]
  def write(content) do
    File.write!(path(), content)
  end

  # sobelow_skip ["Traversal"]
  def write_stops(content) do
    :code.priv_dir(:signs_ui) |> Path.join("stops-config.json") |> File.write!(content)
  end

  # sobelow_skip ["Traversal"]
  def read do
    case File.read(path()) do
      {:ok, content} -> content
      {:error, :enoent} -> "{}"
    end
  end

  defp path, do: :code.priv_dir(:signs_ui) |> Path.join("config.json")
end
