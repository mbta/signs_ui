defmodule SignsUiWeb.CognitoController do
  use SignsUiWeb, :controller
  require Logger

  def index(conn, %{"code" => code, "state" => state}) do
    expected_state =
      conn
      |> fetch_session()
      |> get_session("cognito_state")

    challenge_code = "123456"
    # conn
    # |> fetch_session()
    # |> get_session("challenge_code")

    if state == expected_state do
      http_fetcher = Application.get_env(:signs_ui, :http_fetcher)
      client_id = Application.get_env(:signs_ui, :cognito_client_id)
      auth = Base.encode64(client_id <> ":rcgu863jgeqongtsalqcm7p3r5a8rgv4ahrtr5n7lcrpentsq8c")

      params = %{
        grant_type: "authorization_code",
        code: code,
        client_id: client_id,
        redirect_uri: "http://localhost:4000/cognito",
        code_verifier: Base.url_encode64(challenge_code, padding: false)
      }

      {:ok, %{body: body}} =
        http_fetcher.post(
          "https://mbta-signs-dev.auth.us-east-1.amazoncognito.com/oauth2/token",
          URI.encode_query(params),
          [
            {"content-type", "application/x-www-form-urlencoded"},
            {"authorization", "Basic #{auth}"}
          ]
        )

      body = Poison.decode!(body) |> IO.inspect()

      %{"id_token" => id_token} = body

      [header_raw, payload_raw, signature_raw] = String.split(id_token, ".")

      Base.url_decode64!(header_raw, padding: false) |> Poison.decode!() |> IO.inspect()

      Base.url_decode64!(payload_raw, padding: false) |> Poison.decode!() |> IO.inspect()

      Base.url_decode64!(signature_raw, padding: false) |> IO.inspect()

      # start with $ iex -S mix run to use:
      # require IEx
      # IEx.pry()

      send_resp(conn, 200, "cognito OK")
    else
      Logger.warn("state=#{state} expected_state=#{expected_state}")
      send_resp(conn, 400, "unexpected state")
    end
  end

  def index(conn, _) do
    Logger.info("cognito no_code")
    send_resp(conn, 400, "no cognito code")
  end

  def new(conn, _) do
    state = "#{:rand.uniform(10_000_000)}"
    challenge_code = "123456"

    params = %{
      response_type: "code",
      client_id: Application.get_env(:signs_ui, :cognito_client_id),
      redirect_uri: "http://localhost:4000/cognito",
      state: state,
      scope: "openid profile email",
      code_challenge: :crypto.hash(:sha256, challenge_code) |> Base.url_encode64(padding: false),
      code_challenge_method: "S256"
    }

    url =
      "https://mbta-signs-dev.auth.us-east-1.amazoncognito.com/oauth2/authorize?" <>
        URI.encode_query(params)

    conn
    |> fetch_session()
    |> put_session("cognito_state", state)
    |> put_session("challenge_code", challenge_code)
    |> redirect(external: url)
  end
end
