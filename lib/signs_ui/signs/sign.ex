defmodule SignsUI.Signs.Sign do
  require Logger

  @enforce_keys [:id, :config]
  defstruct @enforce_keys

  @type id :: String.t()

  @type expires_on :: DateTime.t() | nil

  @type auto :: %{
          mode: :auto
        }

  @type headway :: %{
          mode: :headway,
          expires: expires_on() | nil
        }

  @type off :: %{
          mode: :off,
          expires: expires_on() | nil
        }

  @type static_text :: %{
          mode: :static_text,
          line1: String.t(),
          line2: String.t(),
          expires: expires_on() | nil
        }

  @type t :: %__MODULE__{
          id: id(),
          config: auto() | headway() | off() | static_text()
        }

  @spec enabled?(t()) :: boolean()
  def enabled?(sign) do
    sign.config.mode == :auto
  end

  @spec new(String.t(), boolean()) :: t()
  def new(sign_id, enabled?)

  def new(id, true) do
    %__MODULE__{id: id, config: %{mode: :auto}}
  end

  def new(id, false) do
    %__MODULE__{id: id, config: %{mode: :off, expires: nil}}
  end

  @spec expiration_from_string(String.t() | nil) :: expires_on()
  defp expiration_from_string(expiration_string)
       when is_binary(expiration_string) do
    case DateTime.from_iso8601(expiration_string) do
      {:ok, expiration_dt, 0} ->
        expiration_dt

      _ ->
        Logger.warn("Invalid expiration time #{inspect(expiration_string)} received.")
        nil
    end
  end

  defp expiration_from_string(_), do: nil

  @spec from_json(String.t(), map()) :: t()
  def from_json(sign_id, %{"mode" => "auto"}) do
    %__MODULE__{id: sign_id, config: %{mode: :auto}}
  end

  def from_json(sign_id, %{"mode" => "headway"} = config) do
    %__MODULE__{
      id: sign_id,
      config: %{
        mode: :headway,
        expires: expiration_from_string(config["expires"])
      }
    }
  end

  def from_json(sign_id, %{"mode" => "off"} = config) do
    %__MODULE__{
      id: sign_id,
      config: %{
        mode: :off,
        expires: expiration_from_string(config["expires"])
      }
    }
  end

  def from_json(sign_id, %{"mode" => "static_text"} = config) do
    %__MODULE__{
      id: sign_id,
      config: %{
        mode: :static_text,
        line1: config["line1"],
        line2: config["line2"],
        expires: expiration_from_string(config["expires"])
      }
    }
  end

  @spec from_config(String.t(), map()) :: t()
  def from_config(sign_id, %{"mode" => "auto"}) do
    %__MODULE__{id: sign_id, config: %{mode: :auto}}
  end

  def from_config(sign_id, %{"mode" => "off", "expires" => expires}) do
    %__MODULE__{
      id: sign_id,
      config: %{
        mode: :off,
        expires: expires
      }
    }
  end

  def from_config(sign_id, %{"mode" => "headway", "expires" => expires}) do
    %__MODULE__{
      id: sign_id,
      config: %{
        mode: :headway,
        expires: expires
      }
    }
  end

  def from_config(sign_id, %{
        "mode" => "static_text",
        "expires" => expires,
        "line1" => line1,
        "line2" => line2
      }) do
    %__MODULE__{
      id: sign_id,
      config: %{
        mode: :static_text,
        expires: expires,
        line1: line1,
        line2: line2
      }
    }
  end

  @spec expiration_to_iso8601(expires_on()) :: String.t() | nil
  defp expiration_to_iso8601(%DateTime{} = dt), do: DateTime.to_iso8601(dt)
  defp expiration_to_iso8601(nil), do: nil

  @spec to_json(t()) :: map()
  def to_json(%__MODULE__{config: %{mode: :auto}} = sign) do
    %{
      "id" => sign.id,
      "mode" => "auto"
    }
  end

  def to_json(%__MODULE__{config: %{mode: :off}} = sign) do
    %{
      "id" => sign.id,
      "mode" => "off",
      "expires" => expiration_to_iso8601(sign.config.expires)
    }
  end

  def to_json(%__MODULE__{config: %{mode: :headway}} = sign) do
    %{
      "id" => sign.id,
      "mode" => "headway",
      "expires" => expiration_to_iso8601(sign.config.expires)
    }
  end

  def to_json(%__MODULE__{config: %{mode: :static_text}} = sign) do
    %{
      "id" => sign.id,
      "mode" => "static_text",
      "line1" => sign.config.line1,
      "line2" => sign.config.line2,
      "expires" => expiration_to_iso8601(sign.config.expires)
    }
  end
end
