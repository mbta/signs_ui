defmodule SignsUiWeb.AuthManager.ErrorHandlerTest do
  use SignsUiWeb.ConnCase
  use Plug.Test
  import Test.Support.Helpers

  setup do
    reassign_env(
      :refresh_token_store,
      SignsUiWeb.AuthManager.ErrorHandlerTest.FakeRefreshTokenStore
    )
  end

  describe "auth_error/3" do
    test "redirects to Cognito login if there's no refresh key", %{conn: conn} do
      conn =
        conn
        |> init_test_session(%{signs_ui_username: "foo@mbta.com"})
        |> SignsUiWeb.AuthManager.ErrorHandler.auth_error({:some_type, :reason}, [])

      assert html_response(conn, 302) =~ "\"/auth/cognito\""
    end

    test "redirects to Cognito callback if there is a refresh key", %{conn: conn} do
      conn =
        conn
        |> init_test_session(%{signs_ui_username: "bar@mbta.com"})
        |> SignsUiWeb.AuthManager.ErrorHandler.auth_error({:some_type, :reason}, [])

      assert html_response(conn, 302) =~ "\"/auth/cognito/callback\?"
    end
  end

  defmodule FakeRefreshTokenStore do
    def get_refresh_token("foo@mbta.com"), do: nil
    def get_refresh_token("bar@mbta.com"), do: "abcde"
  end
end
