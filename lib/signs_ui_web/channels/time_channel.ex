defmodule SignsUiWeb.TimeChannel do
  @moduledoc """
  Channel for reporting server time to the browser, so the browser can attempt to compensate for
  clock differences between the two.
  """
  use Phoenix.Channel

  @impl Phoenix.Channel
  def join("time:all", _message, socket) do
    send(self(), :send_time)
    {:ok, socket}
  end

  @impl Phoenix.Channel
  def handle_info(:send_time, socket) do
    push(socket, "current_time", %{value: DateTime.utc_now() |> DateTime.to_unix(:millisecond)})
    {:noreply, socket}
  end
end
