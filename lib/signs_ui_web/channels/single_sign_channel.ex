defmodule SignsUiWeb.SingleSignChannel do
  use Phoenix.Channel

  def join("signs:single", _message, socket) do
    {:ok, socket}
  end

  intercept(["sign_update"])

  def handle_out("sign_update", msg, socket) do
    %{sign_id: socket_sign_id} = socket.assigns
    %{sign_id: msg_sign_id} = msg

    if(socket_sign_id === msg_sign_id) do
      push(socket, "sign_update:" <> socket_sign_id, msg)
    end

    {:noreply, socket}
  end
end
