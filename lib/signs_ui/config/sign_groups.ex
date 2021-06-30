defmodule SignsUi.Config.SignGroups do
  @moduledoc """
  Represents the state of all current sign groups.
  """

  alias SignsUi.Alerts.Alert
  alias SignsUi.Config.SignGroup

  @type unix_time() :: String.t()
  @type t() :: %{unix_time() => SignGroup.t() | %{}}
  @type by_route() :: %{SignGroup.route_id() => t()}

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

  @doc """
  Converts sign group data from the frontend, like this:

  iex> from_json(%{"12345" => %{"route_id" => "Red"}})
  %{"12345" => %SignsUi.Config.SignGroup{route_id: "Red"}}
  """
  @spec from_json(t()) :: t()
  def from_json(sign_groups) do
    Map.new(sign_groups, fn {time, group} -> {time, SignGroup.from_json(group)} end)
  end

  @doc """
  Organizes sign group data by the route it's relevant to, like this:

  iex> by_route(%{"12345" => %SignsUi.Config.SignGroup{route_id: "Red"}})
  %{"Red" => %{"12345" => %SignsUi.Config.SignGroup{route_id: "Red"}}}
  """
  @spec by_route(t()) :: by_route()
  def by_route(sign_groups) do
    Enum.reduce(sign_groups, %{}, fn {time, group}, acc ->
      Map.update(acc, group.route_id, %{time => group}, &Map.put(&1, time, group))
    end)
  end

  @doc """
  Updates existing sign group state with new groups and deletions, ensuring that
  signs are only in one group at a time.
  """
  @spec update({unix_time(), SignGroup.t() | %{}}, t()) :: t()
  def update({created_at, map}, sign_groups) when map == %{} do
    Map.delete(sign_groups, created_at)
  end

  def update({created_at, %SignGroup{sign_ids: new_sign_ids} = group}, sign_groups) do
    sign_groups
    |> Enum.map(fn {created_at, %SignGroup{sign_ids: sign_ids} = group} ->
      {created_at, %{group | sign_ids: Enum.reject(sign_ids, &(&1 in new_sign_ids))}}
    end)
    |> Enum.into(%{})
    |> Map.put(created_at, group)
  end
end
