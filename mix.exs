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
      test_coverage: [tool: ExCoveralls],
      dialyzer: [plt_add_apps: [:ex_unit]],
      deps: deps()
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {SignsUi.Application, []},
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
      {:excoveralls, "~> 0.12.2", only: :test},
      {:dialyxir, "~> 1.0.0-rc.4", only: [:dev, :test], runtime: false},
      {:distillery, "~> 2.1.1", runtime: false},
      {:phoenix, "~> 1.4.17"},
      {:phoenix_pubsub, "~> 1.0"},
      {:phoenix_html, "~> 2.10"},
      {:phoenix_live_reload, "~> 1.0", only: :dev},
      {:gettext, "~> 0.11"},
      {:cowboy, "~> 1.0"},
      {:plug_cowboy, "~> 1.0"},
      {:jason, "~> 1.2.0"},
      {:httpoison, "~> 1.0"},
      {:ex_aws, "~> 2.0"},
      {:ex_aws_s3, "~> 2.0"},
      {:timex, "~> 3.1"},
      {:guardian, "~> 2.0"},
      {:guardian_phoenix, "~> 2.0"},
      {:ueberauth, "~> 0.1"},
      {:ueberauth_cognito, "~> 0.1"},
      {:nimble_parsec, "~> 0.1"}
    ]
  end
end
