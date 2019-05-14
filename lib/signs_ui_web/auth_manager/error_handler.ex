defmodule SignsUiWeb.AuthManager.ErrorHandler do
  @behaviour Guardian.Plug.ErrorHandler

  @impl Guardian.Plug.ErrorHandler
  def auth_error(conn, {_type, _reason}, _opts) do
    conn
    |> Phoenix.Controller.redirect(
      to: SignsUiWeb.Router.Helpers.auth_path(conn, :request, "cognito")
    )
  end
end
