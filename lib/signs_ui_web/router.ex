defmodule SignsUiWeb.Router do
  use SignsUiWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :basic_auth do
    plug BasicAuth
  end

  pipeline :redirect_prod_http do
    if Application.get_env(:signs_ui, :redirect_http?) do
      plug Plug.SSL, rewrite_on: [:x_forwarded_proto]
    end
  end

  scope "/", SignsUiWeb do
    pipe_through [:redirect_prod_http, :browser, :basic_auth]

    get "/", PageController, :index
    get "/signs", SignsController, :index
    post "/signs", SignsController, :update
    get "/messages", MessagesController, :index
  end

  scope "/", SignsUiWeb do
    pipe_through [:api]
    post "/messages/update", MessagesController, :update
    get "/_health", HealthController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", SignsUiWeb do
  #   pipe_through :api
  # end
end
