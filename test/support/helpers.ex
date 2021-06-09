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

  @spec sign_in_with_groups(Phoenix.Socket.t(), String.t(), [String.t()]) :: Phoenix.Socket.t()
  def sign_in_with_groups(socket, username, groups) do
    current_time = System.system_time(:second)
    expiration_time = current_time + 500

    {:ok, token, claims} =
      SignsUiWeb.AuthManager.encode_and_sign(username, %{
        "exp" => expiration_time,
        "groups" => groups
      })

    Guardian.Phoenix.Socket.assign_rtc(socket, username, token, claims)
  end
end
