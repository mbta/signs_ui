defmodule SignsUiWeb.ChelseaBridgeAnnouncementsChannelTest do
  use SignsUiWeb.ChannelCase
  import ExUnit.CaptureLog
  alias Test.Support.Helpers

  setup do
    socket =
      subscribe_and_join!(
        socket(),
        SignsUiWeb.ChelseaBridgeAnnouncementsChannel,
        "chelseaBridgeAnnouncements:all",
        %{}
      )

    %{socket: socket}
  end

  describe "handle_in/3" do
    test "allows changing chelsea bridge announcements when socket is authenticated", %{
      socket: socket
    } do
      socket = Helpers.sign_in_with_groups(socket, "foo@mbta.com", ["signs-ui-admin"])

      log =
        capture_log([level: :info], fn ->
          assert {:noreply, _socket} =
                   SignsUiWeb.ChelseaBridgeAnnouncementsChannel.handle_in(
                     "changeChelseaBridgeAnnouncements",
                     %{"mode" => "auto"},
                     socket
                   )
        end)

      assert log =~ "foo@mbta.com"
    end

    test "rejects changing chelsea bridge announcements when socket is authenticated with read-only view",
         %{
           socket: socket
         } do
      socket = Helpers.sign_in_with_groups(socket, "foo@mbta.com", ["signs-ui-read-only"])

      log =
        capture_log([level: :info], fn ->
          assert {:noreply, _socket} =
                   SignsUiWeb.ChelseaBridgeAnnouncementsChannel.handle_in(
                     "changeChelseaBridgeAnnouncements",
                     %{"mode" => "auto"},
                     socket
                   )
        end)

      refute log =~ "foo@mbta.com"
    end

    test "rejects changing chelsea bridge announcements when socket is not authenticated", %{
      socket: socket
    } do
      current_time = System.system_time(:second)
      expired_time = current_time - 100

      {:ok, token, claims} =
        SignsUiWeb.AuthManager.encode_and_sign("foo@mbta.com", %{"exp" => expired_time})

      socket = Guardian.Phoenix.Socket.assign_rtc(socket, "foo@mbta.com", token, claims)

      {:stop, :normal, _socket} =
        SignsUiWeb.ChelseaBridgeAnnouncementsChannel.handle_in(
          "changeChelseaBridgeAnnouncements",
          %{"mode" => "auto"},
          socket
        )

      assert_push("auth_expired", %{})
    end
  end
end
