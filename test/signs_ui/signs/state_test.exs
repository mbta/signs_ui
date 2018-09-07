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
      enabled_signs = %{
        "sign_1" => %Signs.Sign{enabled?: true},
      }
      status = update(signs_server, enabled_signs)
      state = :sys.get_state(signs_server)
      assert Map.get(state, "sign_1").enabled?
      assert status == :ok
    end
  end

  describe "update_all" do
    test "updates some values and leaves others alone" do
      {:ok, pid} = GenServer.start_link(SignsUI.Signs.State, [], [])

      assert %{
        "maverick_westbound" => %Signs.Sign{enabled?: true},
        "maverick_eastbound" => %Signs.Sign{enabled?: true},
        "forest_hills_southbound" => %Signs.Sign{enabled?: true}
      } = get_all(pid)

      :ok = update_some(pid, %{"maverick_eastbound" => false, "maverick_westbound" => false})

      assert %{
        "maverick_westbound" => %Signs.Sign{enabled?: false},
        "maverick_eastbound" => %Signs.Sign{enabled?: false},
        "forest_hills_southbound" => %Signs.Sign{enabled?: true}
      } = get_all(pid)

    end
  end
end
