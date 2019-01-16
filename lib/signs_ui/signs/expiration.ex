defmodule SignsUI.Signs.Expiration do
  @moduledoc """
  Handle cleaning up settings in the configuration that have since expired
  """

  @type state :: %{
    time_fetcher :: (() -> DateTime.t())
  }

  @spec start_link(map()) :: on_start()
  def start_link(opts \\ []) do
    name = opts[:name] || __MODULE__
    time_fetcher = opts[:time_fetcher] || fn -> DateTime.utc_now() end

    GenServer.start_link(__MODULE__, %{ time_fetcher: time_fetcher }, name: name)
  end
end
