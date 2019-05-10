defmodule SignsUiWeb.AuthManager.ErrorHandlerTest do
  use SignsUiWeb.ConnCase

  describe "auth_error/3" do
    test "sends 401 response", %{conn: conn} do
      conn = SignsUiWeb.AuthManager.ErrorHandler.auth_error(conn, {:some_type, :reason}, [])

      assert text_response(conn, 401) =~ "some_type"
    end
  end
end
