defmodule SignsUi.Messages.SignContent do
  @moduledoc """
  Represents an incoming MsgType=SignContent from realtime_signs. Parses
  the request into a struct, so that it can be consumed downstream to
  update a %Signs.Sign{}.
  """

  import NimbleParsec

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

  page_text =
    ignore(string("-"))
    |> ignore(string("\""))
    |> optional(ascii_string([?a..?z, ?A..?Z, ?0..?9, ?/, ?', ?\s, ?,, ?!, ?@, ?+], min: 1))
    |> ignore(string("\""))
    |> optional(
      ignore(string("."))
      |> integer(min: 1)
    )
    |> tag(:page_text)

  command =
    ignore(string("e"))
    |> integer(min: 1)
    |> ignore(string("~"))
    |> ascii_string([?n, ?s, ?e, ?w, ?m, ?c], 1)
    |> integer(1)
    |> times(page_text, min: 1)

  # Generate a parser, for ARINC-formatted commands. See the docs in
  # realtime_signs for what the components mean. Examples are:
  #
  # e145~w1-"Riverside      BRD"
  # with expiration of 145 seconds from now, west zone, line 1
  #
  # or
  #
  # e145~s2-"Frst Hills    away".2-"Frst Hills Stopped".5-"Frst Hills 8 stops".2
  # which is a paginated message, with page durations of 2, 5, and 2 seconds.
  defparsec(:parse_command, command)

  @spec new(String.t(), String.t(), DateTime.t()) :: {:ok, t()} | {:error, any()}
  def new(station, command, now \\ Timex.now()) when is_binary(station) do
    case parse_command(command) do
      {:ok, [exp_sec, zone, line_number | pages], _rest, _ctx, _line, _col} ->
        {:ok,
         %__MODULE__{
           station: station,
           zone: zone,
           line_number: line_number,
           expiration: Timex.shift(now, seconds: exp_sec),
           pages: get_pages(pages)
         }}

      _ ->
        {:error, :could_not_parse}
    end
  end

  @spec get_pages([{:page_text, [any()]}]) :: [page()]
  defp get_pages(pages) do
    Enum.map(pages, fn
      {:page_text, [text, duration]} -> {text, duration}
      {:page_text, [text]} -> text
      {:page_text, []} -> ""
    end)
  end

  @spec page_to_text(page()) :: String.t()
  def page_to_text({text, _duration}), do: text
  def page_to_text(text), do: text
end
