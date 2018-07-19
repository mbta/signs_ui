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
             |> add_req_header
             |> get(messages_path(conn, :index))
      assert html_response(conn, 200) =~ "Listing Messages"
    end
  end

  describe "create messages" do
    test "responds with the json message when its valid", %{conn: conn} do
      conn = conn
             |> add_req_header
             |> post(messages_path(conn, :create, @update_attrs), messages: @update_attrs)
      assert json_response(conn, 200) == "{\n    {\n      \"MsgType\" => SignContent\n      \"c\" => e120~m2-\"Bowdoin 4 min\"\n      \"sta\" => BGOV\n      \"uid\" => 22\n    },\n}\n"
    end
  end

  defp add_req_header(conn) do
    %{conn | req_headers: [{"authorization", "Basic dXNlcm5hbWU6cGFzc3dvcmQ="}]}
  end
end
