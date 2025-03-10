import Config

if config_env() == :prod do
  config :signs_ui, SignsUiWeb.Endpoint,
    secret_key_base: Map.fetch!(System.get_env(), "SECRET_KEY_BASE")

  keycloak_opts = [
    issuer: :keycloak_issuer,
    client_id: System.fetch_env!("KEYCLOAK_CLIENT_ID"),
    client_secret: System.fetch_env!("KEYCLOAK_CLIENT_SECRET")
  ]

  config :ueberauth_oidcc,
    issuers: [
      %{
        name: :keycloak_issuer,
        issuer: System.fetch_env!("KEYCLOAK_ISSUER")
      }
    ],
    providers: [
      keycloak: keycloak_opts
    ]
end

screenplay_base_url =
  if System.get_env("ENVIRONMENT_NAME") == "prod",
    do: "https://screenplay.mbta.com/",
    else:
      "localhost:4000/ https://screenplay-dev.mbtace.com/ https://screenplay-dev-green.mbtace.com/"

config :signs_ui,
  api_v3_url: System.get_env("API_V3_ORIGIN"),
  api_v3_key: System.get_env("API_V3_KEY")

config :signs_ui, SignsUiWeb.Endpoint, screenplay_base_url: screenplay_base_url
