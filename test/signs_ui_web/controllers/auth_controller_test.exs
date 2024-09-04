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
        provider: :keycloak,
        uid: "foo@mbta.com",
        credentials: %Ueberauth.Auth.Credentials{
          token: "FAKE TOKEN",
          refresh_token: "bar",
          expires_at: current_time + 1_000,
          other: %{
            id_token: "FAKE ID TOKEN"
          }
        },
        strategy: Ueberauth.Strategy.Oidcc,
        extra: %Ueberauth.Auth.Extra{
          raw_info: %UeberauthOidcc.RawInfo{
            userinfo: %{
              "resource_access" => %{
                "test-client" => %{"roles" => ["test1"]}
              }
            },
            opts: %{
              module: __MODULE__.FakeOidcc,
              issuer: :keycloak_issuer,
              client_id: "fake_client",
              client_secret: "fake_client_secret"
            }
          }
        }
      }

      log =
        capture_log([level: :info], fn ->
          conn =
            conn
            |> assign(:ueberauth_auth, auth)
            |> get(SignsUiWeb.Router.Helpers.auth_path(conn, :callback, "keycloak"))

          response = html_response(conn, 302)

          assert response =~ SignsUiWeb.Router.Helpers.messages_path(conn, :index)
          assert Guardian.Plug.current_claims(conn)["roles"] == ["test1"]
        end)

      assert log =~ "stored_refresh_token username=foo@mbta.com refresh_token=bar"
    end

    test "handles generic failure", %{conn: conn} do
      log =
        capture_log([level: :error], fn ->
          conn =
            conn
            |> assign(:ueberauth_failure, %Ueberauth.Failure{})
            |> get(SignsUiWeb.Router.Helpers.auth_path(conn, :callback, "keycloak"))

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
            |> get(SignsUiWeb.Router.Helpers.auth_path(conn, :callback, "keycloak"))

          response = response(conn, 302)

          assert response =~ SignsUiWeb.Router.Helpers.auth_path(conn, :request, "keycloak")
        end)

      assert log =~ "cleared_refresh_token username=foo@mbta.com"
    end

    @tag :capture_log
    test "handles bad_state by redirecting to /auth/keycloak", %{conn: conn} do
      conn =
        conn
        |> assign(:ueberauth_failure, %Ueberauth.Failure{
          errors: [%Ueberauth.Failure.Error{message_key: "bad_state"}]
        })
        |> get(SignsUiWeb.Router.Helpers.auth_path(conn, :callback, "keycloak"))

      response = response(conn, 302)

      assert response =~ SignsUiWeb.Router.Helpers.auth_path(conn, :request, "keycloak")
    end
  end

  describe "request" do
    test "redirects to auth callback", %{conn: conn} do
      conn = get(conn, SignsUiWeb.Router.Helpers.auth_path(conn, :request, "keycloak"))

      response = response(conn, 302)

      assert response =~ SignsUiWeb.Router.Helpers.auth_path(conn, :callback, "keycloak")
    end
  end

  describe "logout" do
    @tag :authenticated
    test "clears refresh token, logs user out, and redirects to keycloak logout", %{conn: conn} do
      reassign_env(:refresh_token_store, SignsUiWeb.AuthControllerTest.FakeRefreshTokenStore)

      log =
        capture_log([level: :info], fn ->
          conn = get(conn, SignsUiWeb.Router.Helpers.auth_path(conn, :logout, "keycloak"))

          response = response(conn, 302)

          assert is_nil(Guardian.Plug.current_claims(conn))

          assert response =~ "/auth/keycloak/logout"
        end)

      assert log =~ "cleared_refresh_token"
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

  defmodule FakeOidcc do
    def initiate_logout_url("FAKE ID TOKEN", :keycloak_issuer, "fake_client", opts) do
      {:ok, "/end_session?#{URI.encode_query(opts)}"}
    end
  end
end
