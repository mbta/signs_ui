import Config

config :signs_ui, SignsUiWeb.Endpoint, cache_static_manifest: "priv/static/cache_manifest.json"

config :signs_ui, :redirect_http?, true

# Do not print debug messages in production
config :logger, level: :info

config :ueberauth, Ueberauth,
  providers: [
    keycloak:
      {Ueberauth.Strategy.Oidcc, userinfo: true, uid_field: "email", scopes: ~w(openid email)}
  ]
