defmodule SignsUI.Mock.Write do

  def update(signs) do
    file_path = Application.get_env(:signs_ui, :local_write_path)
    json = signs
    |> SignsUI.Signs.Signs.format_signs_for_json
    |> Poison.encode!()

    File.write(file_path, json)
  end

  def handle_response(_, _old_signs, new_signs), do: {:ok, new_signs}
end
