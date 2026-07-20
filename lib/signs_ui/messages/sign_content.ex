defmodule SignsUi.Messages.SignContent do
  @moduledoc """
  Represents a line of content displayed on a sign
  """

  @enforce_keys [:station, :zone, :line_number, :expiration, :pages]
  defstruct @enforce_keys

  @type page :: String.t() | {String.t() | non_neg_integer()}

  @type t :: %__MODULE__{
          station: String.t(),
          zone: String.t(),
          line_number: 1 | 2,
          expiration: DateTime.t(),
          pages: [page()]
        }
end
