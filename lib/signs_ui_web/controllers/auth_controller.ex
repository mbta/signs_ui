defmodule SignsUiWeb.AuthController do
  use SignsUiWeb, :controller
  plug(Ueberauth)
  require Logger

  alias Plug.Conn

  @spec callback(Conn.t(), map()) :: Conn.t()
  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    username = auth.uid
    expiration = auth.credentials.expires_at
    credentials = conn.assigns.ueberauth_auth.credentials

    current_time = System.system_time(:second)

    keycloak_client_id =
      get_in(Application.get_env(:ueberauth_oidcc, :providers), [:keycloak, :client_id])

    roles =
      get_in(auth.extra.raw_info.userinfo, ["resource_access", keycloak_client_id, "roles"]) || []

    if credentials.refresh_token do
      refresh_token_store = Application.get_env(:signs_ui, :refresh_token_store)
      refresh_token_store.put_refresh_token(username, credentials.refresh_token)
    end

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

    cond do
      error?(errors, "refresh_token_failure") ->
        refresh_token_cleanup(conn)

        reauthenticate(conn)

      error?(errors, "bad_state") ->
        reauthenticate(conn)

      true ->
        send_resp(conn, 403, "unauthenticated")
    end
  end

  @spec logout(Conn.t(), map()) :: Conn.t()
  def logout(conn, _params) do
    refresh_token_cleanup(conn)

    conn
    |> Guardian.Plug.sign_out(SignsUiWeb.AuthManager)
    |> Conn.clear_session()
    |> redirect(to: SignsUiWeb.Router.Helpers.page_path(conn, :index))
  end

  defp refresh_token_cleanup(conn) do
    refresh_token_store = Application.get_env(:signs_ui, :refresh_token_store)

    conn
    |> Conn.fetch_session()
    |> Conn.get_session(:signs_ui_username)
    |> refresh_token_store.clear_refresh_token()
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
