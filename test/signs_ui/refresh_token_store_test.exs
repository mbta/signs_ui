defmodule SignsUi.RefreshTokenStoreTest do
  use ExUnit.Case, async: true

  describe "start_link/1" do
    test "starts up and lives" do
      {:ok, pid} = SignsUi.RefreshTokenStore.start_link(name: :refresh_token_start_link_test)

      Process.sleep(100)

      assert Process.alive?(pid)
    end
  end

  describe "put_refresh_token/3" do
    test "stores the token in the state" do
      {:ok, pid} = SignsUi.RefreshTokenStore.start_link(name: :refresh_token_put_test)

      SignsUi.RefreshTokenStore.put_refresh_token(pid, "foo@mbta.com", "bar")

      assert :sys.get_state(pid) == %{"foo@mbta.com" => "bar"}
    end
  end

  describe "get_refresh_token/2" do
    test "gets the token from the state" do
      {:ok, pid} = SignsUi.RefreshTokenStore.start_link(name: :refresh_token_get_test)

      :sys.replace_state(pid, fn _state -> %{"foo@mbta.com" => "bar"} end)

      assert SignsUi.RefreshTokenStore.get_refresh_token(pid, "foo@mbta.com") == "bar"
    end
  end

  describe "clear_refresh_token/2" do
    test "clears the token from the state" do
      {:ok, pid} = SignsUi.RefreshTokenStore.start_link(name: :refresh_token_clear_test)

      :sys.replace_state(pid, fn _state -> %{"foo@mbta.com" => "bar"} end)

      assert SignsUi.RefreshTokenStore.clear_refresh_token(pid, "foo@mbta.com") == :ok
      assert :sys.get_state(pid) == %{}
    end
  end
end
