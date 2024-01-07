import Config

if config_env() == :prod do
  config :signs_ui, SignsUiWeb.Endpoint,
    secret_key_base: Map.fetch!(System.get_env(), "SECRET_KEY_BASE")
end


screenplay_base_url =
  if System.get_env("ENVIRONMENT_NAME") == "prod",
    do: "https://screenplay.mbta.com/",
    else: "localhost:4000/ https://screenplay-dev.mbtace.com/ https://screenplay-dev-green.mbtace.com/"

config :signs_ui, SignsUiWeb.Endpoint,
    screenplay_base_url: screenplay_base_url
