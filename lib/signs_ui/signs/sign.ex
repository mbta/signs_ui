defmodule SignsUI.Signs.Sign do
  defstruct [
    id: "",
    disabled?: false
  ]

  def from_json(sign_id, values) do
    %__MODULE__{
      id: sign_id,
      disabled?: Map.get(values, "disabled")
    }
  end
end
