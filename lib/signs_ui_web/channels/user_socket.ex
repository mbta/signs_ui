defmodule SignsUiWeb.UserSocket do
  use Phoenix.Socket

  ## Channels
  channel("signs:all", SignsUiWeb.SignsChannel)
  channel("headways:all", SignsUiWeb.HeadwaysChannel)
  channel("chelseaBridgeAnnouncements:all", SignsUiWeb.ChelseaBridgeAnnouncementsChannel)
  channel("alerts:all", SignsUiWeb.AlertsChannel)
  channel("signGroups:all", SignsUiWeb.SignGroupsChannel)
  channel("time:all", SignsUiWeb.TimeChannel)

  # Socket params are passed from the client and can
  # be used to verify and authenticate a user. After
  # verification, you can put default assigns into
  # the socket that will be set for all channels, ie
  #
  #     {:ok, assign(socket, :user_id, verified_user_id)}
  #
  # To deny connection, return `:error`.
  #
  # See `Phoenix.Token` documentation for examples in
  # performing token verification on connect.
  def connect(%{"token" => token}, socket) do
    case Guardian.Phoenix.Socket.authenticate(socket, SignsUiWeb.AuthManager, token) do
      {:ok, authed_socket} -> {:ok, authed_socket}
      {:error, _reason} -> :error
    end
  end

  def connect(_params, _socket), do: :error

  # Socket id's are topics that allow you to identify all sockets for a given user:
  #
  #     def id(socket), do: "user_socket:#{socket.assigns.user_id}"
  #
  # Would allow you to broadcast a "disconnect" event and terminate
  # all active sockets and channels for a given user:
  #
  #     SignsUiWeb.Endpoint.broadcast("user_socket:#{user.id}", "disconnect", %{})
  #
  # Returning `nil` makes this socket anonymous.
  def id(_socket), do: nil
end
