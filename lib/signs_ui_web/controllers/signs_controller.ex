defmodule SignsUiWeb.SignsController do
  use SignsUiWeb, :controller

  def index(conn, _params) do
    signs = SignsUI.Signs.State.get_all()
    render conn, "index.html", signs: signs, sign_names: sign_names()
  end

  def update(conn, params) do
    signs = params_to_signs(params)
    {status, conn} = perform_update(conn, signs)
    case status do
      :ok -> redirect(conn, to: "/")
      :error -> render(conn, "index.html", signs: signs)
    end
  end

  def sign_names do
    [
      {"ashmont_mezzanine", "Ashmont Mezzanine"},
      {"cedar_grove_outbound", "Cedar Grove Outbound"},
      {"cedar_grove_inbound", "Cedar Grove Inbound"},
      {"butler_outbound", "Butler Outbound"},
      {"butler_inbound", "Butler Inbound"},
      {"milton_outbound", "Milton Outbound"},
      {"milton_inbound", "Milton Inbound"},
      {"central_avenue_outbound", "Central Avenue Outbound"},
      {"central_avenue_inbound", "Central Avenue Inbound"},
      {"valley_road_outbound", "Valley Road Outbound"},
      {"valley_road_inbound", "Valley Road Inbound"},
      {"capen_street_outbound", "Capen Street Outbound"},
      {"capen_street_inbound", "Capen Street Inbound"},
      {"chelsea_inbound", "Chelsea Inbound"},
      {"bellingham_square_inbound", "Bellingham Square Inbound"},
      {"bellingham_square_outbound", "Bellingham Square Outbound"},
      {"box_district_inbound", "Box District Inbound"},
      {"box_district_outbound", "Box District Outbound"},
      {"eastern_ave_inbound", "Eastern Ave Inbound"},
      {"eastern_ave_outbound", "Eastern Ave Outbound"},
      {"south_station_silver_line_outbound", "South Station Silver Line Outbound"},
      {"courthouse_station_outbound", "Courthouse Station Outbound"},
      {"world_trade_center_outbound", "World Trade Center Outbound"},
      {"world_trade_center_mezzanine", "World Trade Center Mezzanine"},
      {"courthouse_station_mezzanine", "Courthouse Station Mezzanine"},
      {"south_station_mezzanine", "South Station Mezzanine"}
    ]
  end

  defp perform_update(conn, signs) do
    signs
    |> SignsUI.Signs.State.update()
    |> handle_update_response(conn)
  end

  defp handle_update_response(:ok, conn) do
    {:ok, put_flash(conn, :success, "Signs updated successfully")}
  end
  defp handle_update_response(:error, conn) do
    {:error, put_flash(conn, :error, "Signs could not be updated, please try again.")}
  end

  defp get_enabled_map(%{"signs" => signs}) do
    Map.new(signs, fn {sign_id, value} -> {sign_id, value == "true"} end)
  end
  defp get_enabled_map(_params) do
    %{}
  end

  defp params_to_signs(params) do
    enabled_map = get_enabled_map(params)
    Map.new(SignsUI.Signs.State.get_all(), &do_params_to_signs(&1, enabled_map))
  end

  defp do_params_to_signs({sign_id, sign}, enabled_map) do
    {sign_id, %{sign | enabled?: Map.get(enabled_map, sign_id)}}
  end
end
