defmodule SignsUiWeb.SingleSignSocketTest do
  use SignsUiWeb.ChannelCase

  setup do
    %{socket: socket()}
  end

  describe "connect/2" do
    test "assigns sign_id to socket", %{socket: socket} do
      {:ok, %{assigns: %{sign_id: sign_id}}} =
        SignsUiWeb.SingleSignSocket.connect(%{"sign_id" => "ABCD-m"}, socket)

      assert "ABCD-m" === sign_id
    end
  end
end
