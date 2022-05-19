defmodule SignsUiWeb.SingleSignChannel do
  @moduledoc """
  Channel for sending sign updates for specific sign zones.
  """
  use Phoenix.Channel

  def join("sign:" <> _sign_id, _message, socket) do
    {:ok, socket}
  end
end
