defmodule SignsUiWeb.RealtimeSignsBodyReaderTest do
  use ExUnit.Case, async: true
  use Phoenix.ConnTest

  describe "read_body/2" do
    test "changes c params to c[]" do
      conn = build_conn(:put, "/", "c=bar&c=baz")
      {:ok, params, _conn} = RealtimeSignsBodyReader.read_body(conn, [])
      assert params == "c[]=bar&c[]=baz"
    end

    test "leaves single elements alone" do
      conn = build_conn(:put, "/", "foo=bar")
      {:ok, params, _conn} = RealtimeSignsBodyReader.read_body(conn, [])
      assert params == "foo=bar"
    end

    test "handles both c's and other elements" do
      conn = build_conn(:put, "/", "foo=bar&c=1&c=2")
      {:ok, params, _conn} = RealtimeSignsBodyReader.read_body(conn, [])
      elements = String.split(params, "&")
      assert "c[]=1" in elements
      assert "c[]=2" in elements
      assert "foo=bar" in elements
    end

    test "leaves other duplicates (e.g. Phoenix checkboxes) in the same order" do
      conn = build_conn(:put, "/", "foo=false&foo=true")
      {:ok, params, _conn} = RealtimeSignsBodyReader.read_body(conn, [])
      assert params == "foo=false&foo=true"
    end

    test "doesn't double encode equals signs for base64-encoded tokens" do
      conn = build_conn(:put, "/", "_csrf_token=2rJcUflcfXZ9%2FiA%3D%3D")
      {:ok, params, _conn} = RealtimeSignsBodyReader.read_body(conn, [])
      assert params == "_csrf_token=2rJcUflcfXZ9%2FiA%3D%3D"
    end
  end
end
