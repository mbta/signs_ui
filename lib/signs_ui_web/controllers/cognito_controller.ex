defmodule SignsUiWeb.CognitoController do
  use SignsUiWeb, :controller
  require Logger

  def index(conn, %{"code" => code}) do
    Logger.info("cognito code=#{code}")

    redirect(conn, to: "/")
  end

  def index(conn, _) do
    Logger.info("cognito no_code")
    send_resp(conn, 400, "no cognito code")
  end

  def new(conn, _) do
    redirect(
      conn,
      external:
        "https://mbta-signs-dev.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=#{
          Application.get_env(:signs_ui, :cognito_client_id)
        }&redirect_uri=http://localhost:4000/cognito"
    )
  end
end
