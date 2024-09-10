import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :signs_ui, SignsUiWeb.Endpoint,
  http: [port: 4001],
  server: false

config :signs_ui,
  config_store: SignsUi.Mock.ConfigStore,
  messages_api_keys: "test_user_1:test_key_1,test_user_2:test_key_2",
  alert_producer: SignsUi.Mock.FakeAlertProducer,
  alert_consumer_opts: [name: SignsUi.Alerts.State, subscribe_to: []]

config :signs_ui, SignsUiWeb.AuthManager,
  issuer: "signs_ui",
  secret_key: "test key"

config :ueberauth, Ueberauth,
  providers: [
    keycloak: {SignsUi.Ueberauth.Strategy.Fake, [roles: []]}
  ]

config :ueberauth_oidcc,
  providers: [
    keycloak: [
      issuer: :keycloak_issuer,
      client_id: "test-client",
      client_secret: "fake-secret"
    ]
  ]

# Print only warnings, errors, and info during test
config :logger, level: :info
