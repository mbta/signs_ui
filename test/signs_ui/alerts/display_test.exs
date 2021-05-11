defmodule SignsUi.Alerts.DisplayTest do
  use ExUnit.Case, async: true
  alias SignsUi.Alerts.Alert
  alias SignsUi.Alerts.Display

  describe "format_state/1" do
    test "formats a state map" do
      created_at = DateTime.new!(~D[2021-05-11], ~T[18:49:28], "Etc/UTC")

      state = %{
        "some_id" => %{
          id: "some_id",
          created_at: created_at,
          service_effect: "delayed trains on the Red, Orange, and Blue lines",
          affected_routes: ["Red", "Orange", "Blue"]
        },
        "some_other_id" => %{
          id: "some_other_id",
          created_at: created_at,
          service_effect: "delays on the Green-D and Orange line",
          affected_routes: ["Green-D", "Orange"]
        }
      }

      assert Display.format_state(state) == %{
               "Blue" => %{
                 "some_id" => %Alert{
                   created_at: ~U[2021-05-11 18:49:28Z],
                   id: "some_id",
                   route: "Blue",
                   service_effect: "delayed trains on the Red, Orange, and Blue lines"
                 }
               },
               "Green-D" => %{
                 "some_other_id" => %Alert{
                   created_at: ~U[2021-05-11 18:49:28Z],
                   id: "some_other_id",
                   route: "Green-D",
                   service_effect: "delays on the Green-D and Orange line"
                 }
               },
               "Orange" => %{
                 "some_id" => %Alert{
                   created_at: ~U[2021-05-11 18:49:28Z],
                   id: "some_id",
                   route: "Orange",
                   service_effect: "delayed trains on the Red, Orange, and Blue lines"
                 },
                 "some_other_id" => %Alert{
                   created_at: ~U[2021-05-11 18:49:28Z],
                   id: "some_other_id",
                   route: "Orange",
                   service_effect: "delays on the Green-D and Orange line"
                 }
               },
               "Red" => %{
                 "some_id" => %Alert{
                   created_at: ~U[2021-05-11 18:49:28Z],
                   id: "some_id",
                   route: "Red",
                   service_effect: "delayed trains on the Red, Orange, and Blue lines"
                 }
               }
             }
    end
  end
end
