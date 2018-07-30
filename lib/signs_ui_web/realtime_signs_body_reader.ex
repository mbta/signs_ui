defmodule RealtimeSignsBodyReader do
  def read_body(conn, opts) do
    {:ok, body, conn} = Plug.Conn.read_body(conn, opts)

    body_params =
      body
      |> String.split("&")
      |> Enum.reduce(%{}, fn arg, acc ->
        [name, value] = String.split(arg, "=")

        case acc[name] do
          nil -> Map.put(acc, name, [value])
          _ -> Map.put(acc, name, [value | acc[name]])
        end
      end)
      |> Plug.Conn.Query.encode()

    {:ok, body_params, conn}
  end
end
