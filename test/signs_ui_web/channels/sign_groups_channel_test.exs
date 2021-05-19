defmodule SignsUiWeb.SignGroupsChannelTest do
  use SignsUiWeb.ChannelCase
  import ExUnit.CaptureLog

  setup do
    socket = subscribe_and_join!(socket(), SignsUiWeb.SignGroupsChannel, "signGroups:all", %{})
    %{socket: socket}
  end

  describe "handle_in/3" do
    test "logs changeSignGroups events to console", %{socket: socket} do
      changes = %{"route" => "Red", "data" => %{}}

      log =
        capture_log([level: :info], fn ->
          assert {:noreply, ^socket} =
                   SignsUiWeb.SignGroupsChannel.handle_in("changeSignGroups", changes, socket)
        end)

      assert log =~ "changeSignGroups: %{"
      assert log =~ ~s/"route" => "Red"/
      assert log =~ ~s/"data" => %{}/
    end
  end
end
