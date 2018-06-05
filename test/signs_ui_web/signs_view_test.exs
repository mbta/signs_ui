defmodule SignsUiWeb.SignsViewTest do
  use ExUnit.Case

  describe "sign_checkbox/3" do
    test "makes a checkbox with the given id and checked value for the given form" do
      form = Phoenix.HTML.Form.form_for(%Plug.Conn{}, "/", fn f ->
        SignsUiWeb.SignsView.sign_checkbox("abc", true, f)
      end)
      assert Phoenix.HTML.safe_to_string(form) =~ "id=\"abc\""
      assert Phoenix.HTML.safe_to_string(form) =~ "checked"
    end

    test "makes a checkbox with the given id and unchecked value for the given form" do
      form = Phoenix.HTML.Form.form_for(%Plug.Conn{}, "/", fn f ->
        SignsUiWeb.SignsView.sign_checkbox("abc", false, f)
      end)
      assert Phoenix.HTML.safe_to_string(form) =~ "id=\"abc\""
      refute Phoenix.HTML.safe_to_string(form) =~ "checked"
    end
  end

  describe "sign_label/3" do
    test "mutes the text when its not enabled" do
      label = SignsUiWeb.SignsView.sign_label("abc", "Alpha Bet City", false)
      assert Phoenix.HTML.safe_to_string(label) =~ "text-muted"
    end

    test "does not mute the text when its enabled" do
      label = SignsUiWeb.SignsView.sign_label("abc", "Alpha Bet City", true)
      refute Phoenix.HTML.safe_to_string(label) =~ "text-muted"
    end

    test "includes the for and name" do
      label = SignsUiWeb.SignsView.sign_label("abc", "Alpha Bet City", true)
      assert Phoenix.HTML.safe_to_string(label) =~ "for=\"abc\""
      assert Phoenix.HTML.safe_to_string(label) =~ "Alpha Bet City"
    end
  end
end
