defmodule SignsUiWeb.SignGroupsChannelTest do
  use SignsUiWeb.ChannelCase
  import ExUnit.CaptureLog

  setup do
    socket = subscribe_and_join!(socket(), SignsUiWeb.SignGroupsChannel, "signGroups:all", %{})
    %{socket: socket}
  end

  describe "handle_in/3" do
    test "logs changeSignGroups events to console", %{socket: socket} do
      changes = %{change: "some_change"}

      log =
        capture_log([level: :info], fn ->
          assert {:noreply, ^socket} =
                   SignsUiWeb.SignGroupsChannel.handle_in("changeSignGroups", changes, socket)
        end)

      assert log =~ "changeSignGroups: %{change: \"some_change\"}"
    end
  end
end
