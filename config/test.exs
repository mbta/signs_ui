use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :signs_ui, SignsUiWeb.Endpoint,
  http: [port: 4001],
  server: false

config :signs_ui,
  signs_external_post_mod: SignsUi.Mock.Write,
  local_write_path: "test/mock_write.json",
  aws_requestor: SignsUi.Mock.AwsRequest,
  messages_api_keys: "test_user_1:test_key_1,test_user_2:test_key_2",
  alert_producer: SignsUi.Mock.FakeAlertProducer,
  alert_consumer_opts: [name: SignsUi.Alerts.State, subscribe_to: []]

config :signs_ui, SignsUiWeb.AuthManager,
  issuer: "signs_ui",
  secret_key: "test key"

config :ueberauth, Ueberauth.Strategy.Cognito,
  auth_domain: "test_auth_domain",
  client_id: "test_client_secret"

# Print only warnings, errors, and info during test
config :logger, level: :info
