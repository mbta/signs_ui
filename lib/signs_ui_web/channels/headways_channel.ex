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

      {:ok, _new_state} = SignsUi.Config.update_configured_headways(new_signs)

      username = Guardian.Phoenix.Socket.current_resource(socket)

      change_log =
        for {group, period_map} <- changes,
            {period, bound_map} <- period_map,
            {bound, value} <- bound_map do
          "#{group}.#{period}.#{bound}=#{value}"
        end

      Logger.info("headway_changed: user=#{username} #{Enum.join(change_log, " ")}")
    end)
  end
end
