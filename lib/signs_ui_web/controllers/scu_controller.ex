defmodule SignsUiWeb.ScuController do
  use SignsUiWeb, :controller

  def index(conn, _params) do
    scus =
      SignsUi.Config.State.get_all().scus_migrated
      |> Enum.sort_by(&elem(&1, 0))

    render(conn, "index.html", layout: {SignsUiWeb.LayoutView, "scu.html"}, scus: scus)
  end

  def update(conn, %{"migrated" => migrated, "scu_id" => scu_id}) do
    case Guardian.Plug.current_claims(conn) |> SignsUiWeb.AuthManager.claims_access_level() do
      :admin ->
        value =
          case migrated do
            "true" -> true
            _ -> false
          end

        SignsUi.Config.State.update_scu(scu_id, value)
        redirect(conn, to: "/scu")

      _ ->
        send_resp(conn, 403, "Admin only")
    end
  end
end
