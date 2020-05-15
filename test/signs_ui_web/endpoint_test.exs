defmodule SignsUiWeb.EndpointTest do
  use ExUnit.Case

  describe "init/2" do
    test "sets application env from system env" do
      old_port = System.get_env("PORT")
      old_host = System.get_env("SIGNS_UI_HOST")

      on_exit(fn ->
        if old_port do
          System.put_env("PORT", old_port)
        else
          System.delete_env("PORT")
        end

        if old_host do
          System.put_env("SIGNS_UI_HOST", old_host)
        else
          System.delete_env("SIGNS_UI_HOST")
        end
      end)

      System.put_env("PORT", "8000")
      System.put_env("SIGNS_UI_HOST", "myhost.com")

      initial_config = [
        load_from_system_env: true,
        url: [host: "example.com", port: 80]
      ]

      {:ok, config} = SignsUiWeb.Endpoint.init(:supervisor, initial_config)

      assert config[:http] == [:inet6, {:port, "8000"}]
      assert config[:url][:host] == "myhost.com"
    end

    test "raises when PORT environment variable isn't set" do
      assert_raise RuntimeError, "expected the PORT environment variable to be set", fn ->
        SignsUiWeb.Endpoint.init(:supervisor, load_from_system_env: true)
      end
    end

    test "raises when SIGNS_UI_HOST environment variable isn't set" do
      old_port = System.get_env("PORT")

      on_exit(fn ->
        if old_port do
          System.put_env("PORT", old_port)
        else
          System.delete_env("PORT")
        end
      end)

      System.put_env("PORT", "8000")

      assert_raise RuntimeError,
                   "expected the SIGNS_UI_HOST environment variable to be set",
                   fn ->
                     SignsUiWeb.Endpoint.init(:supervisor, load_from_system_env: true)
                   end
    end
  end
end
