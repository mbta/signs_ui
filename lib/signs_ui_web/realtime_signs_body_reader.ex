defmodule RealtimeSignsBodyReader do
  def read_body(conn, opts) do
    {:ok, body, conn} = Plug.Conn.read_body(conn, opts)

    body_params =
      body
      |> String.split("&")
      |> Enum.reduce([], fn arg, acc ->
        case String.split(arg, "=") do
          ["c", value] -> ["c[]=#{value}" | acc]
          _ -> [arg | acc]
        end
      end)
      |> Enum.reverse()
      |> Enum.join("&")

    {:ok, body_params, conn}
  end
end
