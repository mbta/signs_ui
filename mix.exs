defmodule SignsUi.Mixfile do
  use Mix.Project

  def project do
    [
      app: :signs_ui,
      version: "0.0.1",
      elixir: "~> 1.4",
      elixirc_paths: elixirc_paths(Mix.env()),
      compilers: [:phoenix, :gettext] ++ Mix.compilers(),
      start_permanent: Mix.env() == :prod,
      test_coverage: [tool: LcovEx],
      dialyzer: [plt_add_apps: [:ex_unit, :laboratory]],
      deps: deps()
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {SignsUi.Application, []},
      included_applications: [:laboratory],
      extra_applications: [
        :logger,
        :parse_trans,
        :runtime_tools,
        :ex_aws,
        :ex_aws_s3
      ]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:credo, "~> 1.4", only: [:dev, :test], runtime: false},
      {:dialyxir, "~> 1.1.0", only: [:dev, :test], runtime: false},
      {:distillery, "~> 2.1.1", runtime: false},
      {:ex_aws_s3, "~> 2.0"},
      {:ex_aws, "~> 2.0"},
      {:lcov_ex, "~> 0.2", only: [:dev, :test], runtime: false},
      {:gettext, "~> 0.11"},
      {:gen_stage, "~> 1.0"},
      {:server_sent_event_stage, "~> 1.0.0"},
      {:castore, "~> 0.1"},
      {:guardian_phoenix, "~> 2.0"},
      {:guardian, "~> 2.0"},
      {:httpoison, "~> 1.0"},
      {:jason, "~> 1.2.0"},
      {:nimble_parsec, "~> 1.0"},
      {:phoenix_html, "~> 3.0"},
      {:phoenix_live_reload, "~> 1.0", only: :dev},
      {:phoenix_pubsub, "~> 2.0"},
      {:phoenix, "~> 1.6.4"},
      {:plug_cowboy, "~> 2.3"},
      {:sentry, "~> 8.0"},
      {:sobelow, "~> 0.8", only: :dev},
      {:tzdata, "~> 1.1"},
      {:ueberauth_cognito, "~> 0.1"},
      {:ueberauth, "~> 0.1"},
      {:laboratory, github: "paulswartz/laboratory", ref: "cookie_opts"}
    ]
  end
end
