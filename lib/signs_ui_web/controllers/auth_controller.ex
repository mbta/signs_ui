defmodule SignsUiWeb.AuthController do
  use SignsUiWeb, :controller
  plug(Ueberauth)

  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, params) do
    IO.inspect("======")
    IO.inspect(auth)

    user = %{
      username: auth.extra.raw_info["cognito:username"],
      expiration: auth.extra.raw_info["exp"]
    }

    conn
    |> Guardian.Plug.sign_in(SignsUiWeb.AuthManager, user)
    |> redirect(to: SignsUiWeb.Router.Helpers.messages_path(conn, :index))
  end
end
