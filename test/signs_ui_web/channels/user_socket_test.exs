defmodule SignsUiWeb.UserSocketTest do
  use SignsUiWeb.ChannelCase

  setup do
    %{socket: socket()}
  end

  describe "connect/2" do
    test "authenticates when a valid token is given", %{socket: socket} do
      current_time = DateTime.utc_now() |> DateTime.to_unix()
      expiration_time = current_time + 100

      {:ok, token, _claims} =
        SignsUiWeb.AuthManager.encode_and_sign("foo@mbta.com", %{"exp" => expiration_time})

      assert {:ok, _authed_socket} = SignsUiWeb.UserSocket.connect(%{"token" => token}, socket)
    end

    test "doesn't authenticate when an expired token is given", %{socket: socket} do
      current_time = DateTime.utc_now() |> DateTime.to_unix()
      expiration_time = current_time - 100

      {:ok, token, _claims} =
        SignsUiWeb.AuthManager.encode_and_sign("foo@mbta.com", %{"exp" => expiration_time})

      assert SignsUiWeb.UserSocket.connect(%{"token" => token}, socket) == :error
    end
  end
end
