defmodule SignsUiWeb.PageControllerTest do
  use SignsUiWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = %{conn | req_headers: [{"authorization", "Basic dXNlcm5hbWU6cGFzc3dvcmQ="}]}
    conn = get(conn, "/")
    assert html_response(conn, 200) =~ "All signs"
  end
end
