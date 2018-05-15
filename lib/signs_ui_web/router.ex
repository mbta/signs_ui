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

  scope "/", SignsUiWeb do
    pipe_through :browser # Use the default browser stack

    get "/", SignsController, :index
    post "/", SignsController, :update
  end

  # Other scopes may use custom stacks.
  # scope "/api", SignsUiWeb do
  #   pipe_through :api
  # end
end
