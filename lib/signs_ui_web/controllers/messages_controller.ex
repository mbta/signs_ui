defmodule SignsUiWeb.MessagesController do
  use SignsUiWeb, :controller

  alias SignsUi.Config.SignGroups
  alias SignsUi.Messages.SignContent
  alias SignsUi.Signs.State

  plug(:laboratory_features)

  @spec index(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def index(conn, _params) do
    signs = State.list_signs()
    alerts = SignsUi.Alerts.State.all()

    config = SignsUi.Config.State.get_all()

    sign_configs =
      config
      |> Map.get(:signs)
      |> Enum.map(fn {_id, sign} ->
        {sign.id, sign.config}
      end)
      |> Enum.into(%{})

    configured_headways =
      config
      |> Map.get(:configured_headways, %{})
      |> Map.new(fn {branch_id, periods} ->
        {branch_id,
         Map.new(periods, fn {period_id, config} -> {period_id, Map.from_struct(config)} end)}
      end)

    chelsea_bridge_announcements = Map.get(config, :chelsea_bridge_announcements, "off")
    sign_groups = config |> Map.fetch!(:sign_groups) |> SignGroups.by_route()
    sign_out_path = SignsUiWeb.Router.Helpers.auth_path(conn, :logout, "keycloak")

    conn
    |> put_layout(html: {SignsUiWeb.Layouts, :app})
    |> render(
      alerts: alerts,
      signs: signs,
      sign_configs: sign_configs,
      configured_headways: configured_headways,
      chelsea_bridge_announcements: chelsea_bridge_announcements,
      sign_groups: sign_groups,
      sign_out_path: sign_out_path,
      arinc_to_realtime_map: SignsUi.Config.Utilities.get_arinc_to_realtime_mapping()
    )
  end

  defp laboratory_features(conn, _) do
    laboratory_features =
      :laboratory
      |> Application.get_env(:features)
      |> Map.new(fn {key, _, _} -> {key, Laboratory.enabled?(conn, key)} end)

    assign(conn, :laboratory_features, laboratory_features)
  end

  def background(conn, _params) do
    with {:ok, zones} <- parse_zones(conn, "zones"),
         {station, zones} = decode_zones(zones),
         {:ok, visual_data} <- parse_visual_data(conn),
         {:ok, expiration} <- parse_expiration(conn) do
      expiration_time = DateTime.utc_now() |> DateTime.add(expiration)

      Enum.each([{:top, 1}, {:bottom, 2}], fn {key, line} ->
        :ok =
          %SignContent{
            station: station,
            zone: Enum.at(zones, 0),
            line_number: line,
            expiration: expiration_time,
            pages: Enum.map(visual_data.pages, &{&1[key], &1.duration})
          }
          |> State.process_message()
      end)

      send_resp(conn, 200, "")
    else
      # sobelow_skip ["XSS"]
      {:error, message} -> send_resp(conn, 400, message)
    end
  end

  def play(conn, _params) do
    with {:ok, zones} <- parse_zones(conn, "zones"),
         {station, zones} = decode_zones(zones),
         {:ok, visual_data} <- parse_visual_data(conn),
         {:ok, expiration} <- parse_expiration(conn) do
      %SignsUi.Messages.Audio{
        timestamp: DateTime.utc_now() |> DateTime.to_unix(:millisecond),
        visual_data: visual_data,
        zones: zones,
        station: station,
        expiration: expiration
      }
      |> State.process_message()

      send_resp(conn, 200, "")
    else
      {:error, message} -> send_resp(conn, 400, message)
    end
  end

  defp parse_zones(conn, key) do
    case Map.get(conn.params, key, []) do
      nil ->
        {:ok, MapSet.new()}

      zones when is_list(zones) ->
        if Enum.all?(zones, &is_binary/1) do
          {:ok, MapSet.new(zones)}
        else
          {:error, "invalid #{key}"}
        end

      _ ->
        {:error, "invalid #{key}"}
    end
  end

  defp decode_zones(zones) do
    case Enum.at(zones, 0) do
      nil ->
        {nil, MapSet.new()}

      zone ->
        {String.split(zone, "-") |> List.first(),
         MapSet.new(zones, &(String.split(&1, "-") |> List.last()))}
    end
  end

  defp parse_visual_data(conn) do
    case conn.params["visual_data"] do
      nil ->
        {:ok, nil}

      %{"pages" => pages} when is_list(pages) ->
        with {:ok, pages} <-
               Enum.reduce_while(pages, {:ok, []}, fn page, {:ok, pages} ->
                 case parse_page(page) do
                   {:ok, page} -> {:cont, {:ok, pages ++ [page]}}
                   {:error, message} -> {:halt, {:error, message}}
                 end
               end) do
          {:ok, %{pages: pages}}
        end

      _ ->
        {:error, "invalid visual_data"}
    end
  end

  defp parse_page(page) do
    case page do
      %{"top" => top, "bottom" => bottom, "duration" => duration}
      when is_binary(top) and is_binary(bottom) and is_integer(duration) ->
        {:ok, %{top: top, bottom: bottom, duration: duration}}

      _ ->
        {:error, "invalid page"}
    end
  end

  defp parse_expiration(conn) do
    case conn.params["expiration"] do
      num when is_integer(num) -> {:ok, num}
      _ -> {:error, "invalid expiration"}
    end
  end
end
