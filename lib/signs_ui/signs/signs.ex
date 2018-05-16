defmodule SignsUI.Signs.Signs do

  def update_enabled_flags(enabled_values, signs) do
    Map.new(signs, fn {sign_id, sign} -> {sign_id, %{sign | enabled?: enabled_values[sign_id]}} end)
  end
end
