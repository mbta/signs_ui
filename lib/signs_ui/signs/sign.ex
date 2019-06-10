defmodule SignsUi.Signs.Sign do
  @moduledoc """
  Represents a sign (ARINC zone) on the countdown viewer.
  """

  @enforce_keys [:station, :zone]
  defstruct [:station, :zone, lines: %{}]

  alias SignsUi.Signs.SignLine
  alias SignsUi.Messages.SignContent

  @type t :: %__MODULE__{
          station: String.t(),
          zone: String.t(),
          lines: %{integer() => SignLine.t()}
        }

  @spec new_from_message(SignContent.t()) :: t()
  def new_from_message(%SignContent{} = msg) do
    %__MODULE__{
      station: msg.station,
      zone: msg.zone,
      lines: %{
        msg.line_number => SignLine.new_from_message(msg)
      }
    }
  end

  @spec update_from_message(t(), SignContent.t()) :: t()
  def update_from_message(sign, %SignContent{} = msg) do
    put_in(
      sign,
      [Access.key(:lines), msg.line_number],
      SignLine.new_from_message(msg)
    )
  end

  @spec to_json(t()) :: [map()]
  def to_json(sign) do
    Enum.map([1, 2], fn line_number ->
      case sign.lines[line_number] do
        nil ->
          %{text: "", duration: Timex.now()}

        %SignLine{} = line ->
          SignLine.to_json(line)
      end
    end)
  end
end
