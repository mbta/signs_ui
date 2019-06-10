defmodule SignsUi.Signs.SignLine do
  @moduledoc """
  Represents a line on a %Sign{}. Internal to Sign, and should only
  be interacted with through that module.
  """

  @enforce_keys [:expiration, :text]
  defstruct @enforce_keys

  @type page :: {String.t(), non_neg_integer()}

  @type t :: %__MODULE__{
          expiration: DateTime.t(),
          text: String.t() | [page]
        }

  def new_from_message(%SignsUi.Messages.SignContent{} = msg) do
    %__MODULE__{
      expiration: msg.expiration,
      text: message_text(msg.pages)
    }
  end

  def to_json(%__MODULE__{text: text} = line) when is_binary(text) do
    %{text: text, duration: line.expiration}
  end

  def to_json(%__MODULE__{text: pages} = line) do
    %{
      text: pages |> choose_page() |> page_text(),
      duration: line.expiration
    }
  end

  defp message_text([{text, _}]), do: text
  defp message_text([text]), do: text
  defp message_text(pages), do: pages

  defp choose_page([_away, _stopped, n]), do: n
  defp choose_page(pages), do: List.first(pages)

  def page_text({text, _exp}), do: text
  def page_text(text) when is_binary(text), do: text
end
