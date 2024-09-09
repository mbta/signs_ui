defmodule SignsUiWeb.EnsureSignsUiAdminGroup do
  @moduledoc """
  Ensure the Keycloak user is a SignsUI Admin.
  """

  import Plug.Conn

  def init(options), do: options

  def call(conn, _opts) do
    claims = Guardian.Plug.current_claims(conn)

    if SignsUiWeb.AuthManager.claims_access_level(claims) == :admin do
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
