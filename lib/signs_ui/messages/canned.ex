defmodule SignsUi.Messages.Canned do
  @moduledoc "Canned audio message"

  @enforce_keys [:timestamp, :message_id, :vars, :av_type, :station, :zones, :timeout]
  defstruct @enforce_keys

  @type t :: %__MODULE__{
          timestamp: integer(),
          message_id: String.t(),
          vars: [String.t()],
          av_type: :audio | :visual | :audio_visual,
          station: String.t(),
          zones: [String.t()],
          timeout: integer()
        }

  def parse(%{
        "mid" => message_id,
        "var" => vars,
        "typ" => av_type_code,
        "sta" => station_and_zones,
        "tim" => timeout
      }) do
    {station, zones} = Utilities.Common.parse_station_and_zones(station_and_zones)

    %__MODULE__{
      timestamp: DateTime.utc_now() |> DateTime.to_unix(:millisecond),
      message_id: message_id,
      vars: String.split(vars, ","),
      av_type: Utilities.Common.parse_av_type(av_type_code),
      station: station,
      zones: zones,
      timeout: String.to_integer(timeout) * 1000
    }
  end
end
