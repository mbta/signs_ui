defmodule SignsUiWeb.SignsChannel do
  use Phoenix.Channel
  require Logger
  alias SignsUI.Signs.Sign

  def join("signs:all", _message, socket) do
    {:ok, socket}
  end

  @spec handle_in(String.t(), %{Sign.id() => map()}, any()) :: {:noreply, Phoenix.Socket.t()}
  def handle_in("changeSigns", changes, socket) do
    new_signs =
      changes
      |> Enum.map(fn {id, config} -> {id, Sign.from_config(id, config)} end)
      |> Enum.into(%{})

    {:ok, new_state} = SignsUI.Signs.State.update_some(new_signs)

    Logger.info("Sign toggled: #{inspect(changes)}")

    broadcast_data =
      new_state
      |> Enum.map(fn {_id, sign} -> {sign.id, sign.config} end)
      |> Enum.into(%{})

    broadcast!(socket, "new_sign_configs_state", broadcast_data)

    {:noreply, socket}
  end
end
