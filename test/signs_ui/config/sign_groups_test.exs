defmodule SignsUi.Config.SignGroupsTest do
  use ExUnit.Case
  alias SignsUi.Config.SignGroup
  alias SignsUi.Config.SignGroups

  describe "active/3" do
    test "removes sign groups with inactive alerts" do
      sign_groups = %{
        "Red" => %{
          "5555" => %SignGroup{},
          "1234" => %SignGroup{alert_id: "active_alert"},
          "5678" => %SignGroup{alert_id: "inactive_alert"},
          "55534" => %SignGroup{expires: DateTime.new!(~D[2021-05-21], ~T[17:35:00])}
        }
      }

      {active, expired} =
        SignGroups.active(
          sign_groups,
          DateTime.new!(~D[2021-05-21], ~T[17:32:30]),
          MapSet.new(["active_alert"])
        )

      assert active == %{
               "Red" => %{
                 "5555" => %SignGroup{},
                 "1234" => %SignGroup{alert_id: "active_alert"},
                 "55534" => %SignGroup{expires: DateTime.new!(~D[2021-05-21], ~T[17:35:00])}
               }
             }

      assert expired == [%SignGroup{alert_id: "inactive_alert"}]
    end

    test "removes sign groups that expired in the past" do
      sign_groups = %{
        "Red" => %{
          "5555" => %SignGroup{},
          "1234" => %SignGroup{alert_id: "active_alert"},
          "55534" => %SignGroup{expires: DateTime.new!(~D[2021-05-21], ~T[17:35:00])},
          "34334" => %SignGroup{expires: DateTime.new!(~D[2021-05-21], ~T[17:30:00])}
        }
      }

      {active, expired} =
        SignGroups.active(
          sign_groups,
          DateTime.new!(~D[2021-05-21], ~T[17:32:30]),
          MapSet.new(["active_alert"])
        )

      assert active == %{
               "Red" => %{
                 "5555" => %SignGroup{},
                 "1234" => %SignGroup{alert_id: "active_alert"},
                 "55534" => %SignGroup{expires: DateTime.new!(~D[2021-05-21], ~T[17:35:00])}
               }
             }

      assert expired == [%SignGroup{expires: DateTime.new!(~D[2021-05-21], ~T[17:30:00])}]
    end
  end
end
