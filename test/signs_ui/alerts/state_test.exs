defmodule SignsUi.Alerts.StateTest do
  alias SignsUi.Alerts.Display
  use ExUnit.Case, async: true
  use ExUnit.Case
  use SignsUiWeb.ChannelCase

  setup do
    on_exit(fn ->
      SignsUi.V3ApiStub.reset()
    end)

    :ok
  end

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

  describe "handle_call :active_alert_ids" do
    test "returns the alert_ids out of the state" do
      state = %{
        "alert_id1" => %{affected_routes: MapSet.new(["Red"])},
        "alert_id2" => %{affected_routes: MapSet.new(["Red"])},
        "alert_id3" => %{affected_routes: MapSet.new(["Blue"])}
      }

      assert SignsUi.Alerts.State.handle_call(:active_alert_ids, self(), state) ==
               {:reply, MapSet.new(["alert_id1", "alert_id2", "alert_id3"]), state}
    end

    test "safely returns an empty map set if there are no alerts" do
      state = %{}

      assert SignsUi.Alerts.State.handle_call(:active_alert_ids, self(), state) ==
               {:reply, MapSet.new(), state}
    end
  end

  describe "active_alert_ids/0" do
    test "returns a result without crashing" do
      assert SignsUi.Alerts.State.handle_call(:active_alert_ids, self(), @initial_state) ==
               {:reply, MapSet.new(["201759", "201803"]), @initial_state}
    end
  end

  describe "fetch_alerts/0" do
    test "does not update alerts state on empty response" do
      {:noreply, new_state} = SignsUi.Alerts.State.handle_info(:update, @initial_state)

      assert new_state == @initial_state
    end

    test "updates alerts state when something is returned" do
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

      {:noreply, new_state} = SignsUi.Alerts.State.handle_info(:update, @initial_state)

      assert new_state == %{
               "123456" => %{
                 id: "123456",
                 affected_routes: MapSet.new(["Red"]),
                 created_at: ~U[2025-03-06 12:00:00Z],
                 service_effect: "Red Line Delay"
               }
             }

      expected = Display.format_state(new_state)

      assert_broadcast("new_alert_state", expected, 500)
    end
  end
end
