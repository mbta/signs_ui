defmodule SignsUiWeb.AuthManager do
  @moduledoc false

  use Guardian, otp_app: :signs_ui

  @type t :: String.t()
  @type access_level :: :none | :read_only | :admin

  @signs_ui_admin_group "signs-ui-admin"

  def subject_for_token(resource, _claims) do
    {:ok, resource}
  end

  def resource_from_claims(%{"sub" => username}) do
    {:ok, username}
  end

  def resource_from_claims(_), do: {:error, :invalid_claims}

  @spec claims_access_level(Guardian.Token.claims()) :: access_level()
  def claims_access_level(%{"roles" => roles}) when not is_nil(roles) do
    if @signs_ui_admin_group in roles do
      :admin
    else
      :read_only
    end
  end

  def claims_access_level(_claims) do
    :none
  end
end
