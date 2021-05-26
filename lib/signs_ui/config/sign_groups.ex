defmodule SignsUi.Config.SignGroups do
  @moduledoc """
  Represents the state of all current sign groups.
  """

  alias SignsUi.Alerts.Alert
  alias SignsUi.Config.SignGroup

  @type route_id() :: String.t()
  @type unix_time() :: String.t()
  @type t() :: %{route_id() => %{unix_time() => SignGroup.t()}}

  @doc """
  Returns all the active (not expired) groups.
  """
  @spec active(t(), DateTime.t(), MapSet.t(Alert.id())) :: {t(), [SignGroup.t()]}
  def active(sign_groups, current_time, alerts) do
    for {route, groups} <- sign_groups,
        {created_at, group} <- groups,
        SignGroup.expired?(group, current_time, alerts),
        reduce: {sign_groups, []} do
      {active, expired} ->
        {removed, updated} = pop_in(active[route][created_at])
        {updated, [removed | expired]}
    end
  end
end
