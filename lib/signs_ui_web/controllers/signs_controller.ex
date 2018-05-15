defmodule SignsUiWeb.SignsController do
  use SignsUiWeb, :controller

  def index(conn, _params) do
    signs = SignsUI.Signs.State.get_all()
    render conn, "index.html", signs: signs
  end
end
