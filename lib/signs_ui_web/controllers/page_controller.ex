defmodule SignsUiWeb.PageController do
  use SignsUiWeb, :controller
  alias SignsUI.Signs

  def index(conn, params) do
    render conn, "index.html", sign_routes: Signs.Names.sign_routes(), route_name: Signs.Names.route_name(params)
  end
end
