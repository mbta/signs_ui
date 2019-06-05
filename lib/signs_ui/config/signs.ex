defmodule SignsUi.Config.Signs do
  alias SignsUi.Config.Sign

  @spec format_signs_for_json(%{Sign.id() => Sign.t()}) :: map()
  def format_signs_for_json(signs) do
    Map.new(signs, fn {sign_id, sign} -> {sign_id, Sign.to_json(sign)} end)
  end
end
