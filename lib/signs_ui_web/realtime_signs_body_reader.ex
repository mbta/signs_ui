defmodule RealtimeSignsBodyReader do
  def read_body(conn, opts) do
    {:ok, body, conn} = Plug.Conn.read_body(conn, opts)
    conn = update_in(conn.assigns[:raw_body], &[body | &1 || []])

    body_params =
      body
      |> String.split("&")
      |> Enum.reduce(%{}, fn arg, acc ->
        [name, value] = String.split(arg, "=")

        case acc[name] do
          nil -> Map.put(acc, name, value)
          _ -> Map.put(acc, "#{name}2", value)
        end
      end)
      |> URI.encode_query()

    {:ok, body_params, conn}
  end
end
