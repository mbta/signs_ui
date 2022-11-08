defmodule SignsUiWeb.UnauthorizedControllerTest do
  use SignsUiWeb.ConnCase

  describe "index/2" do
    test "renders response", %{conn: conn} do
      conn = get(conn, unauthorized_path(conn, :index))

      html = html_response(conn, 403)

      assert html =~ "not authorized"
      assert html =~ SignsUiWeb.Router.Helpers.auth_path(conn, :initiate_logout, "cognito")
    end
  end
end
