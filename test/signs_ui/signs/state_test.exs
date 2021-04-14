defmodule SignsUi.Signs.StateTest do
  use ExUnit.Case, async: true

  alias SignsUi.Signs.State
  alias SignsUi.Signs.Sign
  alias SignsUi.Signs.SignLine
  alias SignsUi.Messages.SignContent

  test "receives a message and stores the sign in the state" do
    {:ok, pid} = State.start_link()
    now = DateTime.utc_now()
    later = now |> DateTime.add(150)

    msg = %SignContent{
      station: "XYZ",
      zone: "w",
      line_number: 1,
      expiration: later,
      pages: ["Alewife 12 min"]
    }

    State.process_message(pid, msg)

    assert %{
             "XYZ-w" => %{
               sign_id: "XYZ-w",
               lines: %{
                 1 => %{
                   text: [%{content: "Alewife 12 min", duration: 5}],
                   expiration: ^later
                 }
               }
             }
           } = State.list_signs(pid)
  end

  test "receives messages and updates existing state with a new line" do
    state = %{
      "ABCD-w" => %Sign{
        station: "ABCD",
        zone: "w",
        lines: %{
          1 => %SignLine{
            text: [{"Alewife 1 min", 5}],
            expiration: DateTime.utc_now()
          }
        }
      }
    }

    msg = %SignContent{
      station: "ABCD",
      zone: "w",
      line_number: 2,
      expiration: DateTime.utc_now(),
      pages: ["Alewife 8 min"]
    }

    assert {:reply, :ok,
            %{
              "ABCD-w" => %Sign{
                station: "ABCD",
                zone: "w",
                lines: %{
                  1 => %SignLine{text: [{"Alewife 1 min", 5}]},
                  2 => %SignLine{text: [{"Alewife 8 min", 5}]}
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
            expiration: DateTime.utc_now()
          }
        }
      }
    }

    msg = %SignContent{
      station: "ABCD",
      zone: "w",
      line_number: 1,
      expiration: DateTime.utc_now(),
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
