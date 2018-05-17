defmodule SignsUI.Signs.Signs do

  def format_signs_for_json(signs) do
    Map.new(signs, fn {sign_id, sign} -> {sign_id, %{"enabled" => sign.enabled?}} end)
  end
end
