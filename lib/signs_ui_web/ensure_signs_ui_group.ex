defmodule SignsUiWeb.EnsureSignsUiGroup do
  import Plug.Conn

  def init(options), do: options

  def call(conn, _opts) do
    claims = Guardian.Plug.current_claims(conn)

    if SignsUiWeb.AuthManager.claims_grant_signs_access?(claims) do
      conn
    else
      conn
      |> Phoenix.Controller.redirect(
        to: SignsUiWeb.Router.Helpers.unauthorized_path(conn, :index)
      )
      |> halt()
    end
  end
end
