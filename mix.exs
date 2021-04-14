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
      {:dialyxir, "~> 1.0.0-rc.4", only: [:dev, :test], runtime: false},
      {:distillery, "~> 2.1.1", runtime: false},
      {:ex_aws_s3, "~> 2.0"},
      {:ex_aws, "~> 2.0"},
      {:excoveralls, "~> 0.13.0", only: :test},
      {:gettext, "~> 0.11"},
      {:guardian_phoenix, "~> 2.0"},
      {:guardian, "~> 2.0"},
      {:httpoison, "~> 1.0"},
      {:jason, "~> 1.2.0"},
      {:nimble_parsec, "~> 1.0"},
      {:phoenix_html, "~> 2.10"},
      {:phoenix_live_reload, "~> 1.0", only: :dev},
      {:phoenix_pubsub, "~> 1.0"},
      {:phoenix, "~> 1.4.17"},
      {:plug_cowboy, "~> 2.3"},
      {:sentry, "~> 8.0"},
      {:sobelow, "~> 0.8", only: :dev},
      {:timex, "~> 3.1"},
      {:ueberauth_cognito, "~> 0.1"},
      {:ueberauth, "~> 0.1"}
    ]
  end
end
