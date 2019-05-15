defmodule SignsUiWeb.AuthController do
  use SignsUiWeb, :controller
  plug(Ueberauth)

  @spec callback(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    IO.inspect("======")
    IO.inspect(auth)

    user = %{
      username: auth.uid,
      expiration: auth.extra.raw_info["exp"]
    }

    conn
    |> Guardian.Plug.sign_in(SignsUiWeb.AuthManager, user)
    |> redirect(to: SignsUiWeb.Router.Helpers.messages_path(conn, :index))
  end

  def callback(%{assigns: %{ueberauth_failure: _failure}} = conn, _params) do
    send_resp(conn, 403, "unauthenticated")
  end
end
