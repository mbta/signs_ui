defmodule SignsUI.Signs.ExpirationTest do
  use ExUnit.Case
  alias SignsUI.Signs.Sign

  describe "expire_signs/2" do
    test "expire_signs/2" do
      {:ok, time1, 0} = DateTime.from_iso8601("2019-01-15T12:00:00Z")
      {:ok, time2, 0} = DateTime.from_iso8601("2019-01-15T14:00:00Z")

      signs = %{
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
        }
      }

      expected_updates = %{
        "past_expiration" => %Sign{
          id: "past_expiration",
          config: %{
            mode: :auto
          }
        }
      }

      assert SignsUI.Signs.Expiration.expire_signs(signs, fn ->
               Timex.to_datetime(~N[2019-01-15 08:00:00], "America/New_York")
             end) == expected_updates
    end
  end

  describe "process_expired callback" do
    test "expires expired sign, but not signs that haven't expired" do
      {:ok, _state_pid} = SignsUI.Signs.State.start_link(name: :sign_state_test)

      state = %{
        time_fetcher: fn ->
          Timex.to_datetime(~N[2019-01-15 08:00:00], "America/New_York")
        end,
        loop_ms: 5_000,
        sign_state_server: :sign_state_test
      }

      {:noreply, _state} = SignsUI.Signs.Expiration.handle_info(:process_expired, state)

      new_state = SignsUI.Signs.State.get_all(:sign_state_test)

      assert new_state["harvard_northbound"].config.mode == :auto
      assert new_state["harvard_southbound"].config.mode == :static_text
      assert new_state["central_southbound"].config.mode == :static_text
    end
  end
end
