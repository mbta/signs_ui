defmodule SignsUi.Mock.Write do
  @moduledoc false

  require Logger

  def update(%{signs: signs}) do
    file_path = Application.get_env(:signs_ui, :local_write_path)

    json =
      signs
      |> SignsUi.Config.Signs.format_signs_for_json()
      |> Jason.encode!()

    case File.write(file_path, json) do
      :ok -> {:ok, :success}
      error -> error
    end
  end

  def update(foo), do: Logger.error("unknown update: #{inspect(foo)}")
end
