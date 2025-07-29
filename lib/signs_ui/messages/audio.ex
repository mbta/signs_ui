defmodule SignsUi.Messages.Audio do
  @moduledoc """
  Audio message, with optional visual content
  """

  @enforce_keys [:timestamp, :visual_data, :zones, :station, :expiration]
  defstruct @enforce_keys

  @type t :: %__MODULE__{
          timestamp: integer(),
          visual_data:
            %{pages: [%{top: String.t(), bottom: String.t(), duration: non_neg_integer()}]} | nil,
          zones: MapSet.t(String.t()),
          station: String.t(),
          expiration: integer()
        }
end
