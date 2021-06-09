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
      Logger.info(["changeSignGroups: ", inspect(changes), ", from: ", inspect(socket)])

      {:ok, _} =
        changes
        |> SignsUi.Config.SignGroups.from_json()
        |> SignsUi.Config.State.update_sign_groups()

      {:noreply, socket}
    end)
  end
end
