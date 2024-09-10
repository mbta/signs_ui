defmodule SignsUiWeb.AuthManager.ErrorHandler do
  @moduledoc false

  @behaviour Guardian.Plug.ErrorHandler

  @impl Guardian.Plug.ErrorHandler
  def auth_error(conn, {_type, _reason}, _opts) do
    Phoenix.Controller.redirect(
      conn,
      to: SignsUiWeb.Router.Helpers.auth_path(conn, :request, "keycloak")
    )
  end
end
