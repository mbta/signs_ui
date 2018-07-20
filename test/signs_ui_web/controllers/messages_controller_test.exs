defmodule SignsUiWeb.MessagesControllerTest do
  use SignsUiWeb.ConnCase

  @update_attrs %{
      "MsgType" => "SignContent",
      "c" => "e120~m2-\"Bowdoin 4 min\"",
      "sta" => "BGOV",
      "uid" => 22
    }

  describe "index" do
    test "lists all messages", %{conn: conn} do
      conn = conn
             |> add_req_header(:basic)
             |> get(messages_path(conn, :index))
      assert html_response(conn, 200) =~ "Listing Messages"
    end
  end

  describe "create messages" do
    test "responds with the 201 when its valid", %{conn: conn} do
      conn = conn
             |> add_req_header(:api)
             |> post(messages_path(conn, :create, @update_attrs), messages: @update_attrs)
      assert response(conn, 201)
    end

    test "responds with the 401 when the key is invalid", %{conn: conn} do
      conn = conn
             |> post(messages_path(conn, :create, @update_attrs), messages: @update_attrs)
      assert response(conn, 401)
    end
  end

  defp add_req_header(conn, :api) do
    %{conn | req_headers: [{"x-api-key", "placeholder_key"}]}
  end
  defp add_req_header(conn, :basic) do
    %{conn | req_headers: [{"authorization", "Basic dXNlcm5hbWU6cGFzc3dvcmQ="}]}
  end
end
