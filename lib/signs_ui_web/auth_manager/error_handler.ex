defmodule SignsUiWeb.AuthManager.ErrorHandler do
  @behaviour Guardian.Plug.ErrorHandler

  @impl Guardian.Plug.ErrorHandler
  def auth_error(conn, {_type, _reason}, _opts) do
    refresh_token_store = Application.get_env(:signs_ui, :refresh_token_store)

    username =
      conn
      |> Plug.Conn.fetch_session()
      |> Plug.Conn.get_session(:signs_ui_username)

    refresh_token = refresh_token_store.get_refresh_token(username)

    if refresh_token do
      refresh_token_store.clear_refresh_token(username)

      Phoenix.Controller.redirect(
        conn,
        to:
          SignsUiWeb.Router.Helpers.auth_path(conn, :callback, "cognito", %{
            "refresh_token" => refresh_token
          })
      )
    else
      Phoenix.Controller.redirect(
        conn,
        to: SignsUiWeb.Router.Helpers.auth_path(conn, :request, "cognito")
      )
    end
  end
end
