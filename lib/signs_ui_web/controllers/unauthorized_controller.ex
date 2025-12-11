defmodule SignsUiWeb.UnauthorizedController do
  use SignsUiWeb, :controller

  @spec index(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def index(conn, _params) do
    sign_out_path = SignsUiWeb.Router.Helpers.auth_path(conn, :logout, "keycloak")

    conn
    |> put_status(403)
    |> render(sign_out_path: sign_out_path)
  end
end
