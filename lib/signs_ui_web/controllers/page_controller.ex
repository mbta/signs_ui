defmodule SignsUiWeb.PageController do
  use SignsUiWeb, :controller
  alias SignsUI.Signs

  def index(conn, _params) do
    redirect(conn, to: "/viewer")
  end
end
