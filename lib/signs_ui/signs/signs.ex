defmodule SignsUI.Signs.Signs do
  alias SignsUI.Signs.Sign

  def update_enabled_flags(enabled_values, signs) do
    Map.new(signs, fn {sign_id, sign} -> {sign_id, Sign.update_enabled(sign, enabled_values[sign_id])} end)
  end
end
