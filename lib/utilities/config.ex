defmodule SignsUi.Utilities.Config do
  @moduledoc false

  @spec update_env(atom, atom, String.t() | nil) :: nil | :ok
  def update_env(app \\ :signs_ui, key, val) do
    if is_nil(Application.get_env(app, key)) do
      Application.put_env(app, key, val)
    end
  end
end
