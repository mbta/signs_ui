defmodule SignsUi.Config.SignGroups do
  @moduledoc """
  Represents the state of all current sign groups.
  """

  alias SignsUi.Alerts.Alert
  alias SignsUi.Config.SignGroup

  @type route_id() :: String.t()
  @type unix_time() :: String.t()
  @type t() :: %{unix_time() => SignGroup.t() | %{}}
  @type by_route() :: %{route_id() => t()}

  @doc """
  Returns a map of expired group timestamps to empty maps.
  """
  @spec expired(t(), DateTime.t(), MapSet.t(Alert.id())) :: t()
  def expired(sign_groups, current_time, alerts) do
    for {created_at, group} <- sign_groups,
        SignGroup.expired?(group, current_time, alerts),
        into: %{} do
      {created_at, %{}}
    end
  end

  @spec from_json(t()) :: t()
  def from_json(groups) do
    Map.new(groups, fn {time, group} -> {time, SignGroup.from_json(group)} end)
  end

  @spec by_route(t()) :: by_route()
  def by_route(groups) do
    groups
    |> Enum.group_by(fn {_created_at, %SignGroup{route_id: route_id}} -> route_id end)
    |> Enum.map(fn {route_id, groups} -> {route_id, Map.new(groups)} end)
    |> Enum.into(%{})
  end

  @spec update(t(), {unix_time(), SignGroup.t() | %{}}) :: t()
  def update(groups, {created_at, map}) when map == %{}, do: Map.delete(groups, created_at)

  def update(groups, {created_at, %SignGroup{sign_ids: new_sign_ids} = group}) do
    groups
    |> Enum.map(fn {created_at, %SignGroup{sign_ids: sign_ids} = group} ->
      {created_at, %{group | sign_ids: Enum.filter(sign_ids, &(&1 not in new_sign_ids))}}
    end)
    |> Enum.into(%{})
    |> Map.put(created_at, group)
  end
end
