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

    test "handles generic failure", %{conn: conn} do
      log =
        capture_log([level: :error], fn ->
          conn =
            conn
            |> assign(:ueberauth_failure, %Ueberauth.Failure{})
            |> get(SignsUiWeb.Router.Helpers.auth_path(conn, :callback, "cognito"))

          assert response(conn, 403) =~ "unauthenticated"
        end)

      assert log =~ "ueberauth_failure"
    end

    test "handles failure to use refresh token", %{conn: conn} do
      reassign_env(:refresh_token_store, SignsUiWeb.AuthControllerTest.FakeRefreshTokenStore)

      log =
        capture_log([level: :info], fn ->
          conn =
            conn
            |> init_test_session(%{signs_ui_username: "foo@mbta.com"})
            |> assign(:ueberauth_failure, %Ueberauth.Failure{
              errors: [%Ueberauth.Failure.Error{message_key: "refresh_token_failure"}]
            })
            |> get(SignsUiWeb.Router.Helpers.auth_path(conn, :callback, "cognito"))

          response = response(conn, 302)

          assert response =~ SignsUiWeb.Router.Helpers.auth_path(conn, :request, "cognito")
        end)

      assert log =~ "cleared_refresh_token username=foo@mbta.com"
    end

    @tag :capture_log
    test "handles bad_state by redirecting to /auth/cognito", %{conn: conn} do
      conn =
        conn
        |> assign(:ueberauth_failure, %Ueberauth.Failure{
          errors: [%Ueberauth.Failure.Error{message_key: "bad_state"}]
        })
        |> get(SignsUiWeb.Router.Helpers.auth_path(conn, :callback, "cognito"))

      response = response(conn, 302)

      assert response =~ SignsUiWeb.Router.Helpers.auth_path(conn, :request, "cognito")
    end
  end

  describe "request" do
    test "redirects to auth callback", %{conn: conn} do
      conn = get(conn, SignsUiWeb.Router.Helpers.auth_path(conn, :request, "cognito"))

      response = response(conn, 302)

      assert response =~ SignsUiWeb.Router.Helpers.auth_path(conn, :callback, "cognito")
    end
  end

  describe "logout" do
    @tag :authenticated
    test "clears refresh token, logs user out, and redirects to Cognito logout", %{conn: conn} do
      reassign_env(:refresh_token_store, SignsUiWeb.AuthControllerTest.FakeRefreshTokenStore)

      log =
        capture_log([level: :info], fn ->
          conn = get(conn, SignsUiWeb.Router.Helpers.auth_path(conn, :logout, "cognito"))

          response = response(conn, 302)

          assert is_nil(Guardian.Plug.current_claims(conn))

          assert response =~ "https://test_auth_domain/logout?client_id=test_client_secret"
        end)

      assert log =~ "cleared_refresh_token"
    end

    test "handles tuple format of application environment configuration", %{conn: conn} do
      reassign_env(:refresh_token_store, SignsUiWeb.AuthControllerTest.FakeRefreshTokenStore)

      old_config = Application.get_env(:ueberauth, Ueberauth.Strategy.Cognito)

      new_config =
        Keyword.put(
          old_config,
          :client_id,
          {SignsUiWeb.AuthControllerTest, :id, ["test_client_secret_2"]}
        )

      on_exit(fn -> Application.put_env(:ueberauth, Ueberauth.Strategy.Cognito, old_config) end)

      Application.put_env(:ueberauth, Ueberauth.Strategy.Cognito, new_config)

      conn = get(conn, SignsUiWeb.Router.Helpers.auth_path(conn, :logout, "cognito"))

      response = response(conn, 302)

      assert response =~ "https://test_auth_domain/logout?client_id=test_client_secret_2"
    end
  end

  defmodule FakeRefreshTokenStore do
    def put_refresh_token(username, refresh_token) do
      Logger.info("stored_refresh_token username=#{username} refresh_token=#{refresh_token}")
    end

    def clear_refresh_token(username) do
      Logger.info("cleared_refresh_token username=#{username}")
    end
  end

  def id(x), do: x
end
