defmodule SignsUiWeb.MessagesController do
  use SignsUiWeb, :controller

  alias SignsUi.Signs.Messages

  def index(conn, _params) do
    messages = Messages.list_messages()
    render(conn, "index.html", messages: messages, token: get_csrf_token())
  end

  def create(conn, params) do
    case Messages.add_message(params) do
      {:ok, messages} ->
        render(conn, :index, messages: messages, token: get_csrf_token())
      {:error, _} ->
        render(conn, "index.html", messages: [], token: get_csrf_token())
    end
  end
end
