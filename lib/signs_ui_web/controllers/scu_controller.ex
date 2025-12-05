defmodule SignsUiWeb.ScuController do
  use SignsUiWeb, :controller

  def index(conn, _params) do
    scus =
      SignsUi.Config.State.get_all().scus_migrated
      |> Enum.sort_by(&elem(&1, 0))

    conn
    |> put_layout(html: {SignsUiWeb.Layouts, :scu})
    |> render(scus: scus)
  end

  def update(conn, %{"migrated" => migrated, "scu_id" => scu_id}) do
    value =
      case migrated do
        "true" -> true
        _ -> false
      end

    SignsUi.Config.State.update_scu(scu_id, value)
    redirect(conn, to: "/scu")
  end
end
