defmodule SignsUiWeb.SingleSignController do
  require Logger
  use SignsUiWeb, :controller

  alias SignsUi.Signs.State

  def index(conn, %{"station_code" => station_code, "zone" => zone} = _params) do
    sign_id = station_code <> "-" <> zone
    sign = State.get_single_sign(sign_id)

    conn
    |> put_layout("single_sign.html")
    |> render("single_sign.html", sign: sign)
  end
end
