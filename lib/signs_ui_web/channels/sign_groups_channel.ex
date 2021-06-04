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
  def handle_in("changeSignGroups", %{"route" => route, "data" => data} = changes, socket) do
    Logger.info(["changeSignGroups: ", inspect(changes), ", from: ", inspect(socket)])

    SignsUiWeb.Endpoint.broadcast!("signGroups:all", "new_sign_groups_state", %{route => data})

    {:noreply, socket}
  end
end
