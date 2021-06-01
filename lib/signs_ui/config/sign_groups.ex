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
  Returns all the active (not expired) groups.
  """
  @spec active(t(), DateTime.t(), MapSet.t(Alert.id())) :: {t(), [SignGroup.t()]}
  def active(sign_groups, current_time, alerts) do
    for {created_at, group} <- sign_groups,
        SignGroup.expired?(group, current_time, alerts),
        reduce: {sign_groups, []} do
      {current, expired} ->
        {removed, updated} = pop_in(current[created_at])
        {updated, [removed | expired]}
    end
  end

  @spec from_json(t()) :: t()
  def from_json(groups) do
    Map.new(groups, fn {time, group} -> {time, SignGroup.from_json(group)} end)
  end
end
