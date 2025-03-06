defmodule SignsUiWeb.MessagesControllerTest do
  use SignsUiWeb.ChannelCase
  use SignsUiWeb.ConnCase
  import ExUnit.CaptureLog

  @update_attrs %{
    "MsgType" => "SignContent",
    "c" => ["e120~m2-\"Bowdoin 4 min\""],
    "sta" => "BGOV",
    "uid" => 22
  }

  describe "index" do
    @tag :authenticated
    test "lists all messages", %{conn: conn} do
      conn = get(conn, messages_path(conn, :index))

      assert html_response(conn, 200) =~ "MBTA Realtime Signs"
    end

    @tag :authenticated
    test "includes user token", %{conn: conn} do
      conn = get(conn, messages_path(conn, :index))

      response = html_response(conn, 200)

      token = Regex.run(~r/window.userToken = "(.+)";/, response) |> Enum.at(1)

      assert {:ok, _claims} = Guardian.decode_and_verify(SignsUiWeb.AuthManager, token)
    end

    @tag :authenticated
    test "doesn't include read-only view when user has admin access", %{conn: conn} do
      conn = get(conn, messages_path(conn, :index))

      response = html_response(conn, 200)

      assert response =~ "readOnly = false"
    end

    @tag :authenticated_read_only
    test "includes read-only view when user doesn't have admin access", %{conn: conn} do
      conn = get(conn, messages_path(conn, :index))

      response = html_response(conn, 200)

      assert response =~ "readOnly = true"
    end

    @tag :authenticated
    test "includes path to sign out", %{conn: conn} do
      conn = get(conn, messages_path(conn, :index))

      response = html_response(conn, 200)

      assert response =~ "signOutPath = \"/auth/keycloak/logout\""
    end
  end

  describe "create messages" do
    test "responds with 201 and logs the access", %{conn: conn} do
      log =
        capture_log([level: :info], fn ->
          conn =
            conn
            |> add_api_req_header()
            |> post(messages_path(conn, :create), @update_attrs)

          assert response(conn, 201)
        end)

      assert log =~ "messages_api_user=test_user_2"
    end

    test "responds with 201 when receiving an unknown message type", %{conn: conn} do
      conn =
        conn
        |> add_api_req_header()
        |> post(messages_path(conn, :create), %{"MsgType" => "Unknown"})

      assert response(conn, 201) =~ "Ignoring unknown message."
    end

    test "responds with 201 but logs a warnings when message can't be parsed", %{conn: conn} do
      log =
        capture_log([level: :warn], fn ->
          conn =
            conn
            |> add_api_req_header()
            |> post(messages_path(conn, :create), %{
              "MsgType" => "SignContent",
              "sta" => "BGOV",
              "c" => ["e100~~~"]
            })

          assert response(conn, 201)
        end)

      assert log =~ "could_not_process"
    end

    test "responds with the 401 when the key is invalid", %{conn: conn} do
      conn =
        conn
        |> post(messages_path(conn, :create), @update_attrs)

      assert response(conn, 401)
    end

    test "creates audio messages", %{conn: conn} do
      subscribe_and_join!(socket(), SignsUiWeb.SignsChannel, "signs:all", %{})

      conn
      |> add_api_req_header()
      |> post(messages_path(conn, :create), %{
        "MsgType" => "AdHoc",
        "msg" => "This is a message",
        "typ" => "0",
        "sta" => "RDAV000100",
        "tim" => "500"
      })

      assert_broadcast("sign_update", %{
        audios: [%{station: "RDAV", visual_data: %{pages: [%{top: "This is a message"}]}}]
      })
    end

    test "background", %{conn: conn} do
      subscribe_and_join!(socket(), SignsUiWeb.SignsChannel, "signs:all", %{})

      conn
      |> add_api_req_header()
      |> put_req_header("x-scu-id", "BAIRSCU001")
      |> post(messages_path(conn, :background), %{
        "visual_zones" => ["e"],
        "visual_data" => %{"pages" => [%{"top" => "top", "bottom" => "bottom", "duration" => 6}]},
        "expiration" => 180
      })

      assert_broadcast("sign_update", %{
        lines: %{1 => %{text: [%{content: "top"}]}, 2 => %{text: [%{content: "bottom"}]}},
        sign_id: "BAIR-e"
      })
    end
  end

  defp add_api_req_header(conn) do
    %{conn | req_headers: [{"x-api-key", "test_key_2"}]}
  end
end
