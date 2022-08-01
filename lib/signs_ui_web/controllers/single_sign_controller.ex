defmodule SignsUiWeb.SingleSignController do
  require Logger
  use SignsUiWeb, :controller

  alias SignsUi.Signs.State

  def index(conn, %{"station_code" => station_code, "zone" => zone} = _params) do
    sign_id = station_code <> "-" <> zone
    sign = State.get_single_sign(sign_id)

    conn
    |> put_layout("single_sign.html")
    |> put_resp_header(
      "Content-Security-Policy",
      "frame-ancestors #{
        Application.fetch_env!(:signs_ui, SignsUiWeb.Endpoint)
        |> Keyword.get(:screenplay_base_url)
      };"
    )
    |> render("single_sign.html", sign: sign)
  end
end
