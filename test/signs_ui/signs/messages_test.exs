defmodule SignsUi.Signs.MessagesTest do
  use ExUnit.Case

  test "receives a message and stores the sign in the state" do
    {:ok, pid} = SignsUi.Signs.Messages.start_link()

    SignsUi.Signs.Messages.add_message(pid, %{
      "MsgType" => "SignContent",
      "c" => ["e130~n2-\"Alewife 12 min\""],
      "sta" => "RDTC",
      "uid" => "616722"
    })

    assert SignsUi.Signs.Messages.list_messages(pid) == %{"RDTC-n" => ["", "Alewife 12 min"]}
  end
end
