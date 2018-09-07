defmodule SignsUiWeb.SignsChannel do
  use Phoenix.Channel

  def join("signs:all", _message, socket) do
    {:ok, socket}
  end

  @spec handle_in(String.t(), %{SignsUI.Signs.Sign.id() => boolean()}, any()) :: {:noreply, any()}
  def handle_in("changeSigns", changes, socket) do
    :ok = SignsUI.Signs.State.update_some(changes)
    {:noreply, socket}
  end
end
