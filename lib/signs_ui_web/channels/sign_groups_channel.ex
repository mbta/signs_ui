defmodule SignsUiWeb.SignGroupsChannel do
  @moduledoc """
  Channel for changing sign groups.
  """
  use Phoenix.Channel
  require Logger

  @impl Phoenix.Channel
  def join("signGroups:all", _message, socket) do
    {:ok, socket}
  end

  @impl Phoenix.Channel
  def handle_in("changeSignGroups", changes, socket) do
    Logger.info(["changeSignGroups: ", inspect(changes), ", from: ", inspect(socket)])

    {:noreply, socket}
  end
end
