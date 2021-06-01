defmodule SignsUi.Config.StateTest do
  use SignsUiWeb.ChannelCase
  import SignsUi.Config.State
  alias SignsUi.Config
  alias SignsUi.Config.Sign
  alias SignsUi.Config.ConfiguredHeadway
  alias SignsUi.Config.ConfiguredHeadways

  setup do
    {:ok, claims} =
      Guardian.Token.Jwt.build_claims(
        SignsUiWeb.AuthManager,
        "test_user",
        "test_user"
      )

    {:ok, token} = Guardian.Token.Jwt.create_token(SignsUiWeb.AuthManager, claims)
    {:ok, socket} = connect(SignsUiWeb.UserSocket, %{"token" => token})
    {:ok, _, socket} = subscribe_and_join(socket, "signs:all", %{})

    {:ok, socket: socket}
  end

  describe "get_all/1" do
    test "Returns all signs" do
      {:ok, signs_server} = start_supervised({Config.State, [name: :sign_test]})
      signs = %{"sign1" => Sign.new("sign1", true), "sign2" => Sign.new("sign2", true)}
      :sys.replace_state(signs_server, fn _state -> signs end)
      assert get_all(signs_server) == signs
    end
  end

  describe "update_sign_configs" do
    test "updates some values and leaves others alone" do
      {:ok, pid} = GenServer.start_link(SignsUi.Config.State, [], [])

      @endpoint.subscribe("signs:all")

      assert %{
               signs: %{
                 "maverick_westbound" => %Config.Sign{config: %{mode: :auto}},
                 "maverick_eastbound" => %Config.Sign{config: %{mode: :auto}},
                 "forest_hills_southbound" => %Config.Sign{config: %{mode: :auto}}
               }
             } = get_all(pid)

      {:ok, new_state} =
        update_sign_configs(pid, %{
          "maverick_eastbound" => Sign.new("maverick_eastbound", false),
          "maverick_westbound" => Sign.new("maverick_westbound", false)
        })

      assert %{
               signs: %{
                 "maverick_westbound" => %Config.Sign{config: %{mode: :off}},
                 "maverick_eastbound" => %Config.Sign{config: %{mode: :off}},
                 "forest_hills_southbound" => %Config.Sign{config: %{mode: :auto}}
               }
             } = new_state

      expected_broadcast =
        pid
        |> get_all()
        |> Map.get(:signs)
        |> Enum.map(fn {_id, sign} -> {sign.id, sign.config} end)
        |> Enum.into(%{})

      assert_broadcast("new_sign_configs_state", ^expected_broadcast)

      assert %{
               signs: %{
                 "maverick_westbound" => %Config.Sign{config: %{mode: :off}},
                 "maverick_eastbound" => %Config.Sign{config: %{mode: :off}},
                 "forest_hills_southbound" => %Config.Sign{config: %{mode: :auto}}
               }
             } = get_all(pid)
    end
  end

  describe "update_configured_headways" do
    test "updates values properly" do
      {:ok, pid} = GenServer.start_link(SignsUi.Config.State, [], [])

      @endpoint.subscribe("signs:all")

      assert get_all(pid).configured_headways == %{
               "red_trunk" => %{
                 "peak" => %ConfiguredHeadway{
                   range_low: 8,
                   range_high: 10
                 }
               }
             }

      {:ok, new_state} =
        update_configured_headways(pid, %{
          "red_trunk" => %{"peak" => %ConfiguredHeadway{range_low: 13, range_high: 15}}
        })

      assert new_state.configured_headways == %{
               "red_trunk" => %{"peak" => %ConfiguredHeadway{range_low: 13, range_high: 15}}
             }

      expected_broadcast =
        pid
        |> get_all()
        |> Map.get(:configured_headways)
        |> ConfiguredHeadways.format_configured_headways_for_json()

      assert_broadcast("new_configured_headways_state", ^expected_broadcast)
    end

    test "adds new values properly" do
      {:ok, pid} = GenServer.start_link(SignsUi.Config.State, [], [])

      @endpoint.subscribe("signs:all")

      {:ok, new_state} =
        update_configured_headways(pid, %{
          "red_trunk" => %{"peak" => %ConfiguredHeadway{range_low: 13, range_high: 15}},
          "red_ashmont" => %{"peak" => %ConfiguredHeadway{range_low: 27, range_high: 30}}
        })

      assert new_state.configured_headways == %{
               "red_trunk" => %{"peak" => %ConfiguredHeadway{range_low: 13, range_high: 15}},
               "red_ashmont" => %{"peak" => %ConfiguredHeadway{range_low: 27, range_high: 30}}
             }

      expected_broadcast =
        pid
        |> get_all()
        |> Map.get(:configured_headways)
        |> ConfiguredHeadways.format_configured_headways_for_json()

      assert_broadcast("new_configured_headways_state", ^expected_broadcast)
    end

    test "removes values properly" do
      {:ok, pid} = GenServer.start_link(SignsUi.Config.State, [], [])

      @endpoint.subscribe("signs:all")

      {:ok, new_state} = update_configured_headways(pid, %{})

      assert new_state.configured_headways == %{}

      expected_broadcast =
        pid
        |> get_all()
        |> Map.get(:configured_headways)

      assert_broadcast("new_configured_headways_state", ^expected_broadcast)
    end
  end

  describe "update_chelsea_bridge_announcements" do
    test "updates values properly" do
      {:ok, pid} = GenServer.start_link(SignsUi.Config.State, [], [])

      @endpoint.subscribe("signs:all")

      assert get_all(pid).chelsea_bridge_announcements == "auto"

      {:ok, new_state} = update_chelsea_bridge_announcements(pid, "off")

      assert new_state.chelsea_bridge_announcements == "off"

      assert_broadcast("new_chelsea_bridge_announcements_state", %{
        chelsea_bridge_announcements: "off"
      })

      {:ok, new_state} = update_chelsea_bridge_announcements(pid, "auto")

      assert new_state.chelsea_bridge_announcements == "auto"

      assert_broadcast("new_chelsea_bridge_announcements_state", %{
        chelsea_bridge_announcements: "auto"
      })
    end
  end

  describe "update_sign_groups/2" do
    test "broadcasts updated sign groups" do
      {:ok, pid} = GenServer.start_link(SignsUi.Config.State, [], [])

      @endpoint.subscribe("sign_groups:all")

      changes = %{
        "Red" => %{
          "5555" => %SignsUi.Config.SignGroup{route_id: "Red"},
          "1234" => %SignsUi.Config.SignGroup{alert_id: "active_alert", route_id: "Red"},
          "55534" => %SignsUi.Config.SignGroup{
            route_id: "Red",
            expires: DateTime.new!(~D[2021-05-21], ~T[17:35:00])
          }
        }
      }

      {:ok, new_state} = update_sign_groups(pid, changes)

      assert new_state.sign_groups == changes

      assert_broadcast("new_sign_groups_state", ^changes)
    end
  end
end
