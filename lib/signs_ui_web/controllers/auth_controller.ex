defmodule SignsUiWeb.AuthController do
  use SignsUiWeb, :controller
  plug(Ueberauth)

  @spec callback(Plug.Conn.t(), map()) :: Plug.Conn.t()

  def callback(conn, %{"refresh_token" => refresh_token}) do
    send_resp(conn, 404, "not yet implemented")
  end

  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    username = auth.uid
    expiration = auth.credentials.expires_at
    refresh_token = auth.credentials.refresh_token

    SignsUiWeb.AuthManager.RefreshTokenState.store(username, refresh_token)
    current_time = System.system_time(:second)

    conn
    |> Guardian.Plug.sign_in(
      SignsUiWeb.AuthManager,
      username,
      %{},
      ttl: {expiration - current_time, :seconds}
    )
    |> put_session(:username, username)
    |> redirect(to: SignsUiWeb.Router.Helpers.messages_path(conn, :index))
  end

  def callback(%{assigns: %{ueberauth_failure: _failure}} = conn, _params) do
    send_resp(conn, 403, "unauthenticated")
  end
end
