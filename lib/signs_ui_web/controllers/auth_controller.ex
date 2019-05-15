defmodule SignsUiWeb.AuthController do
  use SignsUiWeb, :controller
  plug(Ueberauth)

  @spec callback(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    username = auth.uid
    expiration = auth.credentials.expires_at

    current_time = DateTime.utc_now() |> DateTime.to_unix()

    conn
    |> Guardian.Plug.sign_in(
      SignsUiWeb.AuthManager,
      username,
      %{},
      ttl: {expiration - current_time, :seconds}
    )
    |> redirect(to: SignsUiWeb.Router.Helpers.messages_path(conn, :index))
  end

  def callback(%{assigns: %{ueberauth_failure: _failure}} = conn, _params) do
    send_resp(conn, 403, "unauthenticated")
  end
end
