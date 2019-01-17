defmodule SignsUi.Application do
  use Application

  alias SignsUi.Utilities.Config

  def start(_type, _args) do
    set_runtime_config()

    children = [
      %{
        id: SignsUiWeb.Endpoint,
        start: {SignsUiWeb.Endpoint, :start_link, []},
        type: :supervisor
      },
      %{
        id: SignsUI.Signs.State,
        start: {SignsUI.Signs.State, :start_link, []}
      },
      %{
        id: SignsUi.Signs.Messages,
        start: {SignsUi.Signs.Messages, :start_link, [[name: SignsUi.Signs.Messages]]}
      },
      %{
        id: SignsUI.Signs.Expiration,
        start: {SignsUI.Signs.Expiration, :start_link, []}
      }
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
  end
end
