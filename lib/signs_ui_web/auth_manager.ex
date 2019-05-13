defmodule SignsUiWeb.AuthManager do
  use Guardian, otp_app: :signs_ui

  @type t :: %{
          username: String.t(),
          expiration: integer()
        }

  def subject_for_token(resource, _claims) do
    {:ok, resource.username}
  end

  def resource_from_claims(%{"sub" => username, "exp" => expiration}) do
    {:ok, %{username: username, expiration: expiration}}
  end

  def resource_from_claims(_), do: {:error, :invalid_claims}
end
