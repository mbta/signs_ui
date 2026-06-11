defmodule SignsUiWeb.PageController do
  use SignsUiWeb, :controller
  require Logger

  def index(conn, _params) do
    redirect(conn, to: "/viewer")
  end

  def preview_audio(conn, %{"text" => text}) do
    watts_url = Application.fetch_env!(:signs_ui, :watts_url)
    watts_api_key = Application.fetch_env!(:signs_ui, :watts_api_key)

    data =
      Jason.encode!(%{
        text:
          ~s(<speak><amazon:effect name="drc"><prosody rate="90%">#{text}</prosody></amazon:effect></speak>),
        voice_id: "Matthew"
      })

    case HTTPoison.post(
           "#{watts_url}/tts",
           data,
           [{"Content-type", "application/json"}, {"x-api-key", watts_api_key}]
         ) do
      {:ok, %{status_code: 200, body: body}} ->
        send_download(conn, {:binary, body}, filename: "preview.mp3")

      result ->
        Logger.error("error previewing audio: #{inspect(result)}")
        send_resp(conn, 500, "error previewing audio")
    end
  end
end
