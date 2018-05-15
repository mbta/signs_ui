defmodule SignsUI.Signs.StateTest do
  use ExUnit.Case
  import SignsUI.Signs.State
  alias SignsUI.Signs

  describe "get_all/1" do
    test "Returns all signs" do
      {:ok, signs_server} = start_supervised({Signs.State, [name: :sign_test]})
      signs = %{"sign_1" => %Signs.Sign{}, "sign2" => %Signs.Sign{}}
      :sys.replace_state(signs_server, fn _state -> signs end)
      assert get_all(signs_server) == signs
    end
  end
end
