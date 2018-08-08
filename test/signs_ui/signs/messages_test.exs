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

    assert %{"RDTC-n" => [%{duration: _, text: ""}, %{duration: _, text: "Alewife 12 min"}]} =
             SignsUi.Signs.Messages.list_messages(pid)
  end

  test "when the message has multiple dashes it doesnt crash" do
    {:ok, pid} = SignsUi.Signs.Messages.start_link()

    SignsUi.Signs.Messages.add_message(pid, %{
      "MsgType" => "SignContent",
      "c" => ["e130~n2-\"Alewife 12 min\".4-\"Braintre 4 min\""],
      "sta" => "RDTC",
      "uid" => "616722"
    })

    assert %{"RDTC-n" => [%{duration: _, text: ""}, %{duration: _, text: "Alewife 12 min"}]} =
             SignsUi.Signs.Messages.list_messages(pid)
  end

  test "when the message has a blank string for the sign, it does not crash" do
    {:ok, pid} = SignsUi.Signs.Messages.start_link()

    SignsUi.Signs.Messages.add_message(pid, %{
      "MsgType" => "SignContent",
      "c" => ["e130~n2-"],
      "sta" => "RDTC",
      "uid" => "616722"
    })

    assert %{"RDTC-n" => [%{duration: _, text: ""}, %{duration: _, text: ""}]} =
             SignsUi.Signs.Messages.list_messages(pid)
  end
end
