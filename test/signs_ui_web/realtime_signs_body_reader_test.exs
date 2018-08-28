defmodule SignsUiWeb.RealtimeSignsBodyReaderTest do
  use ExUnit.Case, async: true
  use Phoenix.ConnTest

  describe "read_body/2" do
    test "changes repeated elements to an array" do
      conn = build_conn(:put, "/", "foo=bar&foo=baz")
      {:ok, params, _conn} = RealtimeSignsBodyReader.read_body(conn, [])
      assert params == "foo[]=baz&foo[]=bar"
    end

    test "leaves single elements alone" do
      conn = build_conn(:put, "/", "foo=bar")
      {:ok, params, _conn} = RealtimeSignsBodyReader.read_body(conn, [])
      assert params == "foo=bar"
    end

    test "handles both single elements and list elements" do
      conn = build_conn(:put, "/", "foo=bar&baz=1&baz=2")
      {:ok, params, _conn} = RealtimeSignsBodyReader.read_body(conn, [])
      elements = String.split(params, "&")
      assert "baz[]=1" in elements
      assert "baz[]=2" in elements
      assert "foo=bar" in elements
    end

    test "doesn't double encode equals signs for base64-encoded tokens" do
      conn = build_conn(:put, "/", "_csrf_token=2rJcUflcfXZ9%2FiA%3D%3D")
      {:ok, params, _conn} = RealtimeSignsBodyReader.read_body(conn, [])
      assert params == "_csrf_token=2rJcUflcfXZ9%2FiA%3D%3D"
    end
  end
end
