defmodule SignsUi.Alerts.StateTest do
  alias SignsUi.Alerts.Display
  use ExUnit.Case, async: true
  use SignsUiWeb.ChannelCase

  @initial_state %{
    "201759" => %{
      id: "201759",
      created_at: ~U[2025-02-27 20:27:22Z],
      service_effect: "Green Line E branch shuttle",
      affected_routes: MapSet.new(["Green-E"])
    },
    "201803" => %{
      id: "201803",
      created_at: ~U[2025-03-05 20:19:22Z],
      service_effect: "Single tracking on Blue Line",
      affected_routes: MapSet.new(["Blue"])
    }
  }

  setup do
    on_exit(fn ->
      SignsUi.V3ApiStub.reset()
    end)

    table = :ets.new(:alerts_test, read_concurrency: true)
    :ets.insert(table, {:value, @initial_state})
    %{table: table}
  end

  describe "active_alert_ids/0" do
    test "returns correct values", %{table: table} do
      assert SignsUi.Alerts.State.active_alert_ids(table) ==
               MapSet.new(["201759", "201803"])
    end
  end

  describe ":update" do
    test "does not update alerts state on empty response", %{table: table} do
      {:noreply, _} =
        SignsUi.Alerts.State.handle_info(:update, %{table: table, last_modified: nil})

      assert SignsUi.Alerts.State.active_alert_ids(table) ==
               MapSet.new(["201759", "201803"])
    end

    test "updates alerts state when something is returned", %{table: table} do
      SignsUi.V3ApiStub.will_return([
        %{
          "id" => "123456",
          "attributes" => %{
            "created_at" => "2025-03-06T12:00:00Z",
            "service_effect" => "Red Line Delay",
            "informed_entity" => [
              %{"route" => "Red", "route_type" => 1}
            ]
          }
        }
      ])

      @endpoint.subscribe("alerts:all")

      {:noreply, _} =
        SignsUi.Alerts.State.handle_info(:update, %{table: table, last_modified: nil})

      expected =
        %{
          "123456" => %{
            id: "123456",
            affected_routes: MapSet.new(["Red"]),
            created_at: ~U[2025-03-06 12:00:00Z],
            service_effect: "Red Line Delay"
          }
        }
        |> Display.format_state()

      assert_broadcast "new_alert_state", ^expected, 500
    end
  end
end
