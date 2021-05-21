defmodule SignsUiWeb.MessagesController do
  require Logger
  use SignsUiWeb, :controller

  alias SignsUi.Messages.SignContent
  alias SignsUi.Signs.State

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
    sign_groups = Map.fetch!(config, :sign_groups)
    sign_out_path = SignsUiWeb.Router.Helpers.auth_path(conn, :logout, "cognito")

    render(conn, "index.html",
      alerts: alerts,
      signs: signs,
      sign_configs: sign_configs,
      configured_headways: configured_headways,
      chelsea_bridge_announcements: chelsea_bridge_announcements,
      sign_groups: sign_groups,
      sign_out_path: sign_out_path
    )
  end

  @spec create(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def create(conn, %{"MsgType" => "SignContent", "c" => commands, "sta" => station} = _params) do
    Enum.each(commands, fn command_string ->
      with {:ok, sign_content} <- SignContent.new(station, command_string),
           :ok <- State.process_message(sign_content) do
        :ok
      else
        _err ->
          Logger.warn("could_not_process command #{inspect(command_string)}")
      end
    end)

    send_resp(conn, 201, "")
  end

  def create(conn, _params) do
    send_resp(conn, 201, "Ignoring unknown message.")
  end
end
