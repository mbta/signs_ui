defmodule SignsUi.Application do
  use Application

  alias SignsUi.Utilities.Config

  def start(_type, _args) do
    set_runtime_config()

    children = [
      SignsUiWeb.Endpoint,
      SignsUI.Signs.State,
      {SignsUi.Signs.Messages, [name: SignsUi.Signs.Messages]},
      SignsUI.Signs.Expiration
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
    Config.update_env(:username, System.get_env("USERNAME"))
    Config.update_env(:password, System.get_env("PASSWORD"))
    Config.update_env(:realtime_signs_api_key, System.get_env("REALTIME_SIGNS_API_KEY"))
    Config.update_env(:cognito_client_id, System.get_env("COGNITO_CLIENT_ID"))
  end
end
