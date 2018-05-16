defmodule SignsUiWeb.SignsController do
  use SignsUiWeb, :controller

  def index(conn, _params) do
    signs = SignsUI.Signs.State.get_all()
    render conn, "index.html", signs: signs
  end

  def update(conn, params) do
    conn = perform_update(conn, params)
    redirect(conn, to: "/")
  end

  defp perform_update(conn, params) do
    params
    |> get_enabled_map
    |> SignsUI.Signs.State.update()
    |> handle_update_response(conn)
  end

  defp handle_update_response(:ok, conn) do
    put_flash(conn, :success, "Signs updated successfully")
  end
  defp handle_update_response(:error, conn) do
    put_flash(conn, :error, "Signs could not be updated")
  end

  defp get_enabled_map(%{"signs" => signs}) do
    Map.new(signs, fn {sign_id, value} -> {sign_id, value == "true"} end)
  end
  defp get_enabled_map(_params) do
    %{}
  end
end
