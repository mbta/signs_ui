defmodule SignsUI.Signs.ExpirationTest do
  use ExUnit.Case
  import SignsUI.Signs.Expiration

  describe "expire_signs/2" do
    test "expires expired sign, but not signs that haven't expired" do
      {:ok, state_pid} = SignsUI.Signs.State.start_link(name: :sign_state_test)

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
