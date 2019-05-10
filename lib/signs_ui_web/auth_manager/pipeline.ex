defmodule SignsUiWeb.AuthManager.Pipeline do
  use Guardian.Plug.Pipeline,
    otp_app: :signs_ui,
    error_handler: SignsUiWeb.AuthManager.ErrorHandler,
    module: SignsUiWeb.AuthManager

  plug(Guardian.Plug.VerifySession, claims: %{"typ" => "access"})
  plug(Guardian.Plug.VerifyHeader, claims: %{"typ" => "access"})
  plug(Guardian.Plug.LoadResource, allow_blank: true)
end
