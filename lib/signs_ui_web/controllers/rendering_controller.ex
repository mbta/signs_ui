defmodule SignsUiWeb.RenderingController do
  require Logger
  use SignsUiWeb, :controller

  def render(conn, params) do
    IO.inspect(params)

    send_resp(conn, 200, "hello")
  end
end
