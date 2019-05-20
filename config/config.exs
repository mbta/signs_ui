# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :signs_ui, SignsUiWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "local_secret_key_base_at_least_64_bytes_________________________________",
  render_errors: [view: SignsUiWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: SignsUi.PubSub, adapter: Phoenix.PubSub.PG2]

# Internal configuration
config :signs_ui,
  signs_external_post_mod: SignsUI.Signs.S3,
  aws_requestor: ExAws

# HTTP config
config :signs_ui, :redirect_http?, false

config :signs_ui, SignsUiWeb.AuthManager,
  issuer: "signs_ui",
  secret_key: "test key"

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:user_id]

config :ueberauth, Ueberauth,
  providers: [
    cognito: {Ueberauth.Strategy.Cognito, []}
  ]

config :ueberauth, Ueberauth.Strategy.Cognito,
  auth_domain: {System, :get_env, ["COGNITO_DOMAIN"]},
  client_id: {System, :get_env, ["COGNITO_CLIENT_ID"]},
  client_secret: {System, :get_env, ["COGNITO_CLIENT_SECRET"]},
  user_pool_id: {System, :get_env, ["COGNITO_USER_POOL_ID"]},
  aws_region: {System, :get_env, ["COGNITO_AWS_REGION"]}

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
