defmodule Test.Support.Helpers do
  @moduledoc "Helpers! For Tests!"

  defmacro reassign_env(var) do
    quote do
      old_value = Application.get_env(:signs_ui, unquote(var))

      on_exit(fn ->
        Application.put_env(:signs_ui, unquote(var), old_value)
      end)
    end
  end

  defmacro reassign_env(var, value) do
    quote do
      old_value = Application.get_env(:signs_ui, unquote(var))
      Application.put_env(:signs_ui, unquote(var), unquote(value))

      on_exit(fn ->
        Application.put_env(:signs_ui, unquote(var), old_value)
      end)
    end
  end
end
