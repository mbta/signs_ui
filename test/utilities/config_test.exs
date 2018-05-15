defmodule SignsUi.Utilities.ConfigTest do
  use ExUnit.Case
  import SignsUi.Utilities.Config

  describe "update_env/2" do
    test "Does not change config if it exists already" do
      Application.put_env(:signs_ui, :test_config, 1)
      update_env(:test_config, 2)
      assert Application.get_env(:signs_ui, :test_config) == 1
    end

    test "Sets new config value if it didn't exist" do
      update_env(:test_config2, 10)
      assert Application.get_env(:signs_ui, :test_config2) == 10
    end
  end
end
