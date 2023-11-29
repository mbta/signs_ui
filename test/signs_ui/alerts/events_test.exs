defmodule SignsUi.Alerts.EventsTest do
  use ExUnit.Case, async: true
  alias SignsUi.Alerts.Events
  import ExUnit.CaptureLog

  describe "parse/1" do
    test "handles a bad created_at" do
      event_data = """
      {"attributes":{"active_period":[{"end":"2021-05-05T02:30:00-04:00","start":"2021-05-04T20:41:36-04:00"}],"banner":null,"cause":"UNKNOWN_CAUSE","created_at":"INVALID_CREATED_AT","description":null,"effect":"DELAY","header":"Blue Line experiencing delays of up to 10 minutes today","informed_entity":[{"activities":["BOARD","EXIT","RIDE"],"route":"Blue","route_type":1}],"lifecycle":"NEW","service_effect":"Blue Line delay","severity":3,"short_header":"Blue Line experiencing delays of up to 10 minutes today","timeframe":null,"updated_at":"2021-05-04T20:41:37-04:00","url":null},"id":"126976","links":{"self":"/alerts/126976"},"type":"alert"}
      """

      assert capture_log(fn -> Events.parse(event_data) end) =~
               "[error] Failed to parse created_at, reason=:invalid_format"

      assert Events.parse(event_data) ==
               %{
                 affected_routes: MapSet.new(["Blue"]),
                 created_at: nil,
                 id: "126976",
                 service_effect: "Blue Line delay"
               }
    end

    test "parses a reset event payload" do
      event_data = """
      [{"attributes":{"active_period":[{"end":"2021-05-05T02:30:00-04:00","start":"2021-05-04T20:41:36-04:00"}],"banner":null,"cause":"UNKNOWN_CAUSE","created_at":"2021-05-04T20:41:37-04:00","description":null,"effect":"DELAY","header":"Blue Line experiencing delays of up to 10 minutes today","informed_entity":[{"activities":["BOARD","EXIT","RIDE"],"route":"Blue","route_type":1}],"lifecycle":"NEW","service_effect":"Blue Line delay","severity":3,"short_header":"Blue Line experiencing delays of up to 10 minutes today","timeframe":null,"updated_at":"2021-05-04T20:41:37-04:00","url":null},"id":"126976","links":{"self":"/alerts/126976"},"type":"alert"}]
      """

      assert Events.parse(event_data) == [
               %{
                 affected_routes: MapSet.new(["Blue"]),
                 created_at: ~U[2021-05-05 00:41:37Z],
                 id: "126976",
                 service_effect: "Blue Line delay"
               }
             ]
    end

    test "parses an add event payload" do
      event_data = """
      {"attributes":{"active_period":[{"end":"2021-05-05T02:30:00-04:00","start":"2021-05-04T20:41:36-04:00"}],"banner":null,"cause":"UNKNOWN_CAUSE","created_at":"2021-05-04T20:41:37-04:00","description":null,"effect":"DELAY","header":"Blue Line experiencing delays of up to 10 minutes today","informed_entity":[{"activities":["BOARD","EXIT","RIDE"],"route":"Blue","route_type":1}],"lifecycle":"NEW","service_effect":"Blue Line delay","severity":3,"short_header":"Blue Line experiencing delays of up to 10 minutes today","timeframe":null,"updated_at":"2021-05-04T20:41:37-04:00","url":null},"id":"126976","links":{"self":"/alerts/126976"},"type":"alert"}
      """

      assert Events.parse(event_data) ==
               %{
                 affected_routes: MapSet.new(["Blue"]),
                 created_at: ~U[2021-05-05 00:41:37Z],
                 id: "126976",
                 service_effect: "Blue Line delay"
               }
    end

    test "parses a remove event payload" do
      event_data = ~s({"id":"126976","type":"alert"})

      assert Events.parse(event_data) ==
               %{
                 affected_routes: nil,
                 created_at: nil,
                 id: "126976",
                 service_effect: nil
               }
    end
  end
end
