import Config

# For development, we disable any cache and enable
# debugging and code reloading.
config :signs_ui, SignsUiWeb.Endpoint,
  http: [port: 5000],
  debug_errors: true,
  code_reloader: true,
  check_origin: false,
  watchers: [
    node: ["build.mjs", "watch", cd: Path.expand("../assets", __DIR__)]
  ],
  screenplay_base_url: "localhost:4000/"

# Watch static and templates for browser reloading.
config :signs_ui, SignsUiWeb.Endpoint,
  live_reload: [
    patterns: [
      ~r{priv/static/.*(js|css|png|jpeg|jpg|gif|svg)$},
      ~r{priv/gettext/.*(po)$},
      ~r{lib/signs_ui_web/views/.*(ex)$},
      ~r{lib/signs_ui_web/templates/.*(eex)$}
    ]
  ]

config :signs_ui,
  config_store: SignsUi.Config.Local

config :signs_ui, SignsUiWeb.AuthManager,
  issuer: "signs_ui",
  secret_key: "test key"

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development. Avoid configuring such
# in production as building large stacktraces may be expensive.
config :phoenix, :stacktrace_depth, 20
