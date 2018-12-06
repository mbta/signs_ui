defmodule SignsUiWeb.SignsChannel do
  use Phoenix.Channel
  require Logger

  def join("signs:all", _message, socket) do
    {:ok, socket}
  end

  @spec handle_in(String.t(), %{SignsUI.Signs.Sign.id() => boolean()}, any()) :: {:noreply, any()}
  def handle_in("changeSigns", changes, socket) do
    {:ok, new_state} = SignsUI.Signs.State.update_some(changes)

    Logger.info("Sign toggled: #{inspect(changes)}")

    broadcast_data =
      new_state
      |> Enum.map(fn {_id, sign} -> {sign.id, sign.enabled?} end)
      |> Enum.into(%{})

    broadcast!(socket, "new_enabled_signs_state", broadcast_data)

    {:noreply, socket}
  end
end
