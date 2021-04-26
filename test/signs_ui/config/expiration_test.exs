defmodule SignsUi.Config.ExpirationTest do
  use ExUnit.Case
  import ExUnit.CaptureLog
  require Logger
  alias SignsUi.Signs.Sign
  alias SignsUi.Config.Sign

  describe "expire_signs_via_time/2" do
    test "produces correct updates" do
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
              expires: time1
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

      assert SignsUi.Config.Expiration.expire_signs_via_time(state, fn ->
               DateTime.new!(~D[2019-01-15], ~T[08:00:00], "America/New_York")
             end) == expected_updates
    end
  end

  describe "expire_signs_via_alert/2" do
    test "produces correct updates" do
      alert_state = %SignsUi.Alerts.State{
        alerts: %{
          "Red" => %{
            "1234" => %{},
            "5678" => %{}
          },
          "Blue" => %{
            "abc" => %{}
          }
        }
      }

      active_alert_ids = SignsUi.Config.Expiration.get_active_alert_ids(alert_state)
      assert active_alert_ids == MapSet.new(["1234", "5678", "abc"])

      sign_state = [
        %SignsUi.Config.Sign{
          id: "250",
          config: %{mode: :auto}}
        %SignsUi.Config.Sign{
          id: "460",
          config: %{
            mode: :headway,
            expires: nil,
            alert_id: nil}}
        %SignsUi.Config.Sign{
          id: "898",
          config: %{
            mode: :headway,
            expires: nil,
            alert_id: "1234"}}
        %SignsUi.Config.Sign{
           id: "925",
           config: %{
             mode: :headway,
             expires: nil,
             alert_id: "326"}}
        %SignsUi.Config.Sign{
          id: "793",
          config: %{
            mode: :off,
            expires: nil,
            alert_id: nil}}
        %SignsUi.Config.Sign{
          id: "367",
          config: %{
            mode: :off,
            expires: nil,
            alert_id: "5678"}}
        %SignsUi.Config.Sign{
           id: "471",
           config: %{
             mode: :off,
             expires: nil,
             alert_id: "437"}}
        %SignsUi.Config.Sign{
          id: "714",
          config: %{
            mode: :static_text,
            line1: "test",
            line2: "test",
            expires: nil,
            alert_id: nil}}
        %SignsUi.Config.Sign{
          id: "474",
          config: %{
            mode: :static_text,
            line1: "test",
            line2: "test",
            expires: nil,
            alert_id: "abc"}}
        %SignsUi.Config.Sign{
           id: "273",
           config: %{
             mode: :static_text,
             line1: "test",
             line2: "test",
             expires: nil,
             alert_id: "593"}}
        ]

        expired_signs = expire_signs_via_alert(sign_state, active_alert_ids)
        expected_sigs = [
          %SignsUi.Config.Sign{
            id: "326",
            config: %{mode: :auto}},
          %SignsUi.Config.Sign{
            id: "437",
            config: %{mode: :auto}},
          %SignsUi.Config.Sign{
            id: "593",
            config: %{mode: :auto}}
        ]

        assert MapSet.new(expired_signs) == MapSet.new(expected_signs)
    end
  end

  describe "process_expired callback" do
    test "expires expired sign, but not signs that haven't expired" do
      old_level = Logger.level()
      Logger.configure(level: :info)
      on_exit(fn -> Logger.configure(level: old_level) end)

      {:ok, _state_pid} = SignsUi.Config.State.start_link(name: :sign_state_test)

      state = %{
        time_fetcher: fn ->
          DateTime.new!(~D[2019-01-15], ~T[08:00:00], "America/New_York")
        end,
        loop_ms: 5_000,
        sign_state_server: :sign_state_test
      }

      log =
        capture_log([level: :info], fn ->
          {:noreply, _state} = SignsUi.Config.Expiration.handle_info(:process_expired, state)
        end)

      assert log =~ "Cleaning expired settings for sign IDs: [\"harvard_northbound\"]"

      new_state = SignsUi.Config.State.get_all(:sign_state_test)

      assert new_state.signs["harvard_northbound"].config.mode == :auto
      assert new_state.signs["harvard_southbound"].config.mode == :static_text
      assert new_state.signs["central_southbound"].config.mode == :static_text
    end
  end
end
