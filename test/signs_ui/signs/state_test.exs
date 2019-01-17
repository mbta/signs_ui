defmodule SignsUI.Signs.StateTest do
  use ExUnit.Case
  import SignsUI.Signs.State
  alias SignsUI.Signs
  alias SignsUI.Signs.Sign

  describe "get_all/1" do
    test "Returns all signs" do
      {:ok, signs_server} = start_supervised({Signs.State, [name: :sign_test]})
      signs = %{"sign1" => Sign.new("sign1", true), "sign2" => Sign.new("sign2", true)}
      :sys.replace_state(signs_server, fn _state -> signs end)
      assert get_all(signs_server) == signs
    end
  end

  describe "update_some" do
    test "updates some values and leaves others alone" do
      {:ok, pid} = GenServer.start_link(SignsUI.Signs.State, [], [])

      assert %{
               "maverick_westbound" => %Signs.Sign{config: %{mode: :auto}},
               "maverick_eastbound" => %Signs.Sign{config: %{mode: :auto}},
               "forest_hills_southbound" => %Signs.Sign{config: %{mode: :auto}}
             } = get_all(pid)

      {:ok, new_state} =
        update_some(pid, %{
          "maverick_eastbound" => Sign.new("maverick_eastbound", false),
          "maverick_westbound" => Sign.new("maverick_westbound", false)
        })

      assert %{
               "maverick_westbound" => %Signs.Sign{config: %{mode: :off}},
               "maverick_eastbound" => %Signs.Sign{config: %{mode: :off}},
               "forest_hills_southbound" => %Signs.Sign{config: %{mode: :auto}}
             } = new_state

      assert %{
               "maverick_westbound" => %Signs.Sign{config: %{mode: :off}},
               "maverick_eastbound" => %Signs.Sign{config: %{mode: :off}},
               "forest_hills_southbound" => %Signs.Sign{config: %{mode: :auto}}
             } = get_all(pid)
    end
  end
end
