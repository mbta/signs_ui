defmodule SignsUiWeb.MessagesController do
  require Logger
  use SignsUiWeb, :controller

  alias SignsUi.Signs.State
  alias SignsUi.Messages.SignContent

  @spec index(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def index(conn, _params) do
    signs = State.list_signs()

    sign_configs =
      SignsUi.Config.State.get_all()
      |> Enum.map(fn {_id, sign} ->
        {sign.id, sign.config}
      end)
      |> Enum.into(%{})

    render(conn, "index.html", signs: signs, sign_configs: sign_configs)
  end

  @spec create(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def create(conn, %{"MsgType" => "SignContent", "c" => commands, "sta" => station} = _params) do
    Enum.each(commands, fn command_string ->
      with {:ok, sign_content} <- SignContent.new(station, command_string),
           :ok <- State.process_message(sign_content) do
        :ok
      else
        _err ->
          Logger.warn("could_not_process command #{inspect(command_string)}")
      end
    end)

    send_resp(conn, 201, "")
  end

  def create(conn, _params) do
    send_resp(conn, 201, "Ignoring unknown message.")
  end
end
