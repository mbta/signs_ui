defmodule SignsUiWeb.ConnCase do
  @moduledoc """
  This module defines the test case to be used by
  tests that require setting up a connection.

  Such tests rely on `Phoenix.ConnTest` and also
  import other functionality to make it easier
  to build common datastructures and query the data layer.

  Finally, if the test case interacts with the database,
  it cannot be async. For this reason, every test runs
  inside a transaction which is reset at the beginning
  of the test unless the test case is marked as async.
  """

  use ExUnit.CaseTemplate
  import Plug.Test

  using do
    quote do
      # Import conveniences for testing with connections
      use Phoenix.ConnTest
      import SignsUiWeb.Router.Helpers

      # The default endpoint for testing
      @endpoint SignsUiWeb.Endpoint
    end
  end

  setup tags do
    {conn, user} =
      if tags[:authenticated] do
        current_time = DateTime.utc_now() |> DateTime.to_unix()

        user = %{
          username: "test_user",
          expiration: current_time + 1_000
        }

        conn =
          Phoenix.ConnTest.build_conn()
          |> init_test_session(%{})
          |> Guardian.Plug.sign_in(SignsUiWeb.AuthManager, user)

        {conn, user}
      else
        {Phoenix.ConnTest.build_conn(), nil}
      end

    {:ok, %{conn: conn, user: user}}
  end
end
