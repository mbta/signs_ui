defmodule SignsUi.Mock.AwsRequest do
  @moduledoc false

  def request(%{http_method: :put} = put_object) do
    {:ok, put_object}
  end

  def request(%{http_method: :get}) do
    config = %{
      "signs" => %{
        "ashmont_mezzanine" => %{"mode" => "auto"},
        "cedar_grove_outbound" => %{"mode" => "auto"},
        "cedar_grove_inbound" => %{"mode" => "auto"},
        "butler_outbound" => %{"mode" => "auto"},
        "butler_inbound" => %{"mode" => "auto"},
        "maverick_eastbound" => %{"mode" => "auto"},
        "maverick_westbound" => %{"mode" => "auto"},
        "eastern_ave_inbound" => %{"mode" => "auto"},
        "eastern_ave_outbound" => %{"mode" => "auto"},
        "forest_hills_mezzanine_northbound" => %{"mode" => "auto"},
        "forest_hills_northbound" => %{"mode" => "auto"},
        "forest_hills_southbound" => %{"mode" => "auto"},
        "harvard_northbound" => %{
          "mode" => "static_text",
          "line1" => "test",
          "line2" => "message",
          "expires" => "2019-01-15T12:00:00Z"
        },
        "harvard_southbound" => %{
          "mode" => "static_text",
          "line1" => "test",
          "line2" => "message",
          "expires" => "2019-01-15T14:00:00Z"
        },
        "central_southbound" => %{
          "mode" => "static_text",
          "line1" => "test",
          "line2" => "message",
          "expires" => nil
        }
      },
      "configured_headways" => %{
        "red_trunk" => %{
          "peak" => %{
            "range_low" => 8,
            "range_high" => 10
          }
        }
      },
      "chelsea_bridge_announcements" => "auto",
      "sign_groups" => %{}
    }

    {:ok, %{body: Jason.encode!(config)}}
  end
end
