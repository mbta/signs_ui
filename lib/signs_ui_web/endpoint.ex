defmodule SignsUiWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :signs_ui

  socket("/socket", SignsUiWeb.UserSocket, websocket: [check_origin: false])

  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phoenix.digest
  # when deploying your static files in production.
  plug(
    Plug.Static,
    at: "/",
    from: :signs_ui,
    gzip: false,
    only: ~w(css fonts images js favicon.ico robots.txt vendor)
  )

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    socket("/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket)
    plug(Phoenix.LiveReloader)
    plug(Phoenix.CodeReloader)
  end

  plug(Plug.Logger)

  plug(
    Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    body_reader: {RealtimeSignsBodyReader, :read_body, []},
    json_decoder: Jason
  )

  plug(Plug.MethodOverride)
  plug(Plug.Head)

  # The session will be stored in the cookie and signed,
  # this means its contents can be read but not tampered with.
  # Set :encryption_salt if you would also like to encrypt it.
  plug(
    Plug.Session,
    store: :cookie,
    key: "_signs_ui_key",
    signing_salt: "c9V8gXpr"
  )

  plug(SignsUiWeb.Router)

  @doc """
  Callback invoked for dynamically configuring the endpoint.

  It receives the endpoint configuration and checks if
  configuration should be loaded from the system environment.
  """
  def init(_key, config) do
    if config[:load_from_system_env] do
      port = System.get_env("PORT") || raise "expected the PORT environment variable to be set"

      signs_ui_host =
        System.get_env("SIGNS_UI_HOST") ||
          raise "expected the SIGNS_UI_HOST environment variable to be set"

      {:ok,
       config
       |> Keyword.put(:http, [:inet6, port: port])
       |> put_in([:url, :host], signs_ui_host)}
    else
      {:ok, config}
    end
  end
end
