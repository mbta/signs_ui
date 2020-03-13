defmodule SignsUiWeb.SignsChannel do
  use Phoenix.Channel
  require Logger
  alias SignsUi.Config.Sign

  def join("signs:all", _message, socket) do
    {:ok, socket}
  end

  @spec handle_in(String.t(), %{Sign.id() => map()}, any()) :: {:noreply, Phoenix.Socket.t()}
  def handle_in("changeSigns", changes, socket) do
    case socket_access_level(socket) do
      :admin ->
        new_signs = Map.new(changes, fn {id, config} -> {id, Sign.from_config(id, config)} end)

        {:ok, _new_state} = SignsUi.Config.State.update_sign_configs(new_signs)

        username = Guardian.Phoenix.Socket.current_resource(socket)

        Logger.info("sign_changed: user=#{username} changes=#{inspect(changes)}")

        {:noreply, socket}

      :read_only ->
        {:noreply, socket}

      :none ->
        {:stop, :normal, send_auth_expired_message(socket)}
    end
  end

  def handle_in("changeHeadways", changes, socket) do
    case socket_access_level(socket) do
      :admin ->
        new_signs = Map.new(changes, fn {id, config} -> {id, Sign.from_config(id, config)} end)

        {:ok, _new_state} = SignsUi.Config.State.update_sign_configs(new_signs)

        username = Guardian.Phoenix.Socket.current_resource(socket)

        Logger.info("headway_changed: user=#{username} changes=#{inspect(changes)}")

        {:noreply, socket}

      :read_only ->
        {:noreply, socket}

      :none ->
        {:stop, :normal, send_auth_expired_message(socket)}
    end
  end

  intercept(["sign_update"])

  def handle_out("sign_update", msg, socket) do
    if socket_access_level(socket) in [:admin, :read_only] do
      push(socket, "sign_update", msg)
      {:noreply, socket}
    else
      {:stop, :normal, send_auth_expired_message(socket)}
    end
  end

  @spec socket_access_level(Phoenix.Socket.t()) :: SignsUiWeb.AuthManager.access_level()
  defp socket_access_level(socket) do
    claims = Guardian.Phoenix.Socket.current_claims(socket)
    token = Guardian.Phoenix.Socket.current_token(socket)

    case SignsUiWeb.AuthManager.decode_and_verify(token, claims) do
      {:ok, claims} -> SignsUiWeb.AuthManager.claims_access_level(claims)
      _ -> :none
    end
  end

  @spec send_auth_expired_message(Phoenix.Socket.t()) :: Phoenix.Socket.t()
  defp send_auth_expired_message(socket) do
    :ok = push(socket, "auth_expired", %{})
    socket
  end
end
