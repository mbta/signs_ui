defmodule SignsUiWeb.SingleSignSocket do
  use Phoenix.Socket

  channel("signs:single", SignsUiWeb.SingleSignChannel)

  def connect(params, socket) do
    {:ok, assign(socket, :sign_id, params["sign_id"])}
  end

  def id(_socket), do: nil
end
