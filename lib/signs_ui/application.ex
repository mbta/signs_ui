defmodule SignsUi.Application do
  @moduledoc false

  use Application

  alias SignsUi.Utilities.Config

  def start(_type, _args) do
    set_runtime_config()

    children = [
      # Start the PubSub system
      {Phoenix.PubSub, name: SignsUi.PubSub},
      SignsUiWeb.Endpoint,
      SignsUi.Config.State,
      SignsUi.Config.Writer,
      {SignsUi.Signs.State, [name: SignsUi.Signs.State]},
      SignsUi.Config.Expiration,
      {Application.get_env(:signs_ui, :alert_producer),
       name: AlertProducer,
       url:
         "#{System.get_env("API_V3_ORIGIN")}/alerts?filter[datetime]=NOW&filter[route_type]=0,1",
       headers: [
         {"x-api-key", System.get_env("API_V3_KEY")}
       ]},
      {SignsUi.Alerts.State, Application.get_env(:signs_ui, :alert_consumer_opts)}
    ]

    opts = [strategy: :one_for_one, name: SignsUi.Supervisor]
    {:ok, _pid} = Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    SignsUiWeb.Endpoint.config_change(changed, removed)
    :ok
  end

  defp set_runtime_config do
    Config.update_env(:aws_signs_bucket, System.get_env("AWS_SIGNS_BUCKET"))
    Config.update_env(:aws_signs_path, System.get_env("AWS_SIGNS_PATH"))
    Config.update_env(:aws_signs_stops_path, System.get_env("AWS_SIGNS_STOPS_PATH"))
    Config.update_env(:messages_api_keys, System.get_env("MESSAGES_API_KEYS"))
    Config.update_env(:sentry, :dsn, System.get_env("SENTRY_DSN"))
    Config.update_env(:sentry, :environment_name, System.get_env("SENTRY_ENV"))
  end
end
