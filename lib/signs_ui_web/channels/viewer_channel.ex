defmodule SignsUiWeb.ViewerChannel do
  use Phoenix.Channel

  def join("viewer:all", _message, socket) do
    {:ok, socket}
  end
end
