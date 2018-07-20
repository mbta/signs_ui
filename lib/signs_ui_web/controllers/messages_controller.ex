defmodule SignsUiWeb.MessagesController do
  use SignsUiWeb, :controller

  alias SignsUi.Signs.Messages

  def index(conn, _params) do
    messages = Messages.list_messages()
    render(conn, "index.html", messages: messages)
  end

  def create(conn, params) do
    case Messages.add_message(params) do
      {:ok, messages} ->
        send_resp(conn, 201, "")
      {:error, _} ->
        send_resp(conn, 400, "")
    end
  end
end
