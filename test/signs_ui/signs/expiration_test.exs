defmodule SignsUI.Signs.ExpirationTest do
  use ExUnit.Case
  import SignsUI.Signs.Expiration

  describe "expire_signs/2" do
    test "expires expired sign" do
      {:ok, state_pid} = SignsUI.Signs.State.start_link(name: :sign_state_test)

      expire_signs(
        fn ->
          Timex.to_datetime(~N[2019-01-15 08:00:00], "America/New_York")
        end,
        state_pid
      )

      SignsUI.Signs.State.get_all(state_pid)["harvard_northbound"].config.mode == :auto
    end
  end
end
