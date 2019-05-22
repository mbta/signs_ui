defmodule SignsUiWeb.AuthManager do
  use Guardian, otp_app: :signs_ui

  @type t :: String.t()

  def subject_for_token(resource, _claims) do
    {:ok, resource}
  end

  def resource_from_claims(%{"sub" => username}) do
    {:ok, username}
  end

  def resource_from_claims(_), do: {:error, :invalid_claims}
end
