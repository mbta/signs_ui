defmodule SignsUiWeb.SocketAuth do
  @moduledoc """
  Functions for handling authentication with sockets for use with channels.
  """
  import Phoenix.Channel

  @spec socket_access_level(Phoenix.Socket.t()) :: SignsUiWeb.AuthManager.access_level()
  def socket_access_level(socket) do
    claims = Guardian.Phoenix.Socket.current_claims(socket)
    token = Guardian.Phoenix.Socket.current_token(socket)

    case SignsUiWeb.AuthManager.decode_and_verify(token, claims) do
      {:ok, claims} -> SignsUiWeb.AuthManager.claims_access_level(claims)
      _ -> :none
    end
  end

  @spec send_auth_expired_message(Phoenix.Socket.t()) :: Phoenix.Socket.t()
  def send_auth_expired_message(socket) do
    :ok = push(socket, "auth_expired", %{})
    socket
  end

  @spec with_admin_access(Phoenix.Socket.t(), fun()) ::
          {:noreply, Phoenix.Socket.t()} | {:stop, :normal, Phoenix.Socket.t()}
  def with_admin_access(socket, callback) do
    case socket_access_level(socket) do
      :admin ->
        callback.()

        {:noreply, socket}

      :read_only ->
        {:noreply, socket}

      :none ->
        {:stop, :normal, send_auth_expired_message(socket)}
    end
  end
end
