defmodule SignsUI.Signs.Sign do
  defstruct [
    id: "",
    enabled?: false
  ]

  def from_json(sign_id, values) do
    %__MODULE__{
      id: sign_id,
      enabled?: Map.get(values, "enabled")
    }
  end

  def update_enabled(sign, enabled_string) do
    enabled? = enabled_string == "true"
    %{sign | enabled?: enabled?}
  end
end
