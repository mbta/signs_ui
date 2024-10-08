defmodule SignsUiWeb.AuthManagerTest do
  use ExUnit.Case

  describe "subject_for_token/2" do
    test "returns username" do
      assert SignsUiWeb.AuthManager.subject_for_token("foo", %{}) == {:ok, "foo"}
    end
  end

  describe "resource_from_claims/1" do
    test "returns username and expiration when well-formatted" do
      assert {:ok, "foo"} ==
               SignsUiWeb.AuthManager.resource_from_claims(%{"sub" => "foo", "exp" => 100})
    end

    test "returns error when not well-formatted" do
      assert {:error, :invalid_claims} == SignsUiWeb.AuthManager.resource_from_claims(%{})
    end
  end

  describe "claims_access_level" do
    test "works with no role information" do
      assert SignsUiWeb.AuthManager.claims_access_level(%{}) == :none
    end

    test "works with nil roles" do
      assert SignsUiWeb.AuthManager.claims_access_level(%{"roles" => nil}) == :none
    end

    test "read-only access" do
      assert SignsUiWeb.AuthManager.claims_access_level(%{"roles" => []}) == :read_only
    end

    test "admin access" do
      assert SignsUiWeb.AuthManager.claims_access_level(%{"roles" => ["signs-ui-admin"]}) ==
               :admin
    end
  end
end
