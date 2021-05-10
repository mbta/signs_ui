defmodule SignsUi.Alerts.Alert do
  @moduledoc """
  Represents an alert.
  """

  @derive Jason.Encoder
  defstruct [:id, :created_at, :service_effect]

  @type id :: String.t()

  @type t :: %__MODULE__{
          id: id(),
          created_at: DateTime.t() | nil,
          service_effect: String.t() | nil
        }
end
