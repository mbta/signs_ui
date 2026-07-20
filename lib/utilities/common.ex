defmodule Utilities.Common do
  @moduledoc false

  require Logger

  def log(token, extras) do
    fields =
      Enum.filter(extras, fn {_, v} -> v end) |> Enum.map_join(" ", fn {k, v} -> "#{k}=#{v}" end)

    Logger.info("#{token}: #{fields}")
  end
end
