defmodule SignsUI.Signs.RequestTest do
  use ExUnit.Case, async: true
  import SignsUI.Signs.Request
  import ExUnit.CaptureLog

  describe "get_signs/1" do
    test  "successfully parses valid json response" do
      signs = get_signs("valid_json_response")
      assert Enum.count(signs) == 2
      first_sign = Enum.at(signs, 0)
      assert {"sign1", %SignsUI.Signs.Sign{id: "sign1", disabled?: true}} = first_sign
    end

    test "Logs warning when receiving a 500" do
      log = capture_log [level: :info], fn ->
        assert get_signs("500_code") == %{}
      end
      assert log =~ "Could not load signs. Response returned with status code 500"
    end

    test "Logs warning when receiving HTTP error" do
      log = capture_log [level: :info], fn ->
        assert get_signs("http_error") == %{}
      end
      assert log =~ "Could not load signs: :timeout"
    end

    test "logs warning when response does not contain valid json" do
      log = capture_log [level: :info], fn ->
        assert get_signs("invalid_json") == %{}
      end
      assert log =~ "Could not decode response:"
    end
  end
end
