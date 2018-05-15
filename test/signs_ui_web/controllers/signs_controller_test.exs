defmodule SignsUiWeb.SignsControllerTest do
  use SignsUiWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get conn, "/"
    assert html_response(conn, 200) =~ "Countdown Signs"
  end

  test "POST /", %{conn: conn} do
    conn = post conn, "/"
    assert html_response(conn, 200) =~ "updated successfully"
  end
end
