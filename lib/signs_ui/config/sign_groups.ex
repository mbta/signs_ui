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
      {current, expired} ->
        {removed, updated} = pop_in(current[route][created_at])
        {updated, [removed | expired]}
    end
  end

  @spec from_json(%{route_id() => %{unix_time() => %{String.t() => any()}}}) :: t()
  def from_json(map) do
    for {route, groups} <- map, into: %{} do
      {route, Map.new(groups, fn {time, group} -> {time, SignGroup.from_json(group)} end)}
    end
  end
end
