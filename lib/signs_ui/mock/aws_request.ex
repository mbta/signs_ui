defmodule SignsUI.Mock.AwsRequest do
  def request(%{http_method: :put} = put_object) do
    {:ok, put_object}
  end

  def request(%{http_method: :get}) do
    signs = %{
      "ashmont_mezzanine" => %{"enabled" => true},
      "cedar_grove_outbound" => %{"enabled" => true},
      "cedar_grove_inbound" => %{"enabled" => true},
      "butler_outbound" => %{"enabled" => true},
      "butler_inbound" => %{"enabled" => true},
      "maverick_eastbound" => %{"enabled" => true},
      "maverick_westbound" => %{"enabled" => true},
      "eastern_ave_inbound" => %{"enabled" => true},
      "eastern_ave_outbound" => %{"enabled" => true},
      "forest_hills_mezzanine_northbound" => %{"enabled" => true},
      "forest_hills_northbound" => %{"enabled" => true},
      "forest_hills_southbound" => %{"enabled" => true},
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
    }

    {:ok, %{body: Poison.encode!(signs)}}
  end
end
