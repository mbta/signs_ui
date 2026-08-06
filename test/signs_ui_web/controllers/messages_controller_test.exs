defmodule SignsUiWeb.MessagesControllerTest do
  use SignsUiWeb.ChannelCase
  use SignsUiWeb.ConnCase

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
    test "background", %{conn: conn} do
      subscribe_and_join!(
        socket(SignsUiWeb.UserSocket),
        SignsUiWeb.SignsChannel,
        "signs:all",
        %{}
      )

      conn
      |> add_api_req_header()
      |> post(messages_path(conn, :background), %{
        "zones" => ["BAIR-e"],
        "visual_data" => %{"pages" => [%{"top" => "top", "bottom" => "bottom", "duration" => 6}]},
        "expiration" => 180
      })

      assert_broadcast("sign_update", %{
        lines: %{1 => %{text: [%{content: "top"}]}, 2 => %{text: [%{content: "bottom"}]}},
        sign_id: "BAIR-e"
      })
    end

    test "play", %{conn: conn} do
      subscribe_and_join!(
        socket(SignsUiWeb.UserSocket),
        SignsUiWeb.SignsChannel,
        "signs:all",
        %{}
      )

      conn
      |> add_api_req_header()
      |> post(messages_path(conn, :play), %{
        "zones" => ["BAIR-e"],
        "visual_data" => %{
          "pages" => [%{"top" => "top", "bottom" => "bottom", "duration" => 6}]
        },
        "audio_data" => [%{"type" => "chime"}],
        "expiration" => 180
      })

      assert_broadcast("sign_update", %{
        audios: [
          %{
            station: "BAIR",
            zones: ["e"],
            visual_data: %{pages: [%{top: "top", bottom: "bottom", duration: 6}]}
          }
        ],
        sign_id: "BAIR-e"
      })
    end

    test "ignores messages with no zones", %{conn: conn} do
      subscribe_and_join!(
        socket(SignsUiWeb.UserSocket),
        SignsUiWeb.SignsChannel,
        "signs:all",
        %{}
      )

      assert %{status: 200} =
               conn
               |> add_api_req_header()
               |> post(messages_path(conn, :play), %{
                 "zones" => [],
                 "visual_data" => nil,
                 "audio_data" => [%{"type" => "chime"}],
                 "expiration" => 180
               })

      refute_broadcast("sign_update", %{})
    end
  end

  defp add_api_req_header(conn) do
    %{conn | req_headers: [{"x-api-key", "test_key_2"}]}
  end
end
