defmodule SignsUi.Alerts.Alert do
  @moduledoc """
  Represents an alert.
  """

  @derive JSON.Encoder
  defstruct [:id, :created_at, :service_effect, :route]

  @type id :: String.t()
  @type route_type :: non_neg_integer()

  @type t :: %__MODULE__{
          id: id(),
          created_at: DateTime.t() | nil,
          service_effect: String.t() | nil,
          route: route_id() | nil
        }

  @type route_id :: String.t()

  @type multi_route :: %{
          id: id(),
          created_at: DateTime.t() | nil,
          service_effect: String.t() | nil,
          affected_routes: MapSet.t(route_id()) | nil,
          route_types: MapSet.t(route_type()) | nil
        }
end
