defmodule SignsUi.Signs.SignLineTest do
  use ExUnit.Case, async: true

  alias SignsUi.Signs.SignLine
  alias SignsUi.Messages.SignContent

  @now DateTime.utc_now()

  @message %SignContent{
    station: "STA",
    zone: "w",
    line_number: 1,
    expiration: @now,
    pages: ["pg1", "pg2"]
  }

  @sign_line %SignLine{
    expiration: @now,
    text: "text"
  }

  describe "new_from_message" do
    test "turns a single page into just a string with default duration" do
      message = %{@message | pages: ["page 1"]}

      assert %SignLine{expiration: @now, text: [{"page 1", 5}]} =
               SignLine.new_from_message(message)
    end

    test "when multiple pages, keeps them all" do
      message = %{@message | pages: [{"page 1", 5}, "page 2"]}

      assert %SignLine{expiration: @now, text: [{"page 1", 5}, {"page 2", 5}]} =
               SignLine.new_from_message(message)
    end
  end

  describe "to_json/1" do
    test "When pages are 'away ... stopped ... n stops' (re-ordered because ARINC), returns n stops" do
      sign_line = %{@sign_line | text: [{"away", 2}, {"stopped", 5}, {"2 stops", 2}]}

      assert %{
               expiration: @now,
               text: [
                 %{content: "away", duration: 2},
                 %{content: "stopped", duration: 5},
                 %{content: "2 stops", duration: 2}
               ]
             } = SignLine.to_json(sign_line)
    end
  end
end
