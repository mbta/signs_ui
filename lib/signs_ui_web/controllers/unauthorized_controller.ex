defmodule SignsUiWeb.UnauthorizedController do
  use SignsUiWeb, :controller

  @spec index(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def index(conn, _params) do
    conn
    |> put_status(403)
    |> render("index.html")
  end
end
