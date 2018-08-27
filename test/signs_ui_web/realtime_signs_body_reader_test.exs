defmodule SignsUiWeb.RealtimeSignsBodyReaderTest do
  use ExUnit.Case, async: true
  use Phoenix.ConnTest

  describe "read_body/2" do
    test "changes repeated elements to an array" do
      conn = build_conn(:put, "/", "foo=bar&foo=baz")
      {:ok, params, conn} = RealtimeSignsBodyReader.read_body(conn, [])
      assert params == "foo[]=baz&foo[]=bar"
    end

    test "leaves single elements alone" do
      conn = build_conn(:put, "/", "foo=bar")
      {:ok, params, conn} = RealtimeSignsBodyReader.read_body(conn, [])
      assert params == "foo=bar"
    end
  end
end
