defmodule SignsUi.Alerts.StateTest do
  use ExUnit.Case, async: true
  use SignsUiWeb.ChannelCase
  alias ServerSentEventStage.Event
  import Test.Support.AlertEvents
  alias SignsUi.Alerts.State

  defp clear_state(), do: %Event{data: "[]", event: "reset"}

  describe "start_link" do
    test "GenServer runs without crashing" do
      @endpoint.subscribe("signs:all")

      {:ok, pid} = SignsUi.Alerts.State.start_link()

      {:ok, producer} = GenStage.from_enumerable([clear_state()])

      GenStage.sync_subscribe(pid, to: producer)

      assert_broadcast("new_alert_state", %{}, 300)
    end
  end

  describe "handle_call :active_alert_ids" do
    test "returns the alert_ids out of the state" do
      state = %{
        "alert_id1" => %{affected_routes: MapSet.new(["Red"])},
        "alert_id2" => %{affected_routes: MapSet.new(["Red"])},
        "alert_id3" => %{affected_routes: MapSet.new(["Blue"])}
      }

      assert SignsUi.Alerts.State.handle_call(:active_alert_ids, self(), state) ==
               {:reply, MapSet.new(["alert_id1", "alert_id2", "alert_id3"]), [], state}
    end

    test "safely returns an empty map set if there are no alerts" do
      state = %{}

      assert SignsUi.Alerts.State.handle_call(:active_alert_ids, self(), state) ==
               {:reply, MapSet.new(), [], state}
    end
  end

  describe "handle_info" do
    test "handles unknown messages without crashing" do
      {:ok, pid} = SignsUi.Alerts.State.start_link(name: :unknown_messages)
      Process.monitor(pid)
      send(pid, :unknown!)
      refute_receive {:DOWN, _, _, ^pid, _}
    end
  end

  describe "handle_events" do
    test "handles a reset" do
      expected = %{
        "Blue" => %{
          "126976" => %SignsUi.Alerts.Alert{
            created_at: ~U[2021-05-05 00:41:37Z],
            id: "126976",
            service_effect: "Blue Line delay"
          }
        }
      }

      @endpoint.subscribe("signs:all")

      {:ok, pid} = SignsUi.Alerts.State.start_link()

      {:ok, producer} = GenStage.from_enumerable([initial_state()])

      GenStage.sync_subscribe(pid, to: producer)

      assert_broadcast("new_alert_state", expected, 500)
    end

    test "handles an add" do
      expected = %{
        "Blue" => %{
          "126976" => %SignsUi.Alerts.Alert{
            created_at: ~U[2021-05-05 00:41:37Z],
            id: "126976",
            service_effect: "Blue Line delay"
          }
        },
        "Orange" => %{
          "126977" => %SignsUi.Alerts.Alert{
            created_at: ~U[2021-05-05 00:43:09Z],
            id: "126977",
            service_effect: "Orange Line and Red Line delay"
          }
        },
        "Red" => %{
          "126977" => %SignsUi.Alerts.Alert{
            created_at: ~U[2021-05-05 00:43:09Z],
            id: "126977",
            service_effect: "Orange Line and Red Line delay"
          }
        }
      }

      @endpoint.subscribe("signs:all")

      {:ok, pid} = SignsUi.Alerts.State.start_link()

      {:ok, producer} = GenStage.from_enumerable([initial_state(), add_red_orange()])

      GenStage.sync_subscribe(pid, to: producer)

      assert_broadcast("new_alert_state", expected, 500)
    end

    test "handles an update" do
      expected = %{
        "Blue" => %{
          "126976" => %SignsUi.Alerts.Alert{
            created_at: ~U[2021-05-05 00:41:37Z],
            id: "126976",
            service_effect: "Blue Line delay"
          }
        },
        "Red" => %{
          "126977" => %SignsUi.Alerts.Alert{
            created_at: ~U[2021-05-05 00:43:09Z],
            id: "126977",
            service_effect: "Orange Line and Red Line delay"
          }
        }
      }

      @endpoint.subscribe("signs:all")

      {:ok, pid} = SignsUi.Alerts.State.start_link()

      {:ok, producer} =
        GenStage.from_enumerable([
          initial_state(),
          add_red_orange(),
          update_red_orange()
        ])

      GenStage.sync_subscribe(pid, to: producer)

      assert_broadcast("new_alert_state", expected, 500)
    end

    test "handles a removal" do
      expected = %{
        "Blue" => %{
          "126976" => %SignsUi.Alerts.Alert{
            created_at: ~U[2021-05-05 00:41:37Z],
            id: "126976",
            service_effect: "Blue Line delay"
          }
        }
      }

      @endpoint.subscribe("signs:all")

      {:ok, pid} = SignsUi.Alerts.State.start_link()

      {:ok, producer} =
        GenStage.from_enumerable([
          initial_state(),
          add_red_orange(),
          update_red_orange(),
          remove_red()
        ])

      GenStage.sync_subscribe(pid, to: producer)

      assert_broadcast("new_alert_state", expected, 500)
    end

    test "handles two removals" do
      expected = %{}

      @endpoint.subscribe("signs:all")

      {:ok, pid} = SignsUi.Alerts.State.start_link()

      {:ok, producer} =
        GenStage.from_enumerable([
          initial_state(),
          add_red_orange(),
          update_red_orange(),
          remove_red(),
          remove_blue()
        ])

      GenStage.sync_subscribe(pid, to: producer)

      assert_broadcast("new_alert_state", %{}, 500)
    end
  end

  describe "active_alert_ids/0" do
    test "returns a result without crashing" do
      {:ok, pid} = SignsUi.Alerts.State.start_link(name: :alerts_state_ids_test)
      assert SignsUi.Alerts.State.active_alert_ids(pid) == MapSet.new()
    end
  end
end
