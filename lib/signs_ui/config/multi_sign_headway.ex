defmodule SignsUi.Config.MultiSignHeadway do
  @moduledoc """
  Represents a headway range message set for an entire line / branch.
  """

  @enforce_keys [:range_low, :range_high]
  defstruct @enforce_keys

  @type t :: %__MODULE__{
          range_low: integer(),
          range_high: integer()
        }

  @spec from_json(map()) :: t()
  def from_json(%{"range_low" => range_low, "range_high" => range_high} = json_map) do
    %__MODULE__{
      range_low: range_low,
      range_high: range_high
    }
  end

  @spec to_json(t()) :: map()
  def to_json(%__MODULE__{
        range_low: range_low,
        range_high: range_high
      }) do
    %{
      "range_low" => range_low,
      "range_high" => range_high
    }
  end
end
