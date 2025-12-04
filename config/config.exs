import Config

# Configures the endpoint
config :signs_ui, SignsUiWeb.Endpoint,
  url: [host: "localhost"],
  http: [port: 4000],
  secret_key_base: "local_secret_key_base_at_least_64_bytes_________________________________",
  render_errors: [view: SignsUiWeb.ErrorView, accepts: ~w(html json)],
  pubsub_server: SignsUi.PubSub,
  server: true

# Internal configuration
config :signs_ui,
  config_store: SignsUi.Config.S3,
  v3_api: SignsUi.V3Api

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
    keycloak: {SignsUi.Ueberauth.Strategy.Fake, []}
  ]

config :ueberauth_oidcc,
  providers: [
    keycloak: [
      issuer: :keycloak_issuer,
      client_id: "dev-client",
      client_secret: "fake-secret"
    ]
  ]

config :phoenix, :json_library, Jason

config :sentry,
  enable_source_code_context: true,
  root_source_code_paths: [File.cwd!()],
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
