defmodule SignsUiWeb.AuthController do
  use SignsUiWeb, :controller
  plug(Ueberauth)
  require Logger

  alias Plug.Conn

  @spec callback(Conn.t(), map()) :: Conn.t()
  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    username = auth.uid
    expiration = auth.credentials.expires_at

    current_time = System.system_time(:second)

    keycloak_client_id =
      get_in(Application.get_env(:ueberauth_oidcc, :providers), [:keycloak, :client_id])

    roles =
      get_in(auth.extra.raw_info.userinfo, ["resource_access", keycloak_client_id, "roles"]) || []

    conn
    |> Guardian.Plug.sign_in(
      SignsUiWeb.AuthManager,
      username,
      %{roles: roles},
      ttl: {expiration - current_time, :seconds}
    )
    |> Conn.put_session(:signs_ui_username, username)
    |> redirect(to: SignsUiWeb.Router.Helpers.messages_path(conn, :index))
  end

  def callback(
        %{assigns: %{ueberauth_failure: %Ueberauth.Failure{errors: errors}}} = conn,
        _params
      ) do
    Logger.error("ueberauth_failure #{inspect(errors)}")

    if error?(errors, "bad_state") do
      reauthenticate(conn)
    else
      send_resp(conn, 403, "unauthenticated")
    end
  end

  @spec logout(Conn.t(), map()) :: Conn.t()
  def logout(conn, _params) do
    conn
    |> Guardian.Plug.sign_out(SignsUiWeb.AuthManager)
    |> Conn.clear_session()
    |> redirect(to: SignsUiWeb.Router.Helpers.page_path(conn, :index))
  end

  @spec error?([Ueberauth.Failure.t(), ...], String.t()) :: boolean
  defp error?(errors, key) do
    Enum.any?(errors, fn e -> e.message_key == key end)
  end

  @spec reauthenticate(Conn.t()) :: Conn.t()
  defp reauthenticate(conn) do
    Phoenix.Controller.redirect(
      conn,
      to: SignsUiWeb.Router.Helpers.auth_path(conn, :request, "keycloak")
    )
  end
end
