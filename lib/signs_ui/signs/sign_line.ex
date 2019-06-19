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
          text: [page]
        }

  def new_from_message(%SignsUi.Messages.SignContent{} = msg) do
    %__MODULE__{
      expiration: msg.expiration,
      text: Enum.map(msg.pages, &normalize_page/1)
    }
  end

  def to_json(%__MODULE__{text: pages} = line) do
    %{
      text: Enum.map(pages, &page_to_json/1),
      expiration: line.expiration
    }
  end

  defp normalize_page({text, duration}), do: {text, duration}
  defp normalize_page(text) when is_binary(text), do: {text, 5}

  defp page_to_json({text, duration}), do: %{content: text, duration: duration}
end
