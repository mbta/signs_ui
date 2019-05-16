use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :signs_ui, SignsUiWeb.Endpoint,
  http: [port: 4001],
  server: false

config :signs_ui,
  signs_external_post_mod: SignsUI.Mock.Write,
  local_write_path: "test/mock_write.json",
  aws_requestor: SignsUI.Mock.AwsRequest,
  realtime_signs_api_key: "placeholder_key"

# Print only warnings, errors, and info during test
config :logger, level: :info
