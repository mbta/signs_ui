defmodule RealtimeSignsBodyReader do
  def read_body(conn, opts) do
    {:ok, body, conn} = Plug.Conn.read_body(conn, opts)

    body_params =
      body
      |> String.split("&")
      |> Enum.reduce(%{}, fn arg, acc ->
        [name, value] = String.split(arg, "=")

        case acc[name] do
          nil -> Map.put(acc, name, value)
          old_val when not is_list(old_val) -> Map.put(acc, name, [value, old_val])
          vals -> Map.put(acc, name, [value | vals])
        end
      end)
      |> paramify()

    {:ok, body_params, conn}
  end

  defp paramify(map) do
    map
    |> Enum.flat_map(fn {key, value} ->
        case value do
          vs when is_list(vs) ->
            Enum.map(vs, fn v ->
              "#{key}[]=#{v}"
            end)

          v ->
            ["#{key}=#{v}"]
        end
      end)
    |> Enum.join("&")
  end
end
