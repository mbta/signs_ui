defmodule SignsUiWeb.SingleSignControllerTest do
  use SignsUiWeb.ConnCase

  describe "index" do
    test "gets single sign data", %{conn: conn} do
      conn = get(conn, "/ABCD/m")

      assert html_response(conn, 200) =~ "Single Sign"
    end
  end
end
