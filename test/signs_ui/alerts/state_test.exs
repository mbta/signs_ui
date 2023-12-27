defmodule SignsUi.Alerts.StateTest do
  use ExUnit.Case, async: true
  import ExUnit.CaptureLog

  describe "handle_call :active_alert_ids" do
    test "returns the alert_ids out of the state" do
      state = %{
        alerts: %{
          "alert_id1" => %{affected_routes: MapSet.new(["Red"])},
          "alert_id2" => %{affected_routes: MapSet.new(["Red"])},
          "alert_id3" => %{affected_routes: MapSet.new(["Blue"])}
        }
      }

      assert SignsUi.Alerts.State.handle_call(:active_alert_ids, self(), state) ==
               {:reply, MapSet.new(["alert_id1", "alert_id2", "alert_id3"]), state}
    end

    test "safely returns an empty map set if there are no alerts" do
      state = %{alerts: %{}}

      assert SignsUi.Alerts.State.handle_call(:active_alert_ids, self(), state) ==
               {:reply, MapSet.new(), state}
    end
  end

  describe "parse/1" do
    test "handles a bad created_at" do
      event_data = """
      {"data": [{"attributes":{"active_period":[{"end":"2021-05-05T02:30:00-04:00","start":"2021-05-04T20:41:36-04:00"}],"banner":null,"cause":"UNKNOWN_CAUSE","created_at":"INVALID_CREATED_AT","description":null,"effect":"DELAY","header":"Blue Line experiencing delays of up to 10 minutes today","informed_entity":[{"activities":["BOARD","EXIT","RIDE"],"route":"Blue","route_type":1}],"lifecycle":"NEW","service_effect":"Blue Line delay","severity":3,"short_header":"Blue Line experiencing delays of up to 10 minutes today","timeframe":null,"updated_at":"2021-05-04T20:41:37-04:00","url":null},"id":"126976","links":{"self":"/alerts/126976"},"type":"alert"}]}
      """

      assert capture_log(fn -> SignsUi.Alerts.State.parse_response(event_data) end) =~
               "[error] Failed to parse created_at, reason=:invalid_format"

      assert SignsUi.Alerts.State.parse_response(event_data) ==
               [
                 %{
                   affected_routes: MapSet.new(["Blue"]),
                   created_at: nil,
                   id: "126976",
                   service_effect: "Blue Line delay"
                 }
               ]
    end

    test "parses an alerts data payload" do
      event_data = """
      {"data": [{"attributes":{"active_period":[{"end":"2021-05-05T02:30:00-04:00","start":"2021-05-04T20:41:36-04:00"}],"banner":null,"cause":"UNKNOWN_CAUSE","created_at":"2021-05-04T20:41:37-04:00","description":null,"effect":"DELAY","header":"Blue Line experiencing delays of up to 10 minutes today","informed_entity":[{"activities":["BOARD","EXIT","RIDE"],"route":"Blue","route_type":1}],"lifecycle":"NEW","service_effect":"Blue Line delay","severity":3,"short_header":"Blue Line experiencing delays of up to 10 minutes today","timeframe":null,"updated_at":"2021-05-04T20:41:37-04:00","url":null},"id":"126976","links":{"self":"/alerts/126976"},"type":"alert"}]}
      """

      assert SignsUi.Alerts.State.parse_response(event_data) ==
               [
                 %{
                   affected_routes: MapSet.new(["Blue"]),
                   created_at: ~U[2021-05-05 00:41:37Z],
                   id: "126976",
                   service_effect: "Blue Line delay"
                 }
               ]
    end
  end
end
