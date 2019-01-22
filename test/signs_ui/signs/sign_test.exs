defmodule SignsUI.Signs.SignTest do
  use ExUnit.Case, async: true
  import ExUnit.CaptureLog
  import SignsUI.Signs.Sign
  alias SignsUI.Signs.Sign

  @expires "2018-08-10T12:00:00Z"

  describe "from_json" do
    test "builds a Sign struct in 'auto' mode from legacy json" do
      values = %{"enabled" => true}
      expected = %Sign{id: "Sign", config: %{mode: :auto}}
      assert from_json("Sign", values) == expected
    end

    test "builds a Sign struct in 'off' mode from legacy json" do
      values = %{"enabled" => false}
      expected = %Sign{id: "Sign", config: %{mode: :off, expires: nil}}
      assert from_json("Sign", values) == expected
    end

    test "builds a Sign struct in 'auto' mode from json" do
      values = %{"mode" => "auto"}
      expected = %Sign{id: "Sign", config: %{mode: :auto}}
      assert from_json("Sign", values) == expected
    end

    test "builds a Sign struct in 'off' mode from json" do
      values = %{"mode" => "off", "expires" => @expires}
      {:ok, expires_dt, 0} = DateTime.from_iso8601(@expires)

      expected = %Sign{
        id: "Sign",
        config: %{mode: :off, expires: expires_dt}
      }

      assert from_json("Sign", values) == expected
    end

    test "builds a Sign struct in 'headway' mode from json" do
      values = %{"mode" => "headway", "expires" => @expires}
      {:ok, expires_dt, 0} = DateTime.from_iso8601(@expires)
      expected = %Sign{id: "Sign", config: %{mode: :headway, expires: expires_dt}}
      assert from_json("Sign", values) == expected
    end

    test "builds a Sign struct in 'static text' mode from json" do
      values = %{
        "mode" => "static_text",
        "line1" => "line1 text",
        "line2" => "line2 text",
        "expires" => @expires
      }

      {:ok, expires_dt, 0} = DateTime.from_iso8601(@expires)

      expected = %Sign{
        id: "Sign",
        config: %{
          mode: :static_text,
          expires: expires_dt,
          line1: "line1 text",
          line2: "line2 text"
        }
      }

      assert from_json("Sign", values) == expected
    end

    test "correctly handle invalid date" do
      values = %{"mode" => "off", "expires" => "foo"}

      expected = %Sign{
        id: "Sign",
        config: %{mode: :off, expires: nil}
      }

      log =
        capture_log([level: :warn], fn ->
          assert from_json("Sign", values) == expected
        end)

      assert log =~ "Invalid expiration time"
    end
  end

  describe "to_json" do
    test "serializes an Auto sign" do
      sign = %Sign{id: "sign", config: %{mode: :auto}}
      assert to_json(sign) == %{"id" => "sign", "mode" => "auto", "enabled" => true}
    end

    test "serializes a Headway sign" do
      {:ok, expires_dt, 0} = DateTime.from_iso8601(@expires)

      sign = %Sign{
        id: "sign",
        config: %{mode: :headway, expires: expires_dt}
      }

      assert to_json(sign) == %{
               "id" => "sign",
               "mode" => "headway",
               "expires" => @expires,
               "enabled" => false
             }
    end

    test "serializes an Off sign" do
      {:ok, expires_dt, 0} = DateTime.from_iso8601(@expires)
      sign = %Sign{id: "sign", config: %{mode: :off, expires: expires_dt}}

      assert to_json(sign) == %{
               "id" => "sign",
               "mode" => "off",
               "expires" => @expires,
               "enabled" => false
             }
    end

    test "serializes a Static Text sign" do
      {:ok, expires_dt, 0} = DateTime.from_iso8601(@expires)

      sign = %Sign{
        id: "sign",
        config: %{mode: :static_text, expires: expires_dt, line1: "l1", line2: "l2"}
      }

      assert to_json(sign) == %{
               "id" => "sign",
               "mode" => "static_text",
               "expires" => @expires,
               "line1" => "l1",
               "line2" => "l2",
               "enabled" => false
             }
    end
  end
end
