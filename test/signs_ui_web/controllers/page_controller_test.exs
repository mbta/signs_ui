defmodule SignsUiWeb.PageControllerTest do
  use SignsUiWeb.ConnCase

  describe "GET /" do
    test "Redirects to viewer", %{conn: conn} do
      conn = get(conn, "/")
      assert html_response(conn, 302) =~ "/viewer"
    end
  end
end
