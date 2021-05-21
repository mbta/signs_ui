defmodule SignsUiWeb.HeadwaysChannelTest do
  use SignsUiWeb.ChannelCase
  import ExUnit.CaptureLog

  setup do
    socket = subscribe_and_join!(socket(), SignsUiWeb.HeadwaysChannel, "headways:all", %{})
    %{socket: socket}
  end

  describe "handle_in/3" do
    test "allows changing multi-sign headways when socket is authenticated", %{socket: socket} do
      current_time = System.system_time(:second)
      expiration_time = current_time + 500

      {:ok, token, claims} =
        SignsUiWeb.AuthManager.encode_and_sign("foo@mbta.com", %{
          "exp" => expiration_time,
          "groups" => ["signs-ui-admin"]
        })

      socket = Guardian.Phoenix.Socket.assign_rtc(socket, "foo@mbta.com", token, claims)

      log =
        capture_log([level: :info], fn ->
          assert {:noreply, _socket} =
                   SignsUiWeb.HeadwaysChannel.handle_in("changeHeadways", %{}, socket)
        end)

      assert log =~ "foo@mbta.com"
    end

    test "rejects changing multi-sign headways when socket is authenticated with read-only view",
         %{
           socket: socket
         } do
      current_time = System.system_time(:second)
      expiration_time = current_time + 500

      {:ok, token, claims} =
        SignsUiWeb.AuthManager.encode_and_sign("foo@mbta.com", %{
          "exp" => expiration_time,
          "groups" => ["signs-ui-read-only"]
        })

      socket = Guardian.Phoenix.Socket.assign_rtc(socket, "foo@mbta.com", token, claims)

      log =
        capture_log([level: :info], fn ->
          assert {:noreply, _socket} =
                   SignsUiWeb.HeadwaysChannel.handle_in("changeHeadways", %{}, socket)
        end)

      refute log =~ "foo@mbta.com"
    end

    test "rejects changing multi-sign headways when socket is not authenticated", %{
      socket: socket
    } do
      current_time = System.system_time(:second)
      expired_time = current_time - 100

      {:ok, token, claims} =
        SignsUiWeb.AuthManager.encode_and_sign("foo@mbta.com", %{"exp" => expired_time})

      socket = Guardian.Phoenix.Socket.assign_rtc(socket, "foo@mbta.com", token, claims)

      {:stop, :normal, _socket} =
        SignsUiWeb.HeadwaysChannel.handle_in("changeHeadways", %{}, socket)

      assert_push("auth_expired", %{})
    end
  end
end
