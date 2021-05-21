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
end
