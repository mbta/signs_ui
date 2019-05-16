defmodule SignsUiWeb.SignsChannelTest do
  use SignsUiWeb.ChannelCase

  setup do
    socket = subscribe_and_join!(socket(), SignsUiWeb.SignsChannel, "signs:all", %{})
    %{socket: socket}
  end

  describe "handle_in" do
    test "allows changing signs when socket is authenticated", %{socket: socket} do
      current_time = DateTime.utc_now() |> DateTime.to_unix()
      expiration_time = current_time + 100

      {:ok, token, claims} =
        SignsUiWeb.AuthManager.encode_and_sign("foo@mbta.com", %{"exp" => expiration_time})

      socket = Guardian.Phoenix.Socket.assign_rtc(socket, "foo@mbta.com", token, claims)

      assert {:noreply, _socket} = SignsUiWeb.SignsChannel.handle_in("changeSigns", %{}, socket)
    end

    test "rejects changing signs when socket is not authenticated", %{socket: socket} do
      current_time = DateTime.utc_now() |> DateTime.to_unix()
      expired_time = current_time - 100

      {:ok, token, claims} =
        SignsUiWeb.AuthManager.encode_and_sign("foo@mbta.com", %{"exp" => expired_time})

      socket = Guardian.Phoenix.Socket.assign_rtc(socket, "foo@mbta.com", token, claims)

      {:noreply, _socket} = SignsUiWeb.SignsChannel.handle_in("changeSigns", %{}, socket)

      assert_push("auth_expired", %{})
    end

    test "doesn't double-sending auth_expired message", %{socket: socket} do
      current_time = DateTime.utc_now() |> DateTime.to_unix()
      expired_time = current_time - 100

      {:ok, token, claims} =
        SignsUiWeb.AuthManager.encode_and_sign("foo@mbta.com", %{"exp" => expired_time})

      socket = Guardian.Phoenix.Socket.assign_rtc(socket, "foo@mbta.com", token, claims)

      {:noreply, socket} = SignsUiWeb.SignsChannel.handle_in("changeSigns", %{}, socket)

      assert_push("auth_expired", %{})

      {:noreply, _socket} = SignsUiWeb.SignsChannel.handle_in("changeSigns", %{}, socket)

      refute_push("auth_expired", %{})
    end
  end

  describe "handle_out" do
    test "allows sending sign updates when socket is authenticated", %{socket: socket} do
      current_time = DateTime.utc_now() |> DateTime.to_unix()
      expiration_time = current_time + 100

      {:ok, token, claims} =
        SignsUiWeb.AuthManager.encode_and_sign("foo@mbta.com", %{"exp" => expiration_time})

      socket = Guardian.Phoenix.Socket.assign_rtc(socket, "foo@mbta.com", token, claims)

      assert {:noreply, _socket} = SignsUiWeb.SignsChannel.handle_out("sign_update", %{}, socket)
    end

    test "rejects sending sign updates when socket is not authenticated", %{socket: socket} do
      current_time = DateTime.utc_now() |> DateTime.to_unix()
      expired_time = current_time - 100

      {:ok, token, claims} =
        SignsUiWeb.AuthManager.encode_and_sign("foo@mbta.com", %{"exp" => expired_time})

      socket = Guardian.Phoenix.Socket.assign_rtc(socket, "foo@mbta.com", token, claims)

      {:noreply, _socket} = SignsUiWeb.SignsChannel.handle_out("sign_update", %{}, socket)

      assert_push("auth_expired", %{})
    end
  end
end
