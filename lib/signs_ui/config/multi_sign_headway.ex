defmodule SignsUi.Config.MultiSignHeadway do
  @moduledoc """
  Represents a headway range message set for an entire line / branch.
  """

  @enforce_keys [:range_low, :range_high]
  defstruct @enforce_keys ++ [:non_platform_text_line1, :non_platform_text_line2]

  @type t :: %__MODULE__{
          range_low: integer(),
          range_high: integer(),
          non_platform_text_line1: String.t() | nil,
          non_platform_text_line1: String.t() | nil
        }

  @spec from_json(map()) :: t()
  def from_json(%{"range_low" => range_low, "range_high" => range_high} = json_map) do
    %__MODULE__{
      range_low: range_low,
      range_high: range_high,
      non_platform_text_line1: Map.get(json_map, "non_platform_text_line1"),
      non_platform_text_line2: Map.get(json_map, "non_platform_text_line2")
    }
  end

  @spec to_json(t()) :: map()
  def to_json(%__MODULE__{
        range_low: range_low,
        range_high: range_high,
        non_platform_text_line1: non_platform_text_line1,
        non_platform_text_line2: non_platform_text_line2
      }) do
    %{
      "range_low" => range_low,
      "range_high" => range_high,
      "non_platform_text_line1" => non_platform_text_line1,
      "non_platform_text_line2" => non_platform_text_line2
    }
  end
end
