defmodule SignsUiWeb.SignsController do
  use SignsUiWeb, :controller
  alias SignsUI.Signs

  def index(conn, params) do
    signs = SignsUI.Signs.State.get_all()

    render(
      conn,
      "index.html",
      signs: signs,
      sign_names: sign_names(params),
      route_name: route_name(params)
    )
  end

  def update(conn, params) do
    signs = params_to_signs(params)
    {:ok, conn} = perform_update(conn, signs)
    redirect(conn, to: "/")
  end

  def sign_names(%{"route" => "mattapan"}), do: Signs.Names.mattapan()
  def sign_names(%{"route" => "blue"}), do: Signs.Names.blue_line()
  def sign_names(%{"route" => "silver"}), do: Signs.Names.silver_line()
  def sign_names(%{"route" => "orange"}), do: Signs.Names.orange_line()
  def sign_names(%{"route" => "red"}), do: Signs.Names.red_line()

  def sign_names(_) do
    Signs.Names.red_line() ++
      Signs.Names.orange_line() ++
      Signs.Names.blue_line() ++ Signs.Names.mattapan() ++ Signs.Names.silver_line()
  end

  defp perform_update(conn, signs) do
    signs
    |> SignsUI.Signs.State.update()
    |> handle_update_response(conn)
  end

  defp handle_update_response(:ok, conn) do
    {:ok, put_flash(conn, :success, "Signs updated successfully")}
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
    updated_sign =
      case Map.get(enabled_map, sign_id) do
        nil -> sign
        enabled_value -> %{sign | enabled?: enabled_value}
      end

    {sign_id, updated_sign}
  end

  def route_name(%{"route" => "mattapan"}) do
    "Mattapan Line"
  end

  def route_name(%{"route" => "silver"}) do
    "Silver Line"
  end

  def route_name(%{"route" => "blue"}) do
    "Blue Line"
  end

  def route_name(%{"route" => "orange"}) do
    "Orange Line"
  end

  def route_name(%{"route" => "red"}) do
    "Red Line"
  end

  def route_name(_) do
    "All"
  end
end
