defmodule SignsUiWeb.SignsControllerTest do
  use SignsUiWeb.ConnCase

  test "GET /signs", %{conn: conn} do
    conn = conn |> add_req_header |> get("/signs")
    assert html_response(conn, 200) =~ "All Signs"
  end

  test "GET /signs returns signs for all routes", %{conn: conn} do
    conn = conn |> add_req_header |> get("/signs")
    assert html_response(conn, 200) =~ "Maverick Eastbound"
    assert html_response(conn, 200) =~ "Eastern Ave"
  end

  test "when filtered to a route, says which line the signs are", %{conn: conn} do
    conn = conn |> add_req_header |> get("/signs?route=blue")
    assert html_response(conn, 200) =~ "Blue Line Signs"
  end

  test "Gets signs for individual route", %{conn: conn} do
    conn = conn |> add_req_header |> get("/signs?route=blue")
    assert html_response(conn, 200) =~ "Maverick Eastbound"
    refute html_response(conn, 200) =~ "Eastern Ave"
  end

  test "POST /", %{conn: conn} do
    conn = conn |> add_req_header |> post("/signs", %{"signs" => %{"sign1" => "true"}})
    assert redirected_to(conn, 302) =~ "/"
    assert conn.private.phoenix_flash == %{"success" => "Signs updated successfully"}
  end

  test "Receives unauthorized if no auth given", %{conn: conn} do
    conn = get conn, "/"
    assert response(conn, 401) =~ "unauthorized"
  end

  test "Receives unauthorized if wrong auth given", %{conn: conn} do
    conn = %{conn | req_headers: [{"authorization", "Basic wrong:auth="}]}
    conn = post(conn, "/signs", %{"signs" => %{"sign1" => "true"}})
    assert response(conn, 401) =~ "unauthorized"
  end

  defp add_req_header(conn) do
    %{conn | req_headers: [{"authorization", "Basic dXNlcm5hbWU6cGFzc3dvcmQ="}]}
  end
end
