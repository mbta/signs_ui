defmodule SignsUi.Config.SignGroupToSignConfigs do
  @moduledoc """
  A compatibility layer that supports the concept of Sign Groups while leaving clients like Realtime
  Signs unchanged. When Sign Groups are changed, those changes are propagated to the underlying Sign
  configs. There are three kinds of changes:

  * New Sign Group - all the signs in this group have their custom text, mode and expiration options
    set to the same values as the group value.
  * Sign Group Deleted - all the signs in the group are reset back to Auto
  * Sign Group Updated - Same as New Sign Group, plus any signs that were removed are reset back to
    Auto.
  """

  alias SignsUi.Config
  alias SignsUi.Config.Sign
  alias SignsUi.Config.SignGroup
  alias SignsUi.Config.SignGroups

  @doc """
  Transforms the Sign Group changes into a map of Sign Config updates.
  """
  @spec apply(SignGroups.t(), Config.t()) :: %{Sign.id() => Sign.t()}
  def apply(sign_group_changes, config_state) do
    Enum.reduce(sign_group_changes, %{}, fn {changed_sign_group_id, changed_sign_group}, acc ->
      config_state.sign_groups
      |> Map.get(changed_sign_group_id)
      |> process_sign_group(normalize(changed_sign_group))
      |> Map.merge(acc)
    end)
  end

  @spec process_sign_group(SignGroup.t() | nil, SignGroup.t() | nil) :: %{Sign.id() => Sign.t()}
  defp process_sign_group(old_sign_group, new_sign_group)

  # Group is being deleted
  defp process_sign_group(%SignGroup{} = old_group, nil) do
    set_signs_to_auto(old_group.sign_ids)
  end

  # Group is being added
  defp process_sign_group(nil, %SignGroup{} = new_sign_group) do
    set_signs_to_static_text(
      new_sign_group.sign_ids,
      new_sign_group.line1,
      new_sign_group.line2,
      new_sign_group.expires,
      new_sign_group.alert_id
    )
  end

  # Group is being updated
  defp process_sign_group(%SignGroup{} = old_group, %SignGroup{} = new_group) do
    additions =
      set_signs_to_static_text(
        new_group.sign_ids,
        new_group.line1,
        new_group.line2,
        new_group.expires,
        new_group.alert_id
      )

    removed_signs =
      MapSet.difference(
        MapSet.new(old_group.sign_ids),
        MapSet.new(new_group.sign_ids)
      )

    removals = set_signs_to_auto(removed_signs)

    Map.merge(additions, removals)
  end

  # Shouldn't occur, but for completeness
  defp process_sign_group(nil, nil) do
    %{}
  end

  @spec set_signs_to_auto(Enumerable.t()) :: %{Sign.id() => Sign.t()}
  defp set_signs_to_auto(sign_ids) do
    Map.new(sign_ids, fn sign_id ->
      {sign_id, %Sign{id: sign_id, config: %{mode: :auto}}}
    end)
  end

  @spec set_signs_to_static_text(
          Enumerable.t(),
          String.t(),
          String.t(),
          Sign.expires_on() | nil,
          String.t() | nil
        ) ::
          %{
            Sign.id() => Sign.t()
          }
  defp set_signs_to_static_text(sign_ids, line1, line2, expires, alert_id) do
    Map.new(sign_ids, fn sign_id ->
      {
        sign_id,
        %Sign{
          id: sign_id,
          config: %{
            mode: :static_text,
            line1: line1,
            line2: line2,
            expires: expires,
            alert_id: alert_id
          }
        }
      }
    end)
  end

  @spec normalize(SignGroup.t() | map()) :: SignGroup.t() | nil
  defp normalize(%SignGroup{} = sign_group), do: sign_group
  defp normalize(sg) when sg == %{}, do: nil
end
