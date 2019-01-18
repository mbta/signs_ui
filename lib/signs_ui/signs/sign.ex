defmodule SignsUI.Signs.Sign do
  @enforce_keys [:id, :config]
  defstruct @enforce_keys

  @type id :: String.t()

  # ISO 8601 in UTC
  @type expires_on :: String.t()

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

  @spec from_json(String.t(), map()) :: t()
  def from_json(sign_id, %{"mode" => "auto"}) do
    %__MODULE__{id: sign_id, config: %{mode: :auto}}
  end

  def from_json(sign_id, %{"mode" => "headway"} = config) do
    %__MODULE__{
      id: sign_id,
      config: %{
        mode: :headway,
        expires: config["expires"]
      }
    }
  end

  def from_json(sign_id, %{"mode" => "off"} = config) do
    %__MODULE__{
      id: sign_id,
      config: %{
        mode: :off,
        expires: config["expires"]
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
        expires: config["expires"]
      }
    }
  end

  def from_json(sign_id, %{"enabled" => true}) do
    %__MODULE__{
      id: sign_id,
      config: %{
        mode: :auto
      }
    }
  end

  def from_json(sign_id, %{"enabled" => false}) do
    %__MODULE__{
      id: sign_id,
      config: %{
        mode: :off,
        expires: nil
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

  @spec to_json(t()) :: map()
  def to_json(%__MODULE__{config: %{mode: :auto}} = sign) do
    %{
      "id" => sign.id,
      "mode" => "auto",
      "enabled" => true
    }
  end

  def to_json(%__MODULE__{config: %{mode: :off}} = sign) do
    %{
      "id" => sign.id,
      "mode" => "off",
      "enabled" => false,
      "expires" => sign.config.expires
    }
  end

  def to_json(%__MODULE__{config: %{mode: :headway}} = sign) do
    %{
      "id" => sign.id,
      "mode" => "headway",
      "enabled" => false,
      "expires" => sign.config.expires
    }
  end

  def to_json(%__MODULE__{config: %{mode: :static_text}} = sign) do
    %{
      "id" => sign.id,
      "mode" => "static_text",
      "enabled" => false,
      "line1" => sign.config.line1,
      "line2" => sign.config.line2,
      "expires" => sign.config.expires
    }
  end
end
