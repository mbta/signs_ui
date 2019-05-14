defmodule SignsUiWeb.AuthController do
  use SignsUiWeb, :controller
  plug(Ueberauth)

  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, params) do
    IO.inspect("======")
    IO.inspect(auth)
    send_resp(conn, 200, "Cognito OK")
  end
end
