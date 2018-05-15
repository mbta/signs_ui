defmodule SignsUiWeb.SignsControllerTest do
  use SignsUiWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get conn, "/"
    assert html_response(conn, 200) =~ "Countdown Signs"
  end
end
