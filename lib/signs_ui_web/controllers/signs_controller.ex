defmodule SignsUiWeb.SignsController do
  use SignsUiWeb, :controller

  def index(conn, _params) do
    signs = SignsUI.Signs.State.get_all()
    render conn, "index.html", signs: signs
  end

  def update(conn, params) do
    updated_signs = params
                    |> get_enabled_map()
                    |> SignsUI.Signs.State.update()
    conn
    |> put_flash(:success, "Signs updated successfully")
    |> render("index.html", signs: updated_signs)
  end

  defp get_enabled_map(params) do
    params
    |> Map.get("signs")
    |> Map.new(fn {sign_id, value} -> {sign_id, value == "true"} end)
  end
end
