defmodule SignsUiWeb.Router do
  use SignsUiWeb, :router

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_flash)
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
    plug(:put_user_token)
  end

  pipeline :api do
    plug(:accepts, ["json"])
    plug(:api_auth)
  end

  pipeline :redirect_prod_http do
    if Application.get_env(:signs_ui, :redirect_http?) do
      plug(Plug.SSL, rewrite_on: [:x_forwarded_proto])
    end
  end

  scope "/", SignsUiWeb do
    pipe_through([:redirect_prod_http, :browser, :cognito_auth])

    get("/", PageController, :index)
    get("/viewer", MessagesController, :index)
  end

  scope "/", SignsUiWeb do
    resources("/cognito", CognitoController, only: [:index, :new])
  end

  scope "/", SignsUiWeb do
    get("/_health", HealthController, :index)
  end

  scope "/", SignsUiWeb do
    pipe_through([:api])
    post("/messages", MessagesController, :create)
  end

  # Other scopes may use custom stacks.
  # scope "/api", SignsUiWeb do
  #   pipe_through :api
  # end

  defp put_user_token(conn, _) do
    token = Phoenix.Token.sign(conn, "user socket", "admin")
    assign(conn, :user_token, token)
  end

  defp api_auth(conn, _) do
    secret_key = Application.get_env(:signs_ui, :realtime_signs_api_key)

    case get_req_header(conn, "x-api-key") do
      [^secret_key] ->
        conn

      _ ->
        conn
        |> send_resp(401, "unauthorized")
        |> halt()
    end
  end

  @spec cognito_auth(Plug.Conn.t(), Plug.opts()) :: Plug.Conn.t()
  defp cognito_auth(conn, _) do
    conn = fetch_session(conn)
    login_expiration = get_session(conn, :login_expiration)

    current_time = DateTime.utc_now() |> DateTime.to_unix()

    if is_nil(login_expiration) or current_time >= login_expiration do
      conn
      |> redirect(to: SignsUiWeb.Router.Helpers.cognito_path(conn, :new))
      |> halt()
    else
      conn
    end
  end
end
