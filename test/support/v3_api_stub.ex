defmodule SignsUi.V3ApiStub do
  @moduledoc """
  Stub implementation of the V3Api for testing.
  Configurable to return different responses.
  """

  def fetch_alerts do
    case Process.get(:v3_api_stub_response) do
      nil -> {:ok, []}
      response -> response
    end
  end

  @doc """
  Configure the stub to return a specific alerts data.
  """
  def will_return(alerts_data) do
    Process.put(:v3_api_stub_response, {:ok, alerts_data})
  end

  @doc """
  Reset the stub to return the default empty list.
  """
  def reset do
    Process.delete(:v3_api_stub_response)
  end
end
