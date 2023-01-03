defmodule RealtimeSignsBodyReader do
  @moduledoc """
  Plug override to read the body of the POSTs from realtime-signs.
  Required because the ARINC syntax allows repeated params (e.g.,
  multiple commands, c="..."&c="..."), and the default parser
  overwrites previous ones with new ones. This changes it to
  c[]="..."&c[]="...", so that the default parser reads them correctly
  into a list.
  """
  def read_body(conn, opts) do
    {:ok, body, conn} = Plug.Conn.read_body(conn, opts)

    body_params =
      body
      |> String.split("&")
      |> Enum.map_join("&", fn
        "c=" <> rest -> "c[]=" <> rest
        value -> value
      end)

    {:ok, body_params, conn}
  end
end
