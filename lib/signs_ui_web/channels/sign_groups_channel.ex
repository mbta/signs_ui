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
    Logger.info(["changeSignGroups: ", inspect(changes), ", from: ", inspect(socket)])

    data = changes["data"]
    [time | _] = Map.keys(data)
    line1 = data[time]["line1"]
    line2 = data[time]["line2"]
    expires = data[time]["expires"]
    alert_id = data[time]["alert_id"]
    sign_ids = data[time]["sign_ids"]

    IO.puts("line1 = #{line1}")
    IO.puts("line2 = #{line2}")
    IO.puts("expires = #{expires}")
    IO.puts("alert_id = #{alert_id}")
    IO.puts("sign_ids\n#{sign_ids}")

    #for sign_id <- sign_ids, do: changes = Map.put(changes, sign_id, %{
    #  id: sign_id,
    #  config: %{
    #    mode: :static_text,
    #    line1: line1,
    #    line2: line2,
    #    expires: expires,
    #    alert_id: alert_id
    #  }
    #})

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

    #changes = Map.put(changes, "test", "VALUE")


    IO.puts("CHANGES HAVE BEEN MADE\n#{inspect(changes)}")

    Logger.info(["changeSignGroups: ", inspect(changes), ", from: ", inspect(socket)])
    {:noreply, socket}
  end
end
