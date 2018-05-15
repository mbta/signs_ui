defmodule SignsUi.Application do
  use Application

  alias SignsUi.Utilities.Config

  def start(_type, _args) do
    import Supervisor.Spec

    set_runtime_config()

    # Define workers and child supervisors to be supervised
    children = [
      # Start the endpoint when the application starts
      supervisor(SignsUiWeb.Endpoint, []),
      worker(SignsUI.Signs.State, [[]]),
      # Start your own worker by calling: SignsUi.Worker.start_link(arg1, arg2, arg3)
      # worker(SignsUi.Worker, [arg1, arg2, arg3]),
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: SignsUi.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    SignsUiWeb.Endpoint.config_change(changed, removed)
    :ok
  end

  defp set_runtime_config do
    Config.update_env(:s3_bucket, System.get_env("SIGNS_URL"))
  end
end
