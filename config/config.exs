import Config

# Configures the endpoint
config :signs_ui, SignsUiWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "local_secret_key_base_at_least_64_bytes_________________________________",
  render_errors: [view: SignsUiWeb.ErrorView, accepts: ~w(html json)],
  pubsub_server: SignsUi.PubSub

# Internal configuration
config :signs_ui,
  config_store: SignsUi.Config.S3,
  refresh_token_store: SignsUi.RefreshTokenStore,
  alert_producer: ServerSentEventStage,
  alert_consumer_opts: [
    name: SignsUi.Alerts.State,
    subscribe_to: [AlertProducer]
  ]

# HTTP config
config :signs_ui, :redirect_http?, false

config :signs_ui, SignsUiWeb.AuthManager, secret_key: {System, :get_env, ["SIGNS_UI_AUTH_SECRET"]}

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:messages_api_user, :user_id, :request_id, :remote_ip]

config :logger,
  backends: [:console, Sentry.LoggerBackend]

config :ueberauth, Ueberauth,
  providers: [
    cognito: {SignsUi.Ueberauth.Strategy.Fake, []}
  ]

config :phoenix, :json_library, Jason

config :sentry,
  enable_source_code_context: true,
  root_source_code_paths: [File.cwd!()],
  included_environments: ~w(dev prod),
  in_app_module_allow_list: [SignsUi, SignsUiWeb]

config :elixir, :time_zone_database, Tzdata.TimeZoneDatabase

config :laboratory,
  features: [],
  cookie: [
    # one month,
    max_age: 3600 * 24 * 30,
    http_only: true
  ]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
