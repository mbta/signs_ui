defmodule SignsUI.Signs.ExpirationTest do
  use ExUnit.Case
  import SignsUI.Signs.Expiration

  describe "expire_signs/2" do
    test "expires expired sign, but not signs that haven't expired" do
      {:ok, state_pid} = SignsUI.Signs.State.start_link(name: :sign_state_test)

      expire_signs(
        fn ->
          Timex.to_datetime(~N[2019-01-15 08:00:00], "America/New_York")
        end,
        state_pid
      )

      new_state = SignsUI.Signs.State.get_all(state_pid)

      assert new_state["harvard_northbound"].config.mode == :auto
      assert new_state["harvard_southbound"].config.mode == :static_text
      assert new_state["central_southbound"].config.mode == :static_text
    end
  end
end
