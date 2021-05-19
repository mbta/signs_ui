defmodule SignsUiWeb.Router do
  use SignsUiWeb, :router

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_flash)
    plug(:protect_from_forgery)

    plug(:put_secure_browser_headers, %{
      "content-security-policy" =>
        "default-src 'self'; connect-src 'self' *.sentry.io; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
    })
  end

  pipeline :api do
    plug(:accepts, ["json"])
    plug(SignsUiWeb.Plugs.ApiAuth)
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

  pipeline :ensure_signs_ui_group do
    plug(SignsUiWeb.EnsureSignsUiGroup)
  end

  scope "/auth", SignsUiWeb do
    pipe_through([:redirect_prod_http, :browser])

    get("/:provider", AuthController, :request)
    get("/:provider/callback", AuthController, :callback)
    get("/:provider/logout", AuthController, :logout)
  end

  scope "/", SignsUiWeb do
    pipe_through([:redirect_prod_http, :browser, :auth])

    get("/", PageController, :index)
    get("/unauthorized", UnauthorizedController, :index)
  end

  scope "/", SignsUiWeb do
    pipe_through([
      :redirect_prod_http,
      :browser,
      :auth,
      :ensure_auth,
      :ensure_signs_ui_group,
      :put_user_token,
      :put_read_only_view
    ])

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

  defp put_read_only_view(conn, _) do
    if conn
       |> Guardian.Plug.current_claims()
       |> SignsUiWeb.AuthManager.claims_access_level() == :read_only do
      assign(conn, :read_only_view, true)
    else
      conn
    end
  end
end
