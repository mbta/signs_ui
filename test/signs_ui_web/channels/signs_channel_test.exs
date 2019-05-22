defmodule SignsUiWeb.SignsChannelTest do
  use SignsUiWeb.ChannelCase
  import ExUnit.CaptureLog

  setup do
    socket = subscribe_and_join!(socket(), SignsUiWeb.SignsChannel, "signs:all", %{})
    %{socket: socket}
  end

  describe "handle_in" do
    test "allows changing signs when socket is authenticated", %{socket: socket} do
      current_time = System.system_time(:second)
      expiration_time = current_time + 500

      {:ok, token, claims} =
        SignsUiWeb.AuthManager.encode_and_sign("foo@mbta.com", %{"exp" => expiration_time})

      socket = Guardian.Phoenix.Socket.assign_rtc(socket, "foo@mbta.com", token, claims)

      log =
        capture_log([level: :info], fn ->
          assert {:noreply, _socket} =
                   SignsUiWeb.SignsChannel.handle_in("changeSigns", %{}, socket)
        end)

      assert log =~ "foo@mbta.com"
    end

    test "rejects changing signs when socket is not authenticated", %{socket: socket} do
      current_time = System.system_time(:second)
      expired_time = current_time - 100

      {:ok, token, claims} =
        SignsUiWeb.AuthManager.encode_and_sign("foo@mbta.com", %{"exp" => expired_time})

      socket = Guardian.Phoenix.Socket.assign_rtc(socket, "foo@mbta.com", token, claims)

      {:stop, :normal, _socket} = SignsUiWeb.SignsChannel.handle_in("changeSigns", %{}, socket)

      assert_push("auth_expired", %{})
    end
  end

  describe "handle_out" do
    test "allows sending sign updates when socket is authenticated", %{socket: socket} do
      current_time = System.system_time(:second)
      expiration_time = current_time + 500

      {:ok, token, claims} =
        SignsUiWeb.AuthManager.encode_and_sign("foo@mbta.com", %{"exp" => expiration_time})

      socket = Guardian.Phoenix.Socket.assign_rtc(socket, "foo@mbta.com", token, claims)

      assert {:noreply, _socket} = SignsUiWeb.SignsChannel.handle_out("sign_update", %{}, socket)
    end

    test "rejects sending sign updates when socket is not authenticated", %{socket: socket} do
      current_time = System.system_time(:second)
      expired_time = current_time - 100

      {:ok, token, claims} =
        SignsUiWeb.AuthManager.encode_and_sign("foo@mbta.com", %{"exp" => expired_time})

      socket = Guardian.Phoenix.Socket.assign_rtc(socket, "foo@mbta.com", token, claims)

      {:stop, :normal, _socket} = SignsUiWeb.SignsChannel.handle_out("sign_update", %{}, socket)

      assert_push("auth_expired", %{})
    end
  end
end
