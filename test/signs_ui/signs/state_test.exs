defmodule SignsUi.Signs.StateTest do
  use SignsUiWeb.ChannelCase
  import SignsUi.Signs.State
  alias SignsUi.Signs
  alias SignsUi.Signs.Sign

  setup do
    {:ok, claims} =
      Guardian.Token.Jwt.build_claims(
        SignsUiWeb.AuthManager,
        "test_user",
        "test_user"
      )

    {:ok, token} = Guardian.Token.Jwt.create_token(SignsUiWeb.AuthManager, claims)
    {:ok, socket} = connect(SignsUiWeb.UserSocket, %{"token" => token})
    {:ok, _, socket} = subscribe_and_join(socket, "signs:all", %{})

    {:ok, socket: socket}
  end

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
      {:ok, pid} = GenServer.start_link(SignsUi.Signs.State, [], [])

      @endpoint.subscribe("signs:all")

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

      expected_broadcast =
        pid
        |> get_all()
        |> Enum.map(fn {_id, sign} -> {sign.id, sign.config} end)
        |> Enum.into(%{})

      assert_broadcast("new_sign_configs_state", ^expected_broadcast)

      assert %{
               "maverick_westbound" => %Signs.Sign{config: %{mode: :off}},
               "maverick_eastbound" => %Signs.Sign{config: %{mode: :off}},
               "forest_hills_southbound" => %Signs.Sign{config: %{mode: :auto}}
             } = get_all(pid)
    end
  end
end
