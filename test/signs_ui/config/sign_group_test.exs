defmodule SignsUi.Config.SignGroupTest do
  use ExUnit.Case
  alias SignsUi.Config.SignGroup

  describe "expired/3" do
    test "does not expire a sign group without an alert or expiration time" do
      assert not SignGroup.expired?(
               %SignGroup{},
               DateTime.new!(~D[2021-05-21], ~T[17:31:00]),
               MapSet.new(["active_alert"])
             )
    end

    test "does not expire a sign group with an active alert id" do
      assert not SignGroup.expired?(
               %SignGroup{alert_id: "active_alert"},
               DateTime.new!(~D[2021-05-21], ~T[17:31:00]),
               MapSet.new(["active_alert"])
             )
    end

    test "does not expire a sign group with future expiration" do
      assert not SignGroup.expired?(
               %SignGroup{expires: DateTime.new!(~D[2021-05-21], ~T[17:35:00])},
               DateTime.new!(~D[2021-05-21], ~T[17:31:00]),
               MapSet.new()
             )
    end

    test "expires a sign group with an inactive alert id" do
      assert SignGroup.expired?(
               %SignGroup{alert_id: "active_alert"},
               DateTime.new!(~D[2021-05-21], ~T[17:31:00]),
               MapSet.new()
             )
    end

    test "expires a sign group with a past expiration" do
      assert SignGroup.expired?(
               %SignGroup{expires: DateTime.new!(~D[2021-05-21], ~T[17:30:00])},
               DateTime.new!(~D[2021-05-21], ~T[17:31:00]),
               MapSet.new()
             )
    end
  end

  describe "from_json/1" do
    test "converts a valid json map into a valid SignGroup struct" do
      json = %{
        "sign_ids" => ["a_sign_id", "another_sign_id"],
        "expires" => "2021-05-15T14:00:00Z",
        "line1" => "foo",
        "line2" => "bar",
        "alert_id" => "active_alert"
      }

      assert SignGroup.from_json(json) == %SignsUi.Config.SignGroup{
               alert_id: "active_alert",
               expires: ~U[2021-05-15 14:00:00Z],
               line1: "foo",
               line2: "bar",
               sign_ids: ["a_sign_id", "another_sign_id"]
             }
    end

    test "converts a garbled DateTime to nil and logs the error" do
      json = %{
        "sign_ids" => ["a_sign_id", "another_sign_id"],
        "expires" => "2021-05-114:00:00Z",
        "line1" => "foo",
        "line2" => "bar",
        "alert_id" => "active_alert"
      }

      assert SignGroup.from_json(json) == %SignsUi.Config.SignGroup{
               alert_id: "active_alert",
               expires: nil,
               line1: "foo",
               line2: "bar",
               sign_ids: ["a_sign_id", "another_sign_id"]
             }
    end
  end
end
