defmodule SignsUiWeb.AuthManager do
  use Guardian, otp_app: :signs_ui

  @type t :: String.t()

  @signs_ui_group "signs-ui-admin"

  def subject_for_token(resource, _claims) do
    {:ok, resource}
  end

  def resource_from_claims(%{"sub" => username}) do
    {:ok, username}
  end

  def resource_from_claims(_), do: {:error, :invalid_claims}

  @spec claims_grant_signs_access?(Guardian.Token.claims()) :: boolean()
  def claims_grant_signs_access?(%{"groups" => groups}) do
    not is_nil(groups) and @signs_ui_group in groups
  end

  def claims_grant_signs_access?(_claims) do
    false
  end
end
