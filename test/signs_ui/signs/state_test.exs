defmodule SignsUi.Signs.StateTest do
  use ExUnit.Case, async: true

  alias SignsUi.Signs.State
  alias SignsUi.Signs.Sign
  alias SignsUi.Signs.SignLine
  alias SignsUi.Messages.SignContent

  test "receives a message and stores the sign in the state" do
    {:ok, pid} = State.start_link()
    now = Timex.now()
    later = now |> Timex.shift(seconds: 150)

    msg = %SignContent{
      station: "XYZ",
      zone: "w",
      line_number: 1,
      expiration: later,
      pages: ["Alewife 12 min"]
    }

    State.process_message(pid, msg)

    assert %{
             "XYZ-w" => [
               %{text: "Alewife 12 min", duration: ^later},
               %{text: ""}
             ]
           } = State.list_signs(pid)
  end

  test "receives messages and updates existing state with a new line" do
    state = %{
      "ABCD-w" => %Sign{
        station: "ABCD",
        zone: "w",
        lines: %{
          1 => %SignLine{
            text: "Alewife 1 min",
            expiration: Timex.now()
          }
        }
      }
    }

    msg = %SignContent{
      station: "ABCD",
      zone: "w",
      line_number: 2,
      expiration: Timex.now(),
      pages: ["Alewife 8 min"]
    }

    assert {:reply, :ok,
            %{
              "ABCD-w" => %Sign{
                station: "ABCD",
                zone: "w",
                lines: %{
                  1 => %SignLine{text: "Alewife 1 min"},
                  2 => %SignLine{text: "Alewife 8 min"}
                }
              }
            }} = State.handle_call({:process_message, msg}, self(), state)
  end

  test "receives messages and updates existing state overwriting a line" do
    state = %{
      "ABCD-w" => %Sign{
        station: "ABCD",
        zone: "w",
        lines: %{
          1 => %SignLine{
            text: "Alewife 1 min",
            expiration: Timex.now()
          }
        }
      }
    }

    msg = %SignContent{
      station: "ABCD",
      zone: "w",
      line_number: 1,
      expiration: Timex.now(),
      pages: [{"2 stops", 2}, {"away", 2}, {"Stopped", 5}]
    }

    assert {:reply, :ok,
            %{
              "ABCD-w" => %Sign{
                station: "ABCD",
                zone: "w",
                lines: %{
                  1 => %SignLine{text: [{"2 stops", 2}, {"away", 2}, {"Stopped", 5}]}
                }
              }
            }} = State.handle_call({:process_message, msg}, self(), state)
  end
end
