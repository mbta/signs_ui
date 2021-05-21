defmodule SignsUiWeb.HeadwaysChannel do
  @moduledoc """
  Channel for changing headways.
  """
  use Phoenix.Channel
  require Logger
  alias SignsUi.Config.ConfiguredHeadways
  import SignsUiWeb.SocketAuth

  @impl Phoenix.Channel
  def join("headways:all", _message, socket) do
    {:ok, socket}
  end

  @impl Phoenix.Channel
  def handle_in("changeHeadways", changes, socket) do
    with_admin_access(socket, fn ->
      new_signs = ConfiguredHeadways.parse_configured_headways_json(changes)

      {:ok, _new_state} = SignsUi.Config.State.update_configured_headways(new_signs)

      username = Guardian.Phoenix.Socket.current_resource(socket)

      Logger.info("headway_changed: user=#{username} changes=#{inspect(changes)}")
    end)
  end
end
