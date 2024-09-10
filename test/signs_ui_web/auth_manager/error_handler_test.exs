defmodule SignsUiWeb.AuthManager.ErrorHandlerTest do
  use SignsUiWeb.ConnCase

  describe "auth_error/3" do
    test "redirects to keycloak login if there's no refresh key", %{conn: conn} do
      conn =
        conn
        |> init_test_session(%{signs_ui_username: "foo@mbta.com"})
        |> SignsUiWeb.AuthManager.ErrorHandler.auth_error({:some_type, :reason}, [])

      assert html_response(conn, 302) =~ "\"/auth/keycloak\""
    end
  end
end
