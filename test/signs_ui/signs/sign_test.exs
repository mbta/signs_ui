defmodule SignsUi.Signs.SignTest do
  use ExUnit.Case, async: true

  alias SignsUi.Signs.Sign
  alias SignsUi.Signs.SignLine
  alias SignsUi.Messages.SignContent

  @now DateTime.utc_now()

  @sign %Sign{
    station: "XYZ",
    zone: "w",
    lines: %{
      1 => %SignLine{
        expiration: @now,
        text: [{"a page", 5}]
      }
    }
  }

  @message %SignContent{
    station: "XYZ",
    zone: "w",
    line_number: 1,
    expiration: @now,
    pages: ["a page"]
  }

  describe "new_from_message/1" do
    test "creates a new sign from a SignContent message" do
      assert %Sign{
               station: "XYZ",
               zone: "w",
               lines: %{
                 1 => %SignLine{
                   expiration: @now,
                   text: [{"a page", 5}]
                 }
               }
             } = Sign.new_from_message(@message)
    end
  end

  describe "update_from_message" do
    test "adds a new line to a sign without one" do
      message2 = %{@message | line_number: 2, pages: ["2nd page"]}

      assert %Sign{
               station: "XYZ",
               zone: "w",
               lines: %{
                 1 => %SignLine{
                   expiration: @now,
                   text: [{"a page", 5}]
                 },
                 2 => %SignLine{
                   expiration: @now,
                   text: [{"2nd page", 5}]
                 }
               }
             } = Sign.update_from_message(@sign, message2)
    end
  end

  describe "to_json" do
    test "serializes to the map that the frontend expects" do
      assert %{
               sign_id: "XYZ-w",
               lines: %{
                 1 => %{
                   expiration: @now,
                   text: [%{content: "a page", duration: 5}]
                 }
               }
             } = Sign.to_json(@sign)
    end
  end
end
