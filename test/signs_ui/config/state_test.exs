defmodule SignsUi.Config.StateTest do
  use SignsUiWeb.ChannelCase
  import SignsUi.Config.State
  alias SignsUi.Config
  alias SignsUi.Config.Sign
  alias SignsUi.Config.ConfiguredHeadway
  alias SignsUi.Config.ConfiguredHeadways

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

      @endpoint.subscribe("headways:all")

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

      @endpoint.subscribe("headways:all")

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

      @endpoint.subscribe("headways:all")

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

      @endpoint.subscribe("chelseaBridgeAnnouncements:all")

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
    test "broadcasts updated sign groups after expiration" do
      {:ok, pid} = GenServer.start_link(SignsUi.Config.State, [], [])

      @endpoint.subscribe("signGroups:all")

      initial_state = %{
        "1111" => %SignsUi.Config.SignGroup{alert_id: "inactive_alert", route_id: "Red"},
        "2222" => %SignsUi.Config.SignGroup{
          route_id: "Red",
          expires: DateTime.new!(~D[2021-05-21], ~T[17:30:00])
        }
      }

      {:ok, _new_state} = update_sign_groups(pid, initial_state)

      expired = %{"1111" => %{}}

      {:ok, new_state} = update_sign_groups(pid, expired)

      updated_state = %{
        "2222" => %SignsUi.Config.SignGroup{
          route_id: "Red",
          expires: DateTime.new!(~D[2021-05-21], ~T[17:30:00])
        }
      }

      display_state = %{
        "Red" => %{
          "2222" => %SignsUi.Config.SignGroup{
            route_id: "Red",
            expires: DateTime.new!(~D[2021-05-21], ~T[17:30:00])
          }
        }
      }

      assert new_state.sign_groups == updated_state

      assert_broadcast("new_sign_groups_state", ^display_state)
    end

    test "handles sequential updates" do
      {:ok, pid} = GenServer.start_link(SignsUi.Config.State, [], [])

      @endpoint.subscribe("signGroups:all")

      initial_state = %{
        "1111" => %SignsUi.Config.SignGroup{
          route_id: "Red",
          sign_ids: ["sign_one", "sign_two"]
        },
        "2222" => %SignsUi.Config.SignGroup{
          route_id: "Green",
          sign_ids: ["sign_three", "sign_four"]
        }
      }

      {:ok, _new_state} = update_sign_groups(pid, initial_state)

      updates = %{
        "1111" => %{},
        "3333" => %SignsUi.Config.SignGroup{
          route_id: "Orange",
          sign_ids: ["sign_two", "sign_three"]
        }
      }

      {:ok, new_state} = update_sign_groups(pid, updates)

      updated_state = %{
        "2222" => %SignsUi.Config.SignGroup{
          route_id: "Green",
          sign_ids: ["sign_four"]
        },
        "3333" => %SignsUi.Config.SignGroup{
          route_id: "Orange",
          sign_ids: ["sign_two", "sign_three"]
        }
      }

      assert new_state.sign_groups == updated_state

      display_state = %{
        "Green" => %{
          "2222" => %SignsUi.Config.SignGroup{
            route_id: "Green",
            sign_ids: ["sign_four"]
          }
        },
        "Orange" => %{
          "3333" => %SignsUi.Config.SignGroup{
            route_id: "Orange",
            sign_ids: ["sign_two", "sign_three"]
          }
        }
      }

      assert_broadcast("new_sign_groups_state", ^display_state)
    end

    test "updates sign configs, too" do
      {:ok, pid} = GenServer.start_link(SignsUi.Config.State, [], [])
      @endpoint.subscribe("signGroups:all")
      @endpoint.subscribe("signs:all")

      updates = %{
        "new_sign_group" => %SignsUi.Config.SignGroup{
          sign_ids: ["sign_one"],
          route_id: "Red",
          line1: "line1",
          line2: "line2",
          alert_id: "alert"
        }
      }

      {:ok, new_state} = update_sign_groups(pid, updates)

      assert %{"new_sign_group" => %{}} = new_state.sign_groups
      assert %{"sign_one" => %{}} = new_state.signs
      assert_broadcast("new_sign_groups_state", %{"Red" => %{"new_sign_group" => %{}}})
      assert_broadcast("new_sign_configs_state", %{"sign_one" => %{}})
    end
  end
end
