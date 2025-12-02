defmodule SignsUi.Application do
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the PubSub system
      {Phoenix.PubSub, name: SignsUi.PubSub},
      SignsUiWeb.Endpoint,
      SignsUi.Config.State,
      SignsUi.Config.Writer,
      {SignsUi.Signs.State, [name: SignsUi.Signs.State]},
      SignsUi.Config.Expiration,
      {SignsUi.Alerts.State, [name: SignsUi.Alerts.State]}
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
end
