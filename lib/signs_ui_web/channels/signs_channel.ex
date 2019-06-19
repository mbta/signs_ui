defmodule SignsUiWeb.SignsChannel do
  use Phoenix.Channel
  require Logger
  alias SignsUi.Config.Sign

  def join("signs:all", _message, socket) do
    {:ok, socket}
  end

  @spec handle_in(String.t(), %{Sign.id() => map()}, any()) :: {:noreply, Phoenix.Socket.t()}
  def handle_in("changeSigns", changes, socket) do
    if socket_authenticated?(socket) do
      new_signs = Map.new(changes, fn {id, config} -> {id, Sign.from_config(id, config)} end)

      {:ok, _new_state} = SignsUi.Config.State.update_some(new_signs)

      username = Guardian.Phoenix.Socket.current_resource(socket)

      Logger.info("sign_changed: user=#{username} changes=#{inspect(changes)}")

      {:noreply, socket}
    else
      {:stop, :normal, send_auth_expired_message(socket)}
    end
  end

  intercept(["sign_update"])

  def handle_out("sign_update", msg, socket) do
    if socket_authenticated?(socket) do
      push(socket, "sign_update", msg)
      {:noreply, socket}
    else
      {:stop, :normal, send_auth_expired_message(socket)}
    end
  end

  @spec socket_authenticated?(Phoenix.Socket.t()) :: boolean()
  defp socket_authenticated?(socket) do
    claims = Guardian.Phoenix.Socket.current_claims(socket)
    token = Guardian.Phoenix.Socket.current_token(socket)

    with {:ok, claims} <- SignsUiWeb.AuthManager.decode_and_verify(token, claims),
         true <- SignsUiWeb.AuthManager.claims_grant_signs_access?(claims) do
      true
    else
      _ -> false
    end
  end

  @spec send_auth_expired_message(Phoenix.Socket.t()) :: Phoenix.Socket.t()
  defp send_auth_expired_message(socket) do
    :ok = push(socket, "auth_expired", %{})
    socket
  end
end
