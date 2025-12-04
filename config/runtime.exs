import Config

if config_env() != :test do
  config :signs_ui,
    api_v3_url: System.fetch_env!("API_V3_ORIGIN"),
    api_v3_key: System.get_env("API_V3_KEY"),
    messages_api_keys: System.get_env("MESSAGES_API_KEYS", "")

  screenplay_base_url =
    if System.get_env("ENVIRONMENT_NAME") == "prod",
      do: "https://screenplay.mbta.com/",
      else:
        "localhost:4000/ https://screenplay-dev.mbtace.com/ https://screenplay-dev-green.mbtace.com/"

  config :signs_ui, SignsUiWeb.Endpoint,
    screenplay_base_url: screenplay_base_url,
    secret_key_base: System.fetch_env!("SECRET_KEY_BASE")
end

if config_env() == :prod do
  config :signs_ui,
    aws_signs_bucket: System.fetch_env!("AWS_SIGNS_BUCKET"),
    aws_signs_path: System.fetch_env!("AWS_SIGNS_PATH")

  config :signs_ui, SignsUiWeb.Endpoint,
    url: [host: System.fetch_env!("SIGNS_UI_HOST"), scheme: "https"]

  config :ueberauth_oidcc,
    issuers: [
      %{
        name: :keycloak_issuer,
        issuer: System.fetch_env!("KEYCLOAK_ISSUER")
      }
    ],
    providers: [
      keycloak: [
        issuer: :keycloak_issuer,
        client_id: System.fetch_env!("KEYCLOAK_CLIENT_ID"),
        client_secret: System.fetch_env!("KEYCLOAK_CLIENT_SECRET")
      ]
    ]

  config :sentry,
    dsn: System.fetch_env!("SENTRY_DSN"),
    environment_name: System.fetch_env!("SENTRY_ENV")
end
