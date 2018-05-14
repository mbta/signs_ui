defmodule SignsUiWeb.PageController do
  use SignsUiWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
