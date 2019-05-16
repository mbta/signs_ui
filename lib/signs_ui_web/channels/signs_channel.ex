defmodule SignsUiWeb.SignsChannel do
  use Phoenix.Channel
  require Logger
  alias SignsUI.Signs.Sign

  def join("signs:all", _message, socket) do
    {:ok, socket}
  end

  @spec handle_in(String.t(), %{Sign.id() => map()}, any()) :: {:noreply, Phoenix.Socket.t()}
  def handle_in("changeSigns", changes, socket) do
    if socket_authenticated?(socket) do
      new_signs =
        changes
        |> Enum.map(fn {id, config} -> {id, Sign.from_config(id, config)} end)
        |> Enum.into(%{})

      {:ok, _new_state} = SignsUI.Signs.State.update_some(new_signs)

      Logger.info("Sign toggled: #{inspect(changes)}")

      {:noreply, socket}
    else
      {:stop, :not_authenticated, socket}
    end
  end

  intercept(["sign_update"])

  def handle_out("sign_update", msg, socket) do
    if socket_authenticated?(socket) do
      push(socket, "sign_update", msg)
      {:noreply, socket}
    else
      {:stop, :not_authenticated, socket}
    end
  end

  @spec socket_authenticated?(Phoenix.Socket.t()) :: boolean()
  defp socket_authenticated?(socket) do
    claims = Guardian.Phoenix.Socket.current_claims(socket)
    token = Guardian.Phoenix.Socket.current_token(socket)

    case SignsUiWeb.AuthManager.decode_and_verify(token, claims) do
      {:ok, _claims} -> true
      {:error, _error} -> false
    end
  end
end
