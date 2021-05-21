defmodule SignsUi.Config.SignGroup do
  @moduledoc """
  Represents a sign group.
  """

  alias SignsUi.Alerts.Alert
  alias SignsUi.Config.Sign

  @derive Jason.Encoder
  defstruct [:line1, :line2, :expires, :alert_id, sign_ids: []]

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
end
