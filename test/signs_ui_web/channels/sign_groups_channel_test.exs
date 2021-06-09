defmodule SignsUiWeb.SignGroupsChannelTest do
  use SignsUiWeb.ChannelCase
  import ExUnit.CaptureLog
  alias Test.Support.Helpers

  setup do
    socket = subscribe_and_join!(socket(), SignsUiWeb.SignGroupsChannel, "signGroups:all", %{})
    %{socket: socket}
  end

  describe "handle_in/3" do
    test "allows changing sign groups when admin", %{socket: socket} do
      @endpoint.subscribe("signGroups:all")
      socket = Helpers.sign_in_with_groups(socket, "foo@mbta.com", ["signs-ui-admin"])

      changes = %{
        "data" => %{
          "1623264463487" => %{
            "alert_id" => "",
            "expires" => "2021-06-22T18:30:00.000Z",
            "line1" => "line1",
            "line2" => "line2",
            "route_id" => "Orange",
            "sign_ids" => [
              "oak_grove_mezzanine_southbound",
              "oak_grove_platform",
              "wellington_southbound"
            ]
          }
        }
      }

      log =
        capture_log([level: :info], fn ->
          assert {:noreply, ^socket} =
                   SignsUiWeb.SignGroupsChannel.handle_in("changeSignGroups", changes, socket)
        end)

      assert log =~ "changeSignGroups"
      assert log =~ "foo@mbta.com"

      assert_broadcast(
        "new_sign_groups_state",
        %{"Orange" => %{"1623264463487" => %SignsUi.Config.SignGroup{}}},
        300
      )
    end

    test "rejects changing sign groups when not admin", %{socket: socket} do
      @endpoint.subscribe("signGroups:all")

      {:stop, :normal, _socket} =
        SignsUiWeb.SignGroupsChannel.handle_in("changeSignGroups", %{"data" => %{}}, socket)

      assert_push("auth_expired", %{})
    end
  end
end
