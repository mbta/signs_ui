defmodule SignsUiWeb.AlertsChannel do
  @moduledoc """
  Channel for updating alerts.
  """
  use Phoenix.Channel

  @impl Phoenix.Channel
  def join("alerts:all", _message, socket) do
    {:ok, socket}
  end
end
