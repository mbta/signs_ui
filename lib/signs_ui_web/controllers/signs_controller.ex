defmodule SignsUiWeb.SignsController do
  use SignsUiWeb, :controller

  def index(conn, _params) do
    signs = SignsUI.Signs.State.get_all()
    render conn, "index.html", signs: signs
  end

  def update(conn, params) do
    updated_signs = SignsUI.Signs.State.update(params["signs"])
    conn
    |> put_flash(:success, "Signs updated successfully")
    |> render("index.html", signs: updated_signs)
  end
end
