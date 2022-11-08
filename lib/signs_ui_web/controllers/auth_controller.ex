defmodule SignsUiWeb.AuthController do
  use SignsUiWeb, :controller
  plug(Ueberauth)
  require Logger

  @spec callback(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    username = auth.uid
    expiration = auth.credentials.expires_at
    credentials = conn.assigns.ueberauth_auth.credentials

    current_time = System.system_time(:second)

    if credentials.refresh_token do
      refresh_token_store = Application.get_env(:signs_ui, :refresh_token_store)
      refresh_token_store.put_refresh_token(username, credentials.refresh_token)
    end

    conn
    |> Guardian.Plug.sign_in(
      SignsUiWeb.AuthManager,
      username,
      %{groups: credentials.other[:groups]},
      ttl: {expiration - current_time, :seconds}
    )
    |> Plug.Conn.put_session(:signs_ui_username, username)
    |> redirect(to: SignsUiWeb.Router.Helpers.messages_path(conn, :index))
  end

  def callback(
        %{assigns: %{ueberauth_failure: %Ueberauth.Failure{errors: errors}}} = conn,
        _params
      ) do
    Logger.error("ueberauth_failure #{inspect(errors)}")

    cond do
      error?(errors, "refresh_token_failure") ->
        refresh_token_store = Application.get_env(:signs_ui, :refresh_token_store)

        conn
        |> Plug.Conn.fetch_session()
        |> Plug.Conn.get_session(:signs_ui_username)
        |> refresh_token_store.clear_refresh_token()

        reauthenticate(conn)

      error?(errors, "bad_state") ->
        reauthenticate(conn)

      true ->
        send_resp(conn, 403, "unauthenticated")
    end
  end

  @spec initiate_logout(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def initiate_logout(conn, params) do
    refresh_token_store = Application.get_env(:signs_ui, :refresh_token_store)

    conn
    |> Plug.Conn.fetch_session()
    |> Plug.Conn.get_session(:signs_ui_username)
    |> refresh_token_store.clear_refresh_token()

    redirect_url = logout_redirect_url_for_provider(conn, params["provider"])

    conn
    |> Guardian.Plug.sign_out(SignsUiWeb.AuthManager)
    |> redirect(external: redirect_url)
  end

  @spec logout(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def logout(conn, _params) do
    conn
    |> Guardian.Plug.sign_out(SignsUiWeb.AuthManager)
    |> redirect(to: SignsUiWeb.Router.Helpers.page_path(conn, :index))
  end

  @spec error?([Ueberauth.Failure.t(), ...], String.t()) :: boolean
  defp error?(errors, key) do
    Enum.any?(errors, fn e -> e.message_key == key end)
  end

  @spec reauthenticate(Plug.Conn.t()) :: Plug.Conn.t()
  defp reauthenticate(conn) do
    Phoenix.Controller.redirect(
      conn,
      to: SignsUiWeb.Router.Helpers.auth_path(conn, :request, "cognito")
    )
  end

  @spec logout_redirect_url_for_provider(Plug.Conn.t(), String.t()) :: String.t()
  defp logout_redirect_url_for_provider(conn, "cognito") do
    auth_domain =
      :ueberauth
      |> Application.get_env(Ueberauth.Strategy.Cognito)
      |> Keyword.get(:auth_domain)
      |> config_value

    redirect_params =
      URI.encode_query(%{
        "client_id" =>
          :ueberauth
          |> Application.get_env(Ueberauth.Strategy.Cognito)
          |> Keyword.get(:client_id)
          |> config_value,
        "logout_uri" => SignsUiWeb.Router.Helpers.auth_url(conn, :logout, "cognito")
      })

    "https://#{auth_domain}/logout?" <> redirect_params
  end

  @spec config_value(binary() | {module(), atom(), [any()]}) :: any()
  defp config_value(value) when is_binary(value), do: value
  defp config_value({m, f, a}), do: apply(m, f, a)
end
