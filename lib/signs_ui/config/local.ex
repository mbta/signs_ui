defmodule SignsUi.Config.Local do
  def write(content) do
    File.write!(path(), content)
  end

  def read() do
    case File.read(path()) do
      {:ok, content} -> content
      {:error, :enoent} -> "{}"
    end
  end

  defp path, do: :code.priv_dir(:signs_ui) |> Path.join("config.json")
end
