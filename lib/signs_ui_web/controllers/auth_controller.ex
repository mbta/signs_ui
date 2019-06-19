defmodule SignsUiWeb.AuthController do
  use SignsUiWeb, :controller
  plug(Ueberauth)

  @spec callback(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    username = auth.uid
    expiration = auth.credentials.expires_at
    credentials = conn.assigns.ueberauth_auth.credentials

    current_time = System.system_time(:second)

    conn
    |> Guardian.Plug.sign_in(
      SignsUiWeb.AuthManager,
      username,
      %{groups: credentials.other[:groups]},
      ttl: {expiration - current_time, :seconds}
    )
    |> redirect(to: SignsUiWeb.Router.Helpers.messages_path(conn, :index))
  end

  def callback(%{assigns: %{ueberauth_failure: _failure}} = conn, _params) do
    send_resp(conn, 403, "unauthenticated")
  end
end
