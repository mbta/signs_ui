defmodule SignsUi.Signs.Sign do
  @moduledoc """
  Represents a sign (ARINC zone) on the countdown viewer.
  """

  @enforce_keys [:station, :zone, :lines, :audios]
  defstruct @enforce_keys

  alias SignsUi.Messages.SignContent
  alias SignsUi.Signs.SignLine

  @type t :: %__MODULE__{
          station: String.t(),
          zone: String.t(),
          lines: %{integer() => SignLine.t()},
          audios: [SignsUi.Messages.Audio.t()]
        }

  @spec update_from_message(t(), SignContent.t()) :: t()
  def update_from_message(sign, %SignContent{} = msg) do
    put_in(
      sign,
      [Access.key(:lines), msg.line_number],
      SignLine.new_from_message(msg)
    )
  end

  @spec to_json(t()) :: %{sign_id: String.t(), lines: map(), audios: list()}
  def to_json(sign) do
    %{
      sign_id: "#{sign.station}-#{sign.zone}",
      lines:
        Map.new(sign.lines, fn {line_number, line} ->
          {line_number, SignLine.to_json(line)}
        end),
      audios:
        Enum.map(sign.audios, fn audio ->
          Map.from_struct(audio) |> Map.update!(:zones, &MapSet.to_list/1)
        end)
    }
  end
end
