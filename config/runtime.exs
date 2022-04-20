import Config

config :signs_ui, SignsUiWeb.Endpoint, secret_key_base: System.fetch_env!("SECRET_KEY_BASE")
