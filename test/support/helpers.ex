defmodule Test.Support.Helpers do
  @moduledoc "Helpers! For Tests!"

  @spec sign_in_with_roles(Phoenix.Socket.t(), String.t(), [String.t()]) :: Phoenix.Socket.t()
  def sign_in_with_roles(socket, username, roles) do
    current_time = System.system_time(:second)
    expiration_time = current_time + 500

    {:ok, token, claims} =
      SignsUiWeb.AuthManager.encode_and_sign(username, %{
        "exp" => expiration_time,
        "roles" => roles
      })

    Guardian.Phoenix.Socket.assign_rtc(socket, username, token, claims)
  end
end
