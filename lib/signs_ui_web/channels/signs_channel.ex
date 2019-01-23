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

    {:ok, _new_state} = SignsUI.Signs.State.update_some(new_signs)

    Logger.info("Sign toggled: #{inspect(changes)}")

    {:noreply, socket}
  end
end
