defmodule SignsUiWeb.PageController do
  use SignsUiWeb, :controller
  alias SignsUI.Signs

  def index(conn, _params) do
    render conn, "index.html", sign_routes: Signs.Names.sign_routes()
  end
end
