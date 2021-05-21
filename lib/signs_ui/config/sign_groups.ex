defmodule SignsUi.Config.SignGroups do
  alias SignsUi.Alerts.Alert
  alias SignsUi.Config.SignGroup

  @type route_id() :: String.t()
  @type unix_time() :: String.t()
  @type t() :: %{route_id() => %{unix_time() => SignGroup.t()}}

  @spec active(t(), DateTime.t(), MapSet.t(Alert.id())) :: t()
  def active(sign_groups, current_time, alerts) do
    for {route, groups} <- sign_groups,
        {created_at, group} <- groups,
        SignGroup.expired?(group, current_time, alerts),
        reduce: sign_groups do
      acc -> Map.update(acc, route, nil, &Map.delete(&1, created_at))
    end
  end
end
