# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :signs_ui, SignsUiWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "e53SM3tp0FyeUz+x0VM2u3ZFBNER5Eiiipi9wIPienn66DV8wfCIMMNNB8OxOJE8",
  render_errors: [view: SignsUiWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: SignsUi.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Internal configuration
config :signs_ui,
  signs_external_post_mod: SignsUI.Signs.S3,
  aws_requestor: ExAws

# HTTP config
config :signs_ui, :redirect_http?, false

config :signs_ui,
  api_key: "placeholder_key"

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:user_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
