defmodule SignsUi.Config.ExpirationTest do
  use ExUnit.Case
  import ExUnit.CaptureLog
  require Logger
  alias SignsUi.Signs.Sign
  alias SignsUi.Config.Sign

  describe "expire_signs/3" do
    test "produces correct updates when times expire" do
      {:ok, time1, 0} = DateTime.from_iso8601("2019-01-15T12:00:00Z")
      {:ok, time2, 0} = DateTime.from_iso8601("2019-01-15T14:00:00Z")

      state = %{
        signs: %{
          "nil_expiration" => %Sign{
            id: "nil_expiration",
            config: %{
              mode: :off,
              expires: nil
            }
          },
          "past_expiration" => %Sign{
            id: "past_expiration",
            config: %{
              mode: :off,
              expires: time1,
              alert_id: nil
            }
          },
          "future_expiration" => %Sign{
            id: "future_expiration",
            config: %{
              mode: :off,
              expires: time2
            }
          },
          "already_auto" => %Sign{
            id: "already_auto",
            config: %{mode: :auto}
          }
        },
        configured_headways: %{}
      }

      expected_updates = %{
        "past_expiration" => %Sign{
          id: "past_expiration",
          config: %{
            mode: :auto
          }
        }
      }

      assert SignsUi.Config.Expiration.expire_signs(
               state,
               DateTime.new!(~D[2019-01-15], ~T[08:00:00], "America/New_York"),
               MapSet.new([])
             ) == expected_updates
    end

    test "produces correct updates when alerts expire" do
      sign_state = %{
        signs: %{
          "250" => %Sign{
            config: %{mode: :auto},
            id: "250"
          },
          "460" => %Sign{
            config: %{
              alert_id: nil,
              expires: nil,
              mode: :headway
            },
            id: "460"
          },
          "898" => %Sign{
            config: %{
              alert_id: "1234",
              expires: nil,
              mode: :headway
            },
            id: "898"
          },
          "925" => %Sign{
            config: %{
              alert_id: "326",
              expires: nil,
              mode: :headway
            },
            id: "925"
          },
          "793" => %Sign{
            id: "793",
            config: %{
              mode: :off,
              expires: nil,
              alert_id: nil
            }
          },
          "367" => %Sign{
            id: "367",
            config: %{
              mode: :off,
              expires: nil,
              alert_id: "5678"
            }
          },
          "471" => %Sign{
            id: "471",
            config: %{
              mode: :off,
              expires: nil,
              alert_id: "437"
            }
          },
          "714" => %Sign{
            id: "714",
            config: %{
              mode: :static_text,
              line1: "test",
              line2: "test",
              expires: nil,
              alert_id: nil
            }
          },
          "474" => %Sign{
            id: "474",
            config: %{
              mode: :static_text,
              line1: "test",
              line2: "test",
              expires: nil,
              alert_id: "abc"
            }
          },
          "273" => %Sign{
            id: "273",
            config: %{
              mode: :static_text,
              line1: "test",
              line2: "test",
              expires: nil,
              alert_id: "593"
            }
          }
        }
      }

      expired_signs =
        SignsUi.Config.Expiration.expire_signs(
          sign_state,
          DateTime.new!(~D[2019-01-15], ~T[08:00:00], "America/New_York"),
          MapSet.new(["1234", "5678", "abc"])
        )

      expected_signs = %{
        "925" => %Sign{
          id: "925",
          config: %{mode: :auto}
        },
        "471" => %Sign{
          id: "471",
          config: %{mode: :auto}
        },
        "273" => %Sign{
          id: "273",
          config: %{mode: :auto}
        }
      }

      assert expired_signs == expected_signs
    end
  end

  describe "process_expired callback" do
    test "expires expired sign, but not signs that haven't expired" do
      old_level = Logger.level()
      Logger.configure(level: :info)
      on_exit(fn -> Logger.configure(level: old_level) end)

      {:ok, _state_pid} = SignsUi.Config.start_link(name: :sign_state_test)

      state = %{
        time_fetcher: fn ->
          DateTime.new!(~D[2019-01-15], ~T[08:00:00], "America/New_York")
        end,
        loop_ms: 5_000,
        sign_state_server: :sign_state_test,
        alert_fetcher: fn -> MapSet.new([]) end
      }

      log =
        capture_log([level: :info], fn ->
          {:noreply, _state} = SignsUi.Config.Expiration.handle_info(:process_expired, state)
        end)

      assert log =~ "Cleaning expired settings for sign IDs: [\"harvard_northbound\"]"

      new_state = SignsUi.Config.get_all(:sign_state_test)

      assert new_state.signs["harvard_northbound"].config.mode == :auto
      assert new_state.signs["harvard_southbound"].config.mode == :static_text
      assert new_state.signs["central_southbound"].config.mode == :static_text
    end

    test "only removes expired sign groups" do
      {:ok, pid} = SignsUi.Config.start_link(name: :sign_state_test)

      SignsUi.Config.update_sign_groups(pid, %{
        "1111" => %SignsUi.Config.SignGroup{alert_id: "inactive_alert", route_id: "Red"},
        "2222" => %SignsUi.Config.SignGroup{
          route_id: "Red",
          expires: DateTime.new!(~D[2021-05-21], ~T[17:30:00])
        },
        "3333" => %SignsUi.Config.SignGroup{
          route_id: "Red",
          expires: DateTime.new!(~D[2021-05-21], ~T[17:35:00])
        },
        "4444" => %SignsUi.Config.SignGroup{
          route_id: "Red",
          alert_id: "active_alert"
        }
      })

      state = %{
        time_fetcher: fn ->
          DateTime.new!(~D[2021-05-21], ~T[17:32:00])
        end,
        loop_ms: 5_000,
        sign_state_server: :sign_state_test,
        alert_fetcher: fn -> MapSet.new(["active_alert"]) end
      }

      log =
        capture_log([level: :info], fn ->
          {:noreply, _state} = SignsUi.Config.Expiration.handle_info(:process_expired, state)
        end)

      assert log =~ "expired_sign_groups"

      new_state = SignsUi.Config.get_all(:sign_state_test)

      assert new_state.sign_groups == %{
               "3333" => %SignsUi.Config.SignGroup{
                 route_id: "Red",
                 expires: DateTime.new!(~D[2021-05-21], ~T[17:35:00])
               },
               "4444" => %SignsUi.Config.SignGroup{
                 route_id: "Red",
                 alert_id: "active_alert"
               }
             }
    end
  end
end
