defmodule SignsUiWeb.EnsureSignsUiGroup do
  import Plug.Conn

  def init(options), do: options

  def call(conn, _opts) do
    claims = Guardian.Plug.current_claims(conn)

    if not is_nil(claims["groups"]) and @signs_ui_group in claims["groups"] do
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
