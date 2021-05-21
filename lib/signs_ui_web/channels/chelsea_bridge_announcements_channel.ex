defmodule SignsUiWeb.ChelseaBridgeAnnouncementsChannel do
  @moduledoc """
  Channel for setting Chelsea Bridge Announcements.
  """
  use Phoenix.Channel
  require Logger
  import SignsUiWeb.SocketAuth

  @impl Phoenix.Channel
  def join("chelseaBridgeAnnouncements:all", _message, socket) do
    {:ok, socket}
  end

  @impl Phoenix.Channel
  def handle_in("changeChelseaBridgeAnnouncements", %{"mode" => changes}, socket) do
    with_admin_access(socket, fn ->
      {:ok, _new_state} = SignsUi.Config.State.update_chelsea_bridge_announcements(changes)

      username = Guardian.Phoenix.Socket.current_resource(socket)

      Logger.info(
        "chelsea_bridge_announcements_changed: user=#{username} changes=#{inspect(changes)}"
      )
    end)
  end
end
