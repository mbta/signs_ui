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

  pipeline :auth do
    plug(SignsUiWeb.AuthManager.Pipeline)
  end

  pipeline :ensure_auth do
    plug(Guardian.Plug.EnsureAuthenticated)
  end

  scope "/auth", SignsUiWeb do
    pipe_through([:redirect_prod_http, :browser])

    get("/:provider", AuthController, :request)
    get("/:provider/callback", AuthController, :callback)
  end

  scope "/", SignsUiWeb do
    pipe_through([:redirect_prod_http, :browser, :auth])

    get("/", PageController, :index)
  end

  scope "/", SignsUiWeb do
    pipe_through([:redirect_prod_http, :browser, :auth, :ensure_auth])

    get("/viewer", MessagesController, :index)
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
    token = Guardian.Plug.current_token(conn)
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
end
