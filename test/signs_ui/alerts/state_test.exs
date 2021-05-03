defmodule SignsUi.Alerts.StateTest do
  use ExUnit.Case, async: true
  use SignsUiWeb.ChannelCase

  describe "start_link" do
    test "GenServer runs without crashing" do
      @endpoint.subscribe("signs:all")

      {:ok, _pid} = SignsUi.Alerts.State.start_link(interval_ms: 50)

      assert_broadcast("new_alert_state", %{})
    end
  end

  describe "handle_call :active_alert_ids" do
    test "returns the alert_ids out of the state" do
      state = %SignsUi.Alerts.State{
        alerts: %{
          "Red" => %{
            "alert_id1" => %{},
            "alert_id2" => %{}
          },
          "Blue" => %{
            "alert_id3" => %{}
          }
        }
      }

      assert SignsUi.Alerts.State.handle_call(:active_alert_ids, self(), state) ==
               {:reply, MapSet.new(["alert_id1", "alert_id2", "alert_id3"]), state}
    end

    test "safely returns an empty map set if there are no alerts" do
      state = %SignsUi.Alerts.State{alerts: %{}}

      assert SignsUi.Alerts.State.handle_call(:active_alert_ids, self(), state) ==
               {:reply, MapSet.new([]), state}
    end
  end

  describe "handle_info" do
    test "handles unknown messages without crashing" do
      {:ok, pid} = SignsUi.Alerts.State.start_link()
      Process.monitor(pid)
      send(pid, :unknown!)
      refute_receive {:DOWN, _, _, ^pid, _}
    end
  end

  # to be removed, once the real implementation is in:
  describe "handle_info(:twiddle_state)" do
    test "rolls randomly both code paths, and works without crashing" do
      state =
        Enum.reduce(0..20, %SignsUi.Alerts.State{}, fn _, state ->
          {:noreply, new_state} = SignsUi.Alerts.State.handle_info(:twiddle_state, state)
          new_state
        end)

      assert %{alerts: %{}} = state
    end
  end

  describe "active_alert_ids/0" do
    test "returns a result without crashing" do
      {:ok, pid} = SignsUi.Alerts.State.start_link(name: :alerts_state_ids_test)
      assert SignsUi.Alerts.State.active_alert_ids(pid) == MapSet.new([])
    end
  end
end
