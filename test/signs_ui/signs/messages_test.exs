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

  test "receives a message with a ' and does not truncate everything before it" do
    {:ok, pid} = SignsUi.Signs.Messages.start_link()

    SignsUi.Signs.Messages.add_message(pid, %{
      "MsgType" => "SignContent",
      "c" => ["e130~n2-\"Alewife 12' min\""],
      "sta" => "RDTC",
      "uid" => "616722"
    })

    assert %{"RDTC-n" => [%{duration: _, text: ""}, %{duration: _, text: "Alewife 12' min"}]} =
             SignsUi.Signs.Messages.list_messages(pid)
  end

  test "when it recieves a second line for a sign, both lines are persisted" do
    {:ok, pid} = SignsUi.Signs.Messages.start_link()

    SignsUi.Signs.Messages.add_message(pid, %{
      "MsgType" => "SignContent",
      "c" => ["e130~n2-\"Alewife 12 min\""],
      "sta" => "RDTC",
      "uid" => "616722"
    })

    SignsUi.Signs.Messages.add_message(pid, %{
      "MsgType" => "SignContent",
      "c" => ["e130~n1-\"Alewife 4 min\""],
      "sta" => "RDTC",
      "uid" => "616722"
    })

    assert %{
             "RDTC-n" => [
               %{duration: _, text: "Alewife 4 min"},
               %{duration: _, text: "Alewife 12 min"}
             ]
           } = SignsUi.Signs.Messages.list_messages(pid)
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

  test "when we send a stopped stops away message, only sends the n-stops part" do
    {:ok, pid} = SignsUi.Signs.Messages.start_link()

    SignsUi.Signs.Messages.add_message(pid, %{
      "MsgType" => "SignContent",
      "c" => ["e130~n2-\"Alewife away\".4-\"Alewife stopped\".4-\"Alewife 4 stops\".4"],
      "sta" => "RDTC",
      "uid" => "616722"
    })

    assert %{"RDTC-n" => [%{duration: _, text: ""}, %{duration: _, text: "Alewife 4 stops"}]} =
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
