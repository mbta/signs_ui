defmodule SignsUiWeb.SingleSignController do
  require Logger
  use SignsUiWeb, :controller

  alias SignsUi.Signs.State

  def index(conn, %{"station_code" => station_code, "zone" => zone} = _params) do
    sign_id = station_code <> "-" <> zone
    sign = State.get_single_sign(sign_id)

    [policy] = get_resp_header(conn, "content-security-policy")

    conn
    |> put_resp_header(
      "content-security-policy",
      policy <>
        " frame-ancestors #{:signs_ui |> Application.get_env(SignsUiWeb.Endpoint) |> Keyword.get(:screenplay_base_url)};"
    )
    |> render("single_sign.html", layout: {SignsUiWeb.LayoutView, "single_sign.html"}, sign: sign)
  end
end
