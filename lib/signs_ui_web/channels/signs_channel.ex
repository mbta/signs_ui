defmodule SignsUiWeb.SignsChannel do
  @moduledoc """
  Channel for configuring signs.
  """

  use Phoenix.Channel
  alias SignsUi.Config.Sign
  import SignsUiWeb.SocketAuth

  def join("signs:all", _message, socket) do
    {:ok, socket}
  end

  @spec handle_in(String.t(), %{Sign.id() => map()}, any()) :: {:noreply, Phoenix.Socket.t()}
  def handle_in("changeSigns", changes, socket) do
    with_admin_access(socket, fn ->
      new_signs = Map.new(changes, fn {id, config} -> {id, Sign.from_json(id, config)} end)

      {:ok, _new_state} = SignsUi.Config.update_sign_configs(new_signs)
      entry = Map.values(changes) |> List.first(%{})

      Utilities.Common.log(
        "sign_changed",
        user: Guardian.Phoenix.Socket.current_resource(socket),
        sign_id:
          case Map.keys(changes) do
            [id] -> id
            _ -> nil
          end,
        mode: entry["mode"],
        expires: entry["expires"],
        line1: entry["line1"] && inspect(entry["line1"]),
        line2: entry["line2"] && inspect(entry["line2"]),
        changes: inspect(changes)
      )
    end)
  end

  intercept(["sign_update"])

  def handle_out("sign_update", msg, socket) do
    if socket_access_level(socket) in [:admin, :read_only] do
      push(socket, "sign_update", msg)
      {:noreply, socket}
    else
      {:stop, :normal, send_auth_expired_message(socket)}
    end
  end
end
