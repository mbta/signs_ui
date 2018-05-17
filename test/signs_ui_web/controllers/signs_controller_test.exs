defmodule SignsUiWeb.SignsControllerTest do
  use SignsUiWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get conn, "/"
    assert html_response(conn, 200) =~ "Countdown Signs"
  end

  test "POST /", %{conn: conn} do
    conn = post conn, "/", %{"signs" => %{"sign1" => "true"}}
    assert redirected_to(conn, 302) =~ "/"
    assert conn.private.phoenix_flash == %{"success" => "Signs updated successfully"}
  end
end
