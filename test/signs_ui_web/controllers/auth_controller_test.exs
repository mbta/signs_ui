defmodule SignsUiWeb.AuthControllerTest do
  use SignsUiWeb.ConnCase

  describe "callback" do
    test "redirects on success", %{conn: conn} do
      current_time = System.system_time(:second)

      auth = %Ueberauth.Auth{
        uid: "foo@mbta.com",
        credentials: %Ueberauth.Auth.Credentials{
          expires_at: current_time + 1_000
        }
      }

      conn =
        conn
        |> assign(:ueberauth_auth, auth)
        |> get(SignsUiWeb.Router.Helpers.auth_path(conn, :callback, "cognito"))

      response = html_response(conn, 302)

      assert response =~ SignsUiWeb.Router.Helpers.messages_path(conn, :index)
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
end
