defmodule SignsUiWeb.SignsView do
  use SignsUiWeb, :view

  def sign_checkbox(id, enabled, f) do
    Phoenix.HTML.Form.checkbox(
      f,
      id,
      value: enabled,
      id: id,
      class: "col-md-1 col-xs-2 pull-right ios8-switch js-sign-toggle"
    )
  end

  def sign_label(id, name, enabled) do
    label_class = if !enabled, do: "text-muted col-md-11 col-xs-10", else: "col-md-11 col-xs-10"
    Phoenix.HTML.Tag.content_tag(:label, name, for: id, class: label_class)
  end
end
