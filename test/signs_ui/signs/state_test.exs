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

  describe "update/2" do
    test "updates signs based on enabled_values" do
      {:ok, signs_server} = start_supervised({Signs.State, [name: :sign_test]})
      signs = %{"sign_1" => %Signs.Sign{enabled?: false}, "sign2" => %Signs.Sign{}}
      :sys.replace_state(signs_server, fn _state -> signs end)
      enabled_map = %{
        "sign_1" => "true"
      }
      update(signs_server, enabled_map)
      state = :sys.get_state(signs_server)
      assert Map.get(state, "sign_1").enabled?
    end
  end
end
