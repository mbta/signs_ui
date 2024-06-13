defmodule SignsUi.Setup do
  @moduledoc """
  Similar to a `Task` but the passed function is evaluated during the `init`
  lifecycle of `GenServer`.

  Shuts down immediately but will execute before children after it in a
  `Supervisor`
  """
  use GenServer, restart: :transient

  def start_link(arg, opts \\ []) do
    GenServer.start_link(__MODULE__, mfa!(arg), opts)
  end

  def start(arg, opts \\ []) do
    GenServer.start(__MODULE__, mfa!(arg), opts)
  end

  @impl true
  def init({mod, fun, args}) do
    apply(mod, fun, args)

    :ignore
  end

  defp mfa!({_m, _f, _a} = mfa), do: mfa
  defp mfa!(fun) when is_function(fun, 0), do: {Kernel, :apply, [fun, []]}
end
