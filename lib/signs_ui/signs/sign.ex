defmodule SignsUI.Signs.Sign do
  defstruct id: "",
            enabled?: false

  @type id :: String.t()

  @type t :: %__MODULE__{
          id: id(),
          enabled?: boolean()
        }

  def from_json(sign_id, values) do
    %__MODULE__{
      id: sign_id,
      enabled?: Map.get(values, "enabled")
    }
  end
end
