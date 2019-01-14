defmodule SignsUiWeb.MessagesController do
  use SignsUiWeb, :controller

  alias SignsUi.Signs.Messages

  def index(conn, _params) do
    messages = Messages.list_messages()

    enabled_signs =
      SignsUI.Signs.State.get_all()
      |> Enum.map(fn {_id, sign} ->
        {sign.id, sign.enabled?}
      end)
      |> Enum.into(%{})

    render(conn, "index.html", messages: messages, enabled_signs: enabled_signs)
  end

  def create(conn, params) do
    case Messages.add_message(params) do
      {:ok, _messages} ->
        send_resp(conn, 201, "")

      {:error, _} ->
        send_resp(conn, 400, "")
    end
  end
end
