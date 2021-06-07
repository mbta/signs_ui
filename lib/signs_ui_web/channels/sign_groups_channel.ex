defmodule SignsUiWeb.SignGroupsChannel do
  @moduledoc """
  Channel for changing sign groups.
  """
  use Phoenix.Channel
  require Logger
  import SignsUiWeb.SocketAuth

  @impl Phoenix.Channel
  def join("signGroups:all", _message, socket) do
    {:ok, socket}
  end

  @impl Phoenix.Channel
  def handle_in("changeSignGroups", %{"route" => route, "data" => data} = changes, socket) do
    data = changes["data"]
    [time | _] = Map.keys(data)
    line1 = data[time]["line1"]
    line2 = data[time]["line2"]
    expires = data[time]["expires"]
    alert_id = data[time]["alert_id"]
    sign_ids = data[time]["sign_ids"]

    changes = Map.new(
      sign_ids, fn sign_id -> {
        sign_id, %{
          id: sign_id,
          config: %{
            mode: :static_text,
            line1: line1,
            line2: line2,
            expires: expires,
            alert_id: alert_id
          }
        }
      }
    end)

    Logger.info(["changeSignGroups: ", inspect(changes), ", from: ", inspect(socket)])
    {:noreply, socket}
  end
end
