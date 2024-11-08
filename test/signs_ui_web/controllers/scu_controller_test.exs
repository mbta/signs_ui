defmodule SignsUiWeb.ScuControllerTest do
  use SignsUiWeb.ConnCase

  setup do
    SignsUi.Config.State.update_scu("BAIRSCU001", false)
  end

  @tag :authenticated
  test "can view SCU configuration", %{conn: conn} do
    conn = get(conn, "/scu")
    assert html_response(conn, 200) =~ "Change to new application"
  end

  @tag :authenticated
  test "can update SCUs", %{conn: conn} do
    conn = post(conn, "/scu", %{"migrated" => "true", "scu_id" => "BAIRSCU001"})
    assert redirected_to(conn) =~ "/scu"
    assert %{"BAIRSCU001" => true} = SignsUi.Config.State.get_all().scus_migrated
  end

  @tag :authenticated_read_only
  test "cannot see SCU upgrade buttons as non-admin", %{conn: conn} do
    conn = get(conn, "/scu")
    refute html_response(conn, 200) =~ "Change to new application"
  end

  @tag :authenticated_read_only
  test "cannot update SCUs as non-admin", %{conn: conn} do
    conn = post(conn, "/scu", %{"migrated" => "true", "scu_id" => "BAIRSCU001"})
    response = response(conn, 302)
    assert %{"BAIRSCU001" => false} = SignsUi.Config.State.get_all().scus_migrated
    assert response =~ "unauthorized"
  end
end
