defmodule SignsUiWeb.AuthControllerTest do
  use SignsUiWeb.ConnCase

  describe "callback" do
    test "redirects on success", %{conn: conn} do
      auth = %Ueberauth.Auth{
        extra: %Ueberauth.Auth.Extra{
          raw_info: %{
            "cognito:username" => "foo@mbta.com",
            "exp" => 1_557_870_946
          }
        }
      }

      conn
      |> put_status(400)
      |> assign(:ueberauth_auth, auth)
      |> get(SignsUiWeb.Router.Helpers.auth_path(conn, :callback, "cognito"))

      response = html_response(conn, 302)
    end
  end
end
