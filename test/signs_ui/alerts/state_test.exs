defmodule SignsUi.Alerts.StateTest do
  alias SignsUi.Alerts.Display
  use ExUnit.Case, async: true
  use SignsUiWeb.ChannelCase

  @initial_state %{
    "201759" => %{
      id: "201759",
      created_at: ~U[2025-02-27 20:27:22Z],
      service_effect: "Green Line E branch shuttle",
      affected_routes: MapSet.new(["Green-E"]),
      route_types: MapSet.new([0])
    },
    "201803" => %{
      id: "201803",
      created_at: ~U[2025-03-05 20:19:22Z],
      service_effect: "Single tracking on Blue Line",
      affected_routes: MapSet.new(["Blue"]),
      route_types: MapSet.new([1])
    }
  }

  setup do
    on_exit(fn ->
      SignsUi.V3ApiStub.reset()
    end)

    table = :ets.new(:alerts_test, read_concurrency: true)
    :ets.insert(table, {:value, @initial_state})

    initial_green_alert = %{
      "id" => "201759",
      "attributes" => %{
        "created_at" => "2025-02-27 20:27:22Z",
        "service_effect" => "Green Line E branch shuttle",
        "informed_entity" => [
          %{"route" => "Green-E", "route_type" => 0}
        ]
      }
    }

    initial_blue_alert = %{
      "id" => "201803",
      "attributes" => %{
        "created_at" => "2025-03-05 20:19:22Z",
        "service_effect" => "Single tracking on Blue Line",
        "informed_entity" => [
          %{"route" => "Blue", "route_type" => 1}
        ]
      }
    }

    %{
      initial_blue_alert: initial_blue_alert,
      initial_green_alert: initial_green_alert,
      table: table
    }
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

    test "does not filter alerts from state when they do not change", %{
      initial_blue_alert: initial_blue_alert,
      initial_green_alert: initial_green_alert,
      table: table
    } do
      SignsUi.V3ApiStub.will_return([initial_blue_alert, initial_green_alert])

      @endpoint.subscribe("alerts:all")

      {:noreply, _} =
        SignsUi.Alerts.State.handle_info(:update, %{table: table, last_modified: nil})

      expected =
        %{
          "201759" => %{
            id: "201759",
            affected_routes: MapSet.new(["Green-E"]),
            created_at: ~U[2025-02-27 20:27:22Z],
            service_effect: "Green Line E branch shuttle"
          },
          "201803" => %{
            id: "201803",
            affected_routes: MapSet.new(["Blue"]),
            created_at: ~U[2025-03-05 20:19:22Z],
            service_effect: "Single tracking on Blue Line"
          }
        }
        |> Display.format_state()

      assert_broadcast "new_alert_state", ^expected, 500
    end

    test "removes alerts from state when route type changes", %{
      initial_blue_alert: initial_blue_alert,
      initial_green_alert: initial_green_alert,
      table: table
    } do
      SignsUi.V3ApiStub.will_return([
        initial_green_alert,
        update_in(initial_blue_alert, ["attributes", "informed_entity"], fn ies ->
          Enum.map(ies, &%{&1 | "route_type" => 0})
        end)
      ])

      @endpoint.subscribe("alerts:all")

      {:noreply, _} =
        SignsUi.Alerts.State.handle_info(:update, %{table: table, last_modified: nil})

      expected =
        %{
          "201759" => %{
            id: "201759",
            affected_routes: MapSet.new(["Green-E"]),
            created_at: ~U[2025-02-27 20:27:22Z],
            service_effect: "Green Line E branch shuttle"
          }
        }
        |> Display.format_state()

      assert_broadcast "new_alert_state", ^expected, 500
    end

    test "removes alerts from state when service effect changes", %{
      initial_blue_alert: initial_blue_alert,
      initial_green_alert: initial_green_alert,
      table: table
    } do
      SignsUi.V3ApiStub.will_return([
        initial_green_alert,
        update_in(initial_blue_alert, ["attributes", "service_effect"], fn _ ->
          "A New Day, A New Delay"
        end)
      ])

      @endpoint.subscribe("alerts:all")

      {:noreply, _} =
        SignsUi.Alerts.State.handle_info(:update, %{table: table, last_modified: nil})

      expected =
        %{
          "201759" => %{
            id: "201759",
            affected_routes: MapSet.new(["Green-E"]),
            created_at: ~U[2025-02-27 20:27:22Z],
            service_effect: "Green Line E branch shuttle"
          }
        }
        |> Display.format_state()

      assert_broadcast "new_alert_state", ^expected, 500
    end
  end
end
