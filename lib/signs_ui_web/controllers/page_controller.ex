defmodule SignsUiWeb.PageController do
  use SignsUiWeb, :controller

  def index(conn, _params) do
    redirect(conn, to: "/viewer")
  end
end
