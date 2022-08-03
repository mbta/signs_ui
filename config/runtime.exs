import Config

if config_env() == :prod do
  config :signs_ui, SignsUiWeb.Endpoint,
    secret_key_base: Map.fetch!(System.get_env(), "SECRET_KEY_BASE")
end


if System.get_env("ENVIRONMENT_NAME") == "prod" do
  config :signs_ui, SignsUiWeb.Endpoint,
    screenplay_base_url: "https://screenplay.mbta.com/"
else
  config :signs_ui, SignsUiWeb.Endpoint,
    screenplay_base_url: "localhost:4000/ https://screenplay-dev.mbtace.com/"
end
