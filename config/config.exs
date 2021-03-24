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
  signs_external_post_mod: SignsUi.Config.S3,
  aws_requestor: ExAws,
  refresh_token_store: SignsUi.RefreshTokenStore

# HTTP config
config :signs_ui, :redirect_http?, false

config :signs_ui, SignsUiWeb.AuthManager, secret_key: {System, :get_env, ["SIGNS_UI_AUTH_SECRET"]}

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:messages_api_user, :user_id]

config :logger,
  backends: [:console, Sentry.LoggerBackend]

config :ueberauth, Ueberauth,
  providers: [
    cognito: {SignsUi.Ueberauth.Strategy.Fake, []}
  ]

config :phoenix, :json_library, Jason

config :sentry,
  enable_source_code_context: true,
  root_source_code_path: [File.cwd!()],
  included_environments: ~w(dev prod),
  in_app_module_allow_list: [SignsUi, SignsUiWeb]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
