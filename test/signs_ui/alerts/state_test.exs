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
end