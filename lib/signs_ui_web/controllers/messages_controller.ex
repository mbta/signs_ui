defmodule SignsUiWeb.MessagesController do
  use SignsUiWeb, :controller

  alias SignsUi.Signs.Messages

  @spec index(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def index(conn, _params) do
    messages = Messages.list_messages()

    sign_configs =
      SignsUI.Signs.State.get_all()
      |> Enum.map(fn {_id, sign} ->
        {sign.id, sign.config}
      end)
      |> Enum.into(%{})

    render(conn, "index.html", messages: messages, sign_configs: sign_configs)
  end

  @spec create(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def create(conn, params) do
    case Messages.add_message(params) do
      {:ok, _messages} ->
        send_resp(conn, 201, "")

      {:error, _} ->
        send_resp(conn, 400, "")
    end
  end
end
