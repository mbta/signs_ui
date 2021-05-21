defmodule SignsUi.Config.SignGroupsTest do
  use ExUnit.Case
  alias SignsUi.Config.SignGroup
  alias SignsUi.Config.SignGroups

  describe "active/3" do
    test "only returns sign groups that are not expired" do
      sign_groups = %{
        "Red" => %{
          "5555" => %SignGroup{},
          "1234" => %SignGroup{alert_id: "active_alert"},
          "5678" => %SignGroup{alert_id: "inactive_alert"},
          "55534" => %SignGroup{expires: DateTime.new!(~D[2021-05-21], ~T[17:35:00])},
          "34334" => %SignGroup{expires: DateTime.new!(~D[2021-05-21], ~T[17:30:00])}
        },
        "Blue" => %{
          "5555" => %SignGroup{},
          "1234" => %SignGroup{alert_id: "active_alert"},
          "5678" => %SignGroup{alert_id: "inactive_alert"},
          "55534" => %SignGroup{expires: DateTime.new!(~D[2021-05-21], ~T[17:35:00])},
          "34334" => %SignGroup{expires: DateTime.new!(~D[2021-05-21], ~T[17:30:00])}
        },
        "Orange" => %{
          "5555" => %SignGroup{},
          "1234" => %SignGroup{alert_id: "active_alert"},
          "5678" => %SignGroup{alert_id: "inactive_alert"},
          "55534" => %SignGroup{expires: DateTime.new!(~D[2021-05-21], ~T[17:35:00])},
          "34334" => %SignGroup{expires: DateTime.new!(~D[2021-05-21], ~T[17:30:00])}
        },
        "Green" => %{
          "5555" => %SignGroup{},
          "1234" => %SignGroup{alert_id: "active_alert"},
          "5678" => %SignGroup{alert_id: "inactive_alert"},
          "55534" => %SignGroup{expires: DateTime.new!(~D[2021-05-21], ~T[17:35:00])},
          "34334" => %SignGroup{expires: DateTime.new!(~D[2021-05-21], ~T[17:30:00])}
        },
        "Mattapan" => %{
          "5555" => %SignGroup{},
          "1234" => %SignGroup{alert_id: "active_alert"},
          "5678" => %SignGroup{alert_id: "inactive_alert"},
          "55534" => %SignGroup{expires: DateTime.new!(~D[2021-05-21], ~T[17:35:00])},
          "34334" => %SignGroup{expires: DateTime.new!(~D[2021-05-21], ~T[17:30:00])}
        }
      }

      assert SignGroups.active(
               sign_groups,
               DateTime.new!(~D[2021-05-21], ~T[17:32:30]),
               MapSet.new(["active_alert"])
             ) == %{
               "Blue" => %{
                 "1234" => %SignsUi.Config.SignGroup{
                   alert_id: "active_alert",
                   expires: nil,
                   line1: nil,
                   line2: nil,
                   sign_ids: []
                 },
                 "55534" => %SignsUi.Config.SignGroup{
                   alert_id: nil,
                   expires: ~U[2021-05-21 17:35:00Z],
                   line1: nil,
                   line2: nil,
                   sign_ids: []
                 },
                 "5555" => %SignsUi.Config.SignGroup{
                   alert_id: nil,
                   expires: nil,
                   line1: nil,
                   line2: nil,
                   sign_ids: []
                 }
               },
               "Green" => %{
                 "1234" => %SignsUi.Config.SignGroup{
                   alert_id: "active_alert",
                   expires: nil,
                   line1: nil,
                   line2: nil,
                   sign_ids: []
                 },
                 "55534" => %SignsUi.Config.SignGroup{
                   alert_id: nil,
                   expires: ~U[2021-05-21 17:35:00Z],
                   line1: nil,
                   line2: nil,
                   sign_ids: []
                 },
                 "5555" => %SignsUi.Config.SignGroup{
                   alert_id: nil,
                   expires: nil,
                   line1: nil,
                   line2: nil,
                   sign_ids: []
                 }
               },
               "Mattapan" => %{
                 "1234" => %SignsUi.Config.SignGroup{
                   alert_id: "active_alert",
                   expires: nil,
                   line1: nil,
                   line2: nil,
                   sign_ids: []
                 },
                 "55534" => %SignsUi.Config.SignGroup{
                   alert_id: nil,
                   expires: ~U[2021-05-21 17:35:00Z],
                   line1: nil,
                   line2: nil,
                   sign_ids: []
                 },
                 "5555" => %SignsUi.Config.SignGroup{
                   alert_id: nil,
                   expires: nil,
                   line1: nil,
                   line2: nil,
                   sign_ids: []
                 }
               },
               "Orange" => %{
                 "1234" => %SignsUi.Config.SignGroup{
                   alert_id: "active_alert",
                   expires: nil,
                   line1: nil,
                   line2: nil,
                   sign_ids: []
                 },
                 "55534" => %SignsUi.Config.SignGroup{
                   alert_id: nil,
                   expires: ~U[2021-05-21 17:35:00Z],
                   line1: nil,
                   line2: nil,
                   sign_ids: []
                 },
                 "5555" => %SignsUi.Config.SignGroup{
                   alert_id: nil,
                   expires: nil,
                   line1: nil,
                   line2: nil,
                   sign_ids: []
                 }
               },
               "Red" => %{
                 "1234" => %SignsUi.Config.SignGroup{
                   alert_id: "active_alert",
                   expires: nil,
                   line1: nil,
                   line2: nil,
                   sign_ids: []
                 },
                 "55534" => %SignsUi.Config.SignGroup{
                   alert_id: nil,
                   expires: ~U[2021-05-21 17:35:00Z],
                   line1: nil,
                   line2: nil,
                   sign_ids: []
                 },
                 "5555" => %SignsUi.Config.SignGroup{
                   alert_id: nil,
                   expires: nil,
                   line1: nil,
                   line2: nil,
                   sign_ids: []
                 }
               }
             }
    end
  end
end
