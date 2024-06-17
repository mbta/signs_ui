defmodule SignsUi.Config.SignGroupToSignConfigsTest do
  use ExUnit.Case, async: true

  alias SignsUi.Config.Sign
  alias SignsUi.Config.SignGroup
  alias SignsUi.Config.SignGroupToSignConfigs

  @state %{
    signs: %{},
    configured_headways: %{},
    chelsea_bridge_announcements: "off",
    sign_groups: %{}
  }

  describe "apply/2" do
    test "Adding a sign group applies the changes to its signs" do
      sign_group_changes = %{
        "new_sign_group" => %SignGroup{
          sign_ids: ["sign1", "sign2"],
          route_id: "Red",
          line1: "line1",
          line2: "line2",
          expires: nil,
          alert_id: "alert_id"
        }
      }

      assert %{
               "sign1" => %Sign{
                 id: "sign1",
                 config: %{
                   mode: :static_text,
                   line1: "line1",
                   line2: "line2",
                   expires: nil,
                   alert_id: "alert_id"
                 }
               },
               "sign2" => %Sign{
                 id: "sign2",
                 config: %{
                   mode: :static_text,
                   line1: "line1",
                   line2: "line2",
                   expires: nil,
                   alert_id: "alert_id"
                 }
               }
             } = SignGroupToSignConfigs.apply(sign_group_changes, @state.sign_groups)
    end

    test "Removing a sign group sets its signs to Auto" do
      state =
        @state
        |> put_in([:signs], %{
          "sign1" => %Sign{
            id: "sign1",
            config: %{
              mode: :static_text,
              line1: "line1",
              line2: "line2",
              expires: nil,
              alert_id: "alert_id"
            }
          },
          "sign2" => %Sign{
            id: "sign2",
            config: %{
              mode: :static_text,
              line1: "line1",
              line2: "line2",
              expires: nil,
              alert_id: "alert_id"
            }
          }
        })
        |> put_in([:sign_groups], %{
          "sign_group" => %SignGroup{
            sign_ids: ["sign1", "sign2"],
            route_id: "Red",
            line1: "line1",
            line2: "line2",
            expires: nil,
            alert_id: "alert_id"
          }
        })

      sign_group_changes = %{"sign_group" => %{}}

      assert %{
               "sign1" => %Sign{id: "sign1", config: %{mode: :auto}},
               "sign2" => %Sign{id: "sign2", config: %{mode: :auto}}
             } = SignGroupToSignConfigs.apply(sign_group_changes, state.sign_groups)
    end

    test "Updating a sign group sets removed signs to Auto" do
      state =
        @state
        |> put_in([:signs], %{
          "sign1" => %Sign{
            id: "sign1",
            config: %{
              mode: :static_text,
              line1: "line1",
              line2: "line2",
              expires: nil,
              alert_id: "alert_id"
            }
          },
          "sign2" => %Sign{
            id: "sign2",
            config: %{
              mode: :static_text,
              line1: "line1",
              line2: "line2",
              expires: nil,
              alert_id: "alert_id"
            }
          },
          "sign3" => %Sign{id: "sign3", config: %{mode: :auto}}
        })
        |> put_in([:sign_groups], %{
          "sign_group" => %SignGroup{
            sign_ids: ["sign1", "sign2"],
            route_id: "Red",
            line1: "line1",
            line2: "line2",
            expires: nil,
            alert_id: "alert_id"
          }
        })

      sign_group_changes = %{
        "sign_group" => %SignGroup{
          sign_ids: ["sign1", "sign3"],
          route_id: "Red",
          line1: "new line1",
          line2: "new line2",
          expires: ~U[2021-07-13 12:00:00.000Z],
          alert_id: nil
        }
      }

      assert %{
               "sign1" => %Sign{
                 id: "sign1",
                 config: %{
                   mode: :static_text,
                   line1: "new line1",
                   line2: "new line2",
                   expires: ~U[2021-07-13 12:00:00.000Z],
                   alert_id: nil
                 }
               },
               "sign3" => %Sign{
                 id: "sign3",
                 config: %{
                   mode: :static_text,
                   line1: "new line1",
                   line2: "new line2",
                   expires: ~U[2021-07-13 12:00:00.000Z],
                   alert_id: nil
                 }
               },
               "sign2" => %Sign{id: "sign2", config: %{mode: :auto}}
             } = SignGroupToSignConfigs.apply(sign_group_changes, state.sign_groups)
    end
  end
end
