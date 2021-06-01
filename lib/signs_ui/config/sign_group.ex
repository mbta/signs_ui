defmodule SignsUi.Config.SignGroup do
  @moduledoc """
  Represents a sign group.
  """

  require Logger
  alias SignsUi.Alerts.Alert
  alias SignsUi.Config.Sign

  @derive Jason.Encoder
  @enforce_keys [:route_id]
  defstruct [:line1, :line2, :expires, :alert_id, :route_id, sign_ids: []]

  @type t() :: %__MODULE__{
          sign_ids: [Sign.id()],
          line1: String.t() | nil,
          line2: String.t() | nil,
          expires: DateTime.t() | nil,
          alert_id: Alert.id() | nil
        }

  @spec expired?(t(), DateTime.t(), MapSet.t(Alert.id())) :: boolean()
  def expired?(%{expires: expiration, alert_id: alert_id}, _current_time, _alerts)
      when is_nil(expiration) and is_nil(alert_id) do
    false
  end

  def expired?(%{expires: expiration}, current_time, _alerts)
      when not is_nil(expiration) do
    DateTime.compare(current_time, expiration) != :lt
  end

  def expired?(%{alert_id: alert_id}, _current_time, alerts)
      when not is_nil(alert_id) do
    not MapSet.member?(alerts, alert_id)
  end

  @spec from_json(%{String.t() => any()}) :: t()
  def from_json(map) do
    %__MODULE__{
      sign_ids: map["sign_ids"],
      route_id: map["route_id"],
      line1: map["line1"],
      line2: map["line2"],
      expires: expiration_from_iso8601(map["expires"]),
      alert_id: map["alert_id"]
    }
  end

  @spec expiration_from_iso8601(String.t() | nil) :: DateTime.t() | nil
  defp expiration_from_iso8601(nil), do: nil

  defp expiration_from_iso8601(expiration) do
    case DateTime.from_iso8601(expiration) do
      {:ok, dt, 0} ->
        dt

      _ ->
        Logger.warning("Invalid sign group expiration time #{inspect(expiration)} received.")
        nil
    end
  end
end
