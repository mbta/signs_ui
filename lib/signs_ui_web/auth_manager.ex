defmodule SignsUiWeb.AuthManager do
  @moduledoc false

  use Guardian, otp_app: :signs_ui

  @type t :: String.t()
  @type access_level :: :none | :read_only | :admin

  @signs_ui_read_only_group "signs-ui-read-only"
  @signs_ui_admin_group "signs-ui-admin"

  def subject_for_token(resource, _claims) do
    {:ok, resource}
  end

  def resource_from_claims(%{"sub" => username}) do
    {:ok, username}
  end

  def resource_from_claims(_), do: {:error, :invalid_claims}

  @spec claims_access_level(Guardian.Token.claims()) :: access_level()
  def claims_access_level(%{"groups" => groups}) do
    cond do
      is_nil(groups) -> :none
      @signs_ui_read_only_group in groups -> :read_only
      @signs_ui_admin_group in groups -> :admin
      true -> :none
    end
  end

  def claims_access_level(_claims) do
    :none
  end
end
