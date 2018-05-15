defmodule SignsUi.Utilities.Config do
  def update_env(key, val) do
    if is_nil(Application.get_env(:signs_ui, key)) do
      Application.put_env(:signs_ui, key, val)
    end
  end
end
