defmodule RealtimeSignsBodyReader do
  def read_body(conn, opts) do
    {:ok, body, conn} = Plug.Conn.read_body(conn, opts)

    body_params =
      body
      |> String.split("&")
      |> Enum.map(fn
        "c=" <> rest -> "c[]=" <> rest
        value -> value
      end)
      |> Enum.join("&")

    {:ok, body_params, conn}
  end
end
