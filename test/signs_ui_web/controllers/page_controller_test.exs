defmodule SignsUiWeb.PageControllerTest do
  use SignsUiWeb.ConnCase
  import Plug.Test

  describe "GET /" do
    test "Redirects to viewer when logged in", %{conn: conn} do
      current_time = DateTime.utc_now() |> DateTime.to_unix()
      conn = conn |> init_test_session(login_expiration: current_time + 1_000)

      conn = get(conn, "/")
      assert html_response(conn, 302) =~ "/viewer"
    end

    test "Redirects to Cognito route when not logged in", %{conn: conn} do
      conn = get(conn, "/")
      assert html_response(conn, 302) =~ "/cognito/new"
    end
  end
end
