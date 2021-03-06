defmodule SignsUiWeb.Plugs.ApiAuth do
  @moduledoc "Authenticates API requests using a set of keys defined in the environment."

  import Plug.Conn
  require Logger

  def init(opts), do: opts

  def call(conn, _opts) do
    with [key] <- get_req_header(conn, "x-api-key"),
         user when not is_nil(user) <- Map.get(keys(), key) do
      Logger.metadata(messages_api_user: user)
      conn
    else
      _ -> conn |> send_resp(401, "unauthorized") |> halt()
    end
  end

  defp keys do
    :signs_ui
    |> Application.get_env(:messages_api_keys)
    |> String.split(",")
    |> Stream.map(&String.split(&1, ":"))
    |> Stream.map(fn [user, key] -> {key, user} end)
    |> Enum.into(%{})
  end
end
