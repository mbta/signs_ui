defmodule SignsUiWeb.AuthControllerTest do
  use SignsUiWeb.ConnCase
  require Logger
  import ExUnit.CaptureLog

  describe "callback" do
    test "redirects on success and saves refresh token", %{conn: conn} do
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
        strategy: SignsUi.Ueberauth.Strategy.Fake,
        extra: %Ueberauth.Auth.Extra{
          raw_info: %UeberauthOidcc.RawInfo{
            userinfo: %{
              "resource_access" => %{
                "test-client" => %{"roles" => ["test1"]}
              }
            },
            opts: %{
              module: SignsUi.Ueberauth.Strategy.Fake,
              issuer: :keycloak_issuer,
              client_id: "fake_client",
              client_secret: "fake_client_secret"
            }
          }
        }
      }

      conn =
        conn
        |> assign(:ueberauth_auth, auth)
        |> get(SignsUiWeb.Router.Helpers.auth_path(conn, :callback, "keycloak"))

      response = html_response(conn, 302)

      assert response =~ SignsUiWeb.Router.Helpers.messages_path(conn, :index)
      assert Guardian.Plug.current_claims(conn)["roles"] == ["test1"]
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
    test "logs user out and redirects to keycloak logout", %{conn: conn} do
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
        strategy: SignsUi.Ueberauth.Strategy.Fake,
        extra: %Ueberauth.Auth.Extra{
          raw_info: %UeberauthOidcc.RawInfo{
            userinfo: %{
              "resource_access" => %{
                "test-client" => %{"roles" => ["test1"]}
              }
            },
            opts: %{
              module: SignsUi.Ueberauth.Strategy.Fake,
              issuer: :keycloak_issuer,
              client_id: "fake_client",
              client_secret: "fake_client_secret"
            }
          }
        }
      }

      conn =
        conn
        |> assign(:ueberauth_auth, auth)
        |> get(SignsUiWeb.Router.Helpers.auth_path(conn, :callback, "keycloak"))

      assert Guardian.Plug.authenticated?(conn)
      conn = get(conn, SignsUiWeb.Router.Helpers.auth_path(conn, :logout, "keycloak"))

      refute Guardian.Plug.authenticated?(conn)

      assert redirected_to(conn) == "/"
    end
  end

  def id(x), do: x
end
