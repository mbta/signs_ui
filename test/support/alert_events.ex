defmodule Test.Support.AlertEvents do
  alias ServerSentEventStage.Event

  def initial_state() do
    %Event{
      data: """
      [{"attributes":{"active_period":[{"end":"2021-05-05T02:30:00-04:00","start":"2021-05-04T20:41:36-04:00"}],"banner":null,"cause":"UNKNOWN_CAUSE","created_at":"2021-05-04T20:41:37-04:00","description":null,"effect":"DELAY","header":"Blue Line experiencing delays of up to 10 minutes today","informed_entity":[{"activities":["BOARD","EXIT","RIDE"],"route":"Blue","route_type":1}],"lifecycle":"NEW","service_effect":"Blue Line delay","severity":3,"short_header":"Blue Line experiencing delays of up to 10 minutes today","timeframe":null,"updated_at":"2021-05-04T20:41:37-04:00","url":null},"id":"126976","links":{"self":"/alerts/126976"},"type":"alert"}]
      """,
      event: "reset"
    }
  end

  def add_red_orange() do
    %Event{
      data: """
      {"attributes":{"active_period":[{"end":"2021-05-04T02:30:00-04:00","start":"2021-05-04T20:43:07-04:00"}],"banner":null,"cause":"UNKNOWN_CAUSE","created_at":"2021-05-04T20:43:09-04:00","description":null,"effect":"DELAY","header":"Orange Line and Red Line experiencing delays of up to 10 minutes","informed_entity":[{"activities":["BOARD","EXIT","RIDE"],"route":"Orange","route_type":1},{"activities":["BOARD","EXIT","RIDE"],"route":"Red","route_type":1}],"lifecycle":"NEW","service_effect":"Orange Line and Red Line delay","severity":3,"short_header":"Orange Line and Red Line experiencing delays of up to 10 minutes","timeframe":null,"updated_at":"2021-05-04T20:43:09-04:00","url":null},"id":"126977","links":{"self":"/alerts/126977"},"type":"alert"}
      """,
      event: "add"
    }
  end

  def update_red_orange() do
    %Event{
      data: """
      {"attributes":{"active_period":[{"end":"2021-05-05T02:30:00-04:00","start":"2021-05-04T20:43:07-04:00"}],"banner":null,"cause":"UNKNOWN_CAUSE","created_at":"2021-05-04T20:43:09-04:00","description":null,"effect":"DELAY","header":"Orange Line and Red Line experiencing delays of up to 10 minutes","informed_entity":[{"activities":["BOARD","EXIT","RIDE"],"route":"Red","route_type":1}],"lifecycle":"NEW","service_effect":"Red Line delay","severity":3,"short_header":"Orange Line and Red Line experiencing delays of up to 10 minutes","timeframe":null,"updated_at":"2021-05-04T20:50:43-04:00","url":null},"id":"126977","links":{"self":"/alerts/126977"},"type":"alert"}
      """,
      event: "update"
    }
  end

  def remove_red() do
    %Event{
      data: """
      {"id":"126977","type":"alert"}
      """,
      event: "remove"
    }
  end

  def remove_blue() do
    %Event{
      data: """
      {"id":"126976","type":"alert"}
      """,
      event: "remove"
    }
  end
end
