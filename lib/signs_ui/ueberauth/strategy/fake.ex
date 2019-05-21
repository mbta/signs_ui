defmodule SignsUi.Ueberauth.Strategy.Fake do
  use Ueberauth.Strategy

  def handle_request!(conn) do
    conn
    |> redirect!("/auth/cognito/callback")
    |> halt()
  end

  def handle_callback!(conn) do
    conn
  end

  def uid(_conn) do
    "fake_uid"
  end

  def credentials(_conn) do
    %Ueberauth.Auth.Credentials{
      token: "fake_access_token",
      refresh_token: "fake_refresh_token",
      expires: true,
      expires_at: System.system_time(:seconds) + 60 * 60
    }
  end

  def info(_conn) do
    %Ueberauth.Auth.Info{}
  end

  def extra(_conn) do
    %Ueberauth.Auth.Extra{raw_info: %{}}
  end

  def handle_cleanup!(conn) do
    conn
  end
end
