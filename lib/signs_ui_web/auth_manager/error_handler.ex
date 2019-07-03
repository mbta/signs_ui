defmodule SignsUiWeb.AuthManager.ErrorHandler do
  @behaviour Guardian.Plug.ErrorHandler

  @impl Guardian.Plug.ErrorHandler

  def auth_error(conn, {:invalid_token, :token_expired}, _opts) do
    username = Plug.Conn.get_session(conn, :username)

    if username do
      attempt_refresh(conn, username)
    else
      default_redirect(conn)
    end
  end

  def auth_error(conn, {_type, _reason}, _opts) do
    default_redirect(conn)
  end

  defp attempt_refresh(conn, username) do
    refresh_token = SignsUiWeb.AuthManager.RefreshTokenState.query(username)

    if refresh_token do
      conn
      |> Phoenix.Controller.redirect(
        to:
          SignsUiWeb.Router.Helpers.auth_path(
            conn,
            :callback,
            "cognito",
            refresh_token: refresh_token
          )
      )
    else
      default_redirect(conn)
    end
  end

  defp default_redirect(conn) do
    conn
    |> Phoenix.Controller.redirect(
      to: SignsUiWeb.Router.Helpers.auth_path(conn, :request, "cognito")
    )
  end
end
