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

  def empty do
    %__MODULE__{
      sign_ids: [],
      line1: nil,
      line2: nil,
      expires: nil,
      alert_id: nil
    }
  end
end
