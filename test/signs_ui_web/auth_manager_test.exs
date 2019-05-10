defmodule SignsUiWeb.AuthManagerTest do
  use ExUnit.Case

  describe "subject_for_token/2" do
    test "returns username" do
      assert SignsUiWeb.AuthManager.subject_for_token(%{username: "foo", expiration: 100}, %{}) ==
               {:ok, "foo"}
    end
  end

  describe "resource_from_claims/1" do
    test "returns username and expiration when well-formatted" do
      assert {:ok, %{username: "foo", expiration: 100}} ==
               SignsUiWeb.AuthManager.resource_from_claims(%{"sub" => "foo", "exp" => 100})
    end

    test "returns error when not well-formatted" do
      assert {:error, :invalid_claims} == SignsUiWeb.AuthManager.resource_from_claims(%{})
    end
  end
end
