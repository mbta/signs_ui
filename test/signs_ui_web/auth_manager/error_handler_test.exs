defmodule SignsUiWeb.AuthManager.ErrorHandlerTest do
  use SignsUiWeb.ConnCase

  describe "auth_error/3" do
    test "redirects to Cognito login", %{conn: conn} do
      conn = SignsUiWeb.AuthManager.ErrorHandler.auth_error(conn, {:some_type, :reason}, [])

      assert html_response(conn, 302) =~ "/auth/cognito"
    end
  end
end
