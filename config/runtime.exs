import Config

config :signs_ui, SignsUiWeb.Endpoint,
  screenplay_base_url: "https://screenplay-dev.mbtace.com/"

if config_env() == :prod do
  config :signs_ui, SignsUiWeb.Endpoint,
    secret_key_base: Map.fetch!(System.get_env(), "SECRET_KEY_BASE"),
    screenplay_base_url: "https://screenplay.mbta.com/"
end
