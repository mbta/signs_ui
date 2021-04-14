defmodule SignsUi.Alerts.AlertTest do
  use ExUnit.Case, async: true

  alias SignsUi.Alerts.Alert

  describe "JSON encoding" do
    test "Serializes correctly" do
      dt = DateTime.new!(~D[2021-04-10], ~T[09:30:00], "America/New_York")
      alert = %Alert{id: "id", service_effect: "effect", created_at: dt}

      encoded = Jason.encode!(alert)

      assert encoded =~ ~s["created_at":"2021-04-10T09:30:00-04:00"]
      assert encoded =~ ~s["id":"id"]
      assert encoded =~ ~s["service_effect":"effect"]
    end
  end
end
