defmodule SignsUiWeb.EnsureSignsUiAdminGroupTest do
  use SignsUiWeb.ConnCase

  describe "init/1" do
    test "passes options through unchanged" do
      assert SignsUiWeb.EnsureSignsUiAdminGroup.init([]) == []
    end
  end

  describe "call/2" do
    @tag :authenticated
    test "does nothing when user is in the signs-ui-admin group", %{conn: conn} do
      assert conn == SignsUiWeb.EnsureSignsUiAdminGroup.call(conn, [])
    end

    test "does nothing when user is not in the signs-ui-admin group", %{conn: conn} do
      conn = SignsUiWeb.EnsureSignsUiAdminGroup.call(conn, [])

      response = html_response(conn, 302)
      assert response =~ "/unauthorized"
    end
  end
end
