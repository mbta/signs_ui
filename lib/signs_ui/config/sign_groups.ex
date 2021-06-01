defmodule SignsUi.Config.SignGroups do
  @moduledoc """
  Represents the state of all current sign groups.
  """

  alias SignsUi.Alerts.Alert
  alias SignsUi.Config.SignGroup

  @type route_id() :: String.t()
  @type unix_time() :: String.t()
  @type t() :: %{unix_time() => SignGroup.t() | %{}}
  @type display() :: %{route_id() => t()}

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
end
