import Config

config :signs_ui, SignsUiWeb.Endpoint,
  secret_key_base: Map.fetch!(System.get_env(), "SECRET_KEY_BASE")
