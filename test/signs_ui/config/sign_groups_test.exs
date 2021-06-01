defmodule SignsUi.Config.SignGroupsTest do
  use ExUnit.Case
  alias SignsUi.Config.SignGroup
  alias SignsUi.Config.SignGroups

  describe "active/3" do
    test "removes sign groups with inactive alerts" do
      sign_groups = %{
        "Red" => %{
          "5555" => %SignGroup{route_id: "Red"},
          "1234" => %SignGroup{alert_id: "active_alert", route_id: "Red"},
          "5678" => %SignGroup{alert_id: "inactive_alert", route_id: "Red"},
          "55534" => %SignGroup{
            route_id: "Red",
            expires: DateTime.new!(~D[2021-05-21], ~T[17:35:00])
          }
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
                 "5555" => %SignGroup{route_id: "Red"},
                 "1234" => %SignGroup{alert_id: "active_alert", route_id: "Red"},
                 "55534" => %SignGroup{
                   route_id: "Red",
                   expires: DateTime.new!(~D[2021-05-21], ~T[17:35:00])
                 }
               }
             }

      assert expired == [%SignGroup{alert_id: "inactive_alert", route_id: "Red"}]
    end

    test "removes sign groups that expired in the past" do
      sign_groups = %{
        "Red" => %{
          "5555" => %SignGroup{route_id: "Red"},
          "1234" => %SignGroup{alert_id: "active_alert", route_id: "Red"},
          "55534" => %SignGroup{
            route_id: "Red",
            expires: DateTime.new!(~D[2021-05-21], ~T[17:35:00])
          },
          "34334" => %SignGroup{
            route_id: "Red",
            expires: DateTime.new!(~D[2021-05-21], ~T[17:30:00])
          }
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
                 "5555" => %SignGroup{route_id: "Red"},
                 "1234" => %SignGroup{alert_id: "active_alert", route_id: "Red"},
                 "55534" => %SignGroup{
                   route_id: "Red",
                   expires: DateTime.new!(~D[2021-05-21], ~T[17:35:00])
                 }
               }
             }

      assert expired == [
               %SignGroup{expires: DateTime.new!(~D[2021-05-21], ~T[17:30:00]), route_id: "Red"}
             ]
    end
  end

  describe "from_json/1" do
    test "converts groups into structs" do
      json = %{
        "Red" => %{
          "1234" => %{
            "sign_ids" => [],
            "route_id" => "Red",
            "expires" => nil,
            "line1" => nil,
            "line2" => nil,
            "alert_id" => nil
          }
        }
      }

      assert SignGroups.from_json(json) == %{
               "Red" => %{
                 "1234" => %SignsUi.Config.SignGroup{route_id: "Red"}
               }
             }
    end
  end
end
