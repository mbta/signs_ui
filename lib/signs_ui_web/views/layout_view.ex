defmodule SignsUiWeb.LayoutView do
  use SignsUiWeb, :view
  @spec record_sentry?() :: boolean()
  def record_sentry? do
    sentry_env = Application.get_env(:sentry, :environment_name)
    sentry_env == "dev" || sentry_env == "prod"
  end
end
