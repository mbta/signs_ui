defmodule SignsUiWeb.AuthControllerTest do
  use SignsUiWeb.ConnCase
  import Test.Support.Helpers
  require Logger
  import ExUnit.CaptureLog

  describe "callback" do
    test "redirects on success and saves refresh token", %{conn: conn} do
      reassign_env(:refresh_token_store, SignsUiWeb.AuthControllerTest.FakeRefreshTokenStore)
      current_time = System.system_time(:second)

      auth = %Ueberauth.Auth{
        uid: "foo@mbta.com",
        credentials: %Ueberauth.Auth.Credentials{
          expires_at: current_time + 1_000,
          refresh_token: "bar",
          other: %{groups: ["test1"]}
        }
      }

      log =
        capture_log([level: :info], fn ->
          conn =
            conn
            |> assign(:ueberauth_auth, auth)
            |> get(SignsUiWeb.Router.Helpers.auth_path(conn, :callback, "cognito"))

          response = html_response(conn, 302)

          assert response =~ SignsUiWeb.Router.Helpers.messages_path(conn, :index)
          assert Guardian.Plug.current_claims(conn)["groups"] == ["test1"]
        end)

      assert log =~ "stored_refresh_token username=foo@mbta.com refresh_token=bar"
    end

    test "handles failure", %{conn: conn} do
      conn =
        conn
        |> assign(:ueberauth_failure, %Ueberauth.Failure{})
        |> get(SignsUiWeb.Router.Helpers.auth_path(conn, :callback, "cognito"))

      response = response(conn, 403)

      assert response =~ "unauthenticated"
    end
  end

  describe "request" do
    test "redirects to auth callback", %{conn: conn} do
      conn = get(conn, SignsUiWeb.Router.Helpers.auth_path(conn, :request, "cognito"))

      response = response(conn, 302)

      assert response =~ SignsUiWeb.Router.Helpers.auth_path(conn, :callback, "cognito")
    end
  end

  defmodule FakeRefreshTokenStore do
    def put_refresh_token(username, refresh_token) do
      Logger.info("stored_refresh_token username=#{username} refresh_token=#{refresh_token}")
    end
  end
end
