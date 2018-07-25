defmodule SignsUiWeb.SignsChannel do
  use Phoenix.Channel

  def join("signs:all", _message, socket) do
    {:ok, socket}
  end
end
