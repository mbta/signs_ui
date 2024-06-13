defmodule SignsUiWeb.SignGroupsChannel do
  @moduledoc """
  Channel for changing sign groups.
  """
  use Phoenix.Channel
  require Logger
  import SignsUiWeb.SocketAuth

  @impl Phoenix.Channel
  def join("signGroups:all", _message, socket) do
    {:ok, socket}
  end

  @impl Phoenix.Channel
  def handle_in("changeSignGroups", %{"data" => changes}, socket) do
    with_admin_access(socket, fn ->
      entry = Map.values(changes) |> List.first(%{})

      Utilities.Common.log(
        "sign_groups_changed",
        user: Guardian.Phoenix.Socket.current_resource(socket),
        sign_ids: entry["sign_ids"] && inspect(entry["sign_ids"]),
        line1: entry["line1"] && inspect(entry["line1"]),
        line2: entry["line2"] && inspect(entry["line2"]),
        expires: entry["expires"],
        changes: inspect(changes)
      )

      {:ok, _} =
        changes
        |> SignsUi.Config.SignGroups.from_json()
        |> SignsUi.Config.update_sign_groups()

      {:noreply, socket}
    end)
  end
end
