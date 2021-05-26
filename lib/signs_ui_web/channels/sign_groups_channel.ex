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
  @spec handle_in(<<_::128>>, any, Phoenix.Socket.t()) ::
          {:noreply, Phoenix.Socket.t()} | {:stop, :normal, Phoenix.Socket.t()}
  def handle_in("changeSignGroups", changes, socket) do

    with_admin_access(socket, fn ->
      new_signs = ""

      {:ok, _new_state} = SignsUi.Config.State.update_sign_group_changes(new_signs)

      username = Guardian.Phoenix.Socket.current_resource(socket)

      Logger.info(
        ["changeSignGroups: ", inspect(changes), ", from: ", inspect(socket)]
      )
    end)

  end
end
