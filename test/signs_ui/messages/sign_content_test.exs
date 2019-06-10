defmodule SignsUi.Messages.SignContentTest do
  use ExUnit.Case, async: true
  alias SignsUi.Messages.SignContent

  describe "new/3" do
    test "parses a full message with all its parts" do
      now = Timex.now()
      command = ~s(e145~w1-"Riverside    4 min")

      assert SignContent.new("OSTA", command, now) ==
               {:ok,
                %SignContent{
                  expiration: Timex.shift(now, seconds: 145),
                  line_number: 1,
                  pages: ["Riverside    4 min"],
                  station: "OSTA",
                  zone: "w"
                }}
    end

    test "parses the zone" do
      assert {:ok, %SignContent{zone: "w"}} = SignContent.new("XYZ", ~s(e1~w1-"xyz"))
      assert {:ok, %SignContent{zone: "e"}} = SignContent.new("XYZ", ~s(e1~e1-"xyz"))
      assert {:ok, %SignContent{zone: "n"}} = SignContent.new("XYZ", ~s(e1~n1-"xyz"))
      assert {:ok, %SignContent{zone: "s"}} = SignContent.new("XYZ", ~s(e1~s1-"xyz"))
      assert {:ok, %SignContent{zone: "c"}} = SignContent.new("XYZ", ~s(e1~c1-"xyz"))
      assert {:ok, %SignContent{zone: "m"}} = SignContent.new("XYZ", ~s(e1~m1-"xyz"))
      assert {:error, :could_not_parse} = SignContent.new("XYZ", ~s(e1~z1-"xyz"))
    end

    test "parses the line number" do
      assert {:ok, %SignContent{line_number: 1}} = SignContent.new("XYZ", ~s(e1~e1-"xyz"))
      assert {:ok, %SignContent{line_number: 2}} = SignContent.new("XYZ", ~s(e1~e2-"xyz"))
      assert {:error, :could_not_parse} = SignContent.new("XYZ", ~s(e1~ex-"xyz"))
    end

    test "parses the expiration" do
      now = Timex.now()
      in_1_sec = Timex.shift(now, seconds: 1)
      in_15_sec = Timex.shift(now, seconds: 15)
      in_157_sec = Timex.shift(now, seconds: 157)

      assert {:ok, %SignContent{expiration: ^in_1_sec}} =
               SignContent.new("XYZ", ~s(e1~e1-"xyz"), now)

      assert {:ok, %SignContent{expiration: ^in_15_sec}} =
               SignContent.new("XYZ", ~s(e15~e1-"xyz"), now)

      assert {:ok, %SignContent{expiration: ^in_157_sec}} =
               SignContent.new("XYZ", ~s(e157~e1-"xyz"), now)

      assert {:error, :could_not_parse} = SignContent.new("XYZ", ~s(ea~e1-"xyz"), now)
    end

    test "parses out pages" do
      assert {:ok, %SignContent{pages: ["pg1", "pg2"]}} =
               SignContent.new("XYZ", ~s(e1~w1-"pg1"-"pg2"))
    end

    test "parses pages with optional duration" do
      assert {:ok, %SignContent{pages: [{"pg1", 3}, {"pg2", 5}]}} =
               SignContent.new("XYZ", ~s(e1~w1-"pg1".3-"pg2".5))
    end

    test "parses text with a + in it" do
      assert {:ok, %SignContent{pages: ["30+ min"]}} = SignContent.new("XYZ", ~s(e1~w1-"30+ min"))
    end

    test "parses empty text requests" do
      assert {:ok, %SignContent{pages: [""]}} = SignContent.new("XYZ", ~s(e1~w1-""))
    end

    test "parses text with a ' in it" do
      assert {:ok, %SignContent{pages: ["what's up"]}} =
               SignContent.new("XYZ", ~s(e1~w1-"what's up"))
    end
  end

  describe "page_to_text/1" do
    test "works with a string page" do
      assert SignContent.page_to_text("text") == "text"
    end

    test "works when the page has a duration" do
      assert SignContent.page_to_text({"text", 5}) == "text"
    end
  end
end
