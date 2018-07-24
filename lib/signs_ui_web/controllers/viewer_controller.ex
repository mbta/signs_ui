defmodule SignsUiWeb.ViewerController do
  use SignsUiWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
