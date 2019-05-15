defmodule SignsUiWeb.AuthControllerTest do
  use SignsUiWeb.ConnCase

  describe "callback" do
    test "redirects on success", %{conn: conn} do
      auth = %Ueberauth.Auth{
        uid: "foo@mbta.com",
        extra: %Ueberauth.Auth.Extra{
          raw_info: %{
            "exp" => 1_557_870_946
          }
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
end
