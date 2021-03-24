defmodule SignsUiWeb.ErrorController do
  use SignsUiWeb, :controller

  def five_hundred(conn, _params) do
    send_resp(conn, 500, "")
  end

  def raise(_conn, _params) do
    raise "Boom!"
  end
end
