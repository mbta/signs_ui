# This script allows you to download a CSV file from Splunk containing logs of past sent messages
# and play them back against a locally running instance of Signs UI.

Mix.install([{:httpoison, "~> 1.0"}])

if System.get_env("SIGN_UI_URL") == nil do
  IO.puts("Please set the SIGN_UI_URL environment variable")
  System.halt(1)
end

if System.get_env("SIGN_UI_API_KEY") == nil do
  IO.puts("Please set the SIGN_UI_API_KEY environment variable")
  System.halt(1)
end

defmodule CountdownClockPlayback do
  use GenServer

  @sign_ui_url System.get_env("SIGN_UI_URL")
  @sign_ui_api_key System.get_env("SIGN_UI_API_KEY")

  def start_link(csv_path) do
    GenServer.start_link(__MODULE__, csv_path, name: __MODULE__)
  end

  @impl true
  def init(csv_path) do
    messages =
      File.read!(csv_path)
      |> String.split("\n")
      |> Stream.filter(fn row ->
        String.contains?(row, "update_single_line:") or String.contains?(row, "update_sign:")
      end)
      |> Stream.map(fn row ->
        [_, timestamp, _, _, _, message | _] = String.split(row, " ")
        {:ok, timestamp, _} = DateTime.from_iso8601("#{timestamp}Z")
        {timestamp, message}
      end)
      |> Enum.reverse()

      {:ok, messages}
    end

  @impl true
  def handle_info(:run_simulation_step, [current_message]) do
    {_, message} = current_message
    update_signs_ui(message)

    Process.exit(self(), :normal)
    {:noreply, []}
  end

  @impl true
  def handle_info(:run_simulation_step, [current_message | remaining_messages]) do
    {timestamp, message} = current_message
    update_signs_ui(message)

    IO.puts(
      "Sent message: #{message} from #{timestamp} (#{length(remaining_messages)} remaining)"
      )

    {next_message_timestamp, _} = List.first(remaining_messages)
    delay = DateTime.diff(next_message_timestamp, timestamp, :millisecond)
    Process.send_after(self(), :run_simulation_step, delay)

    {:noreply, remaining_messages}
  end

  defp update_signs_ui(message) do
    case HTTPoison.post("http://#{@sign_ui_url}/messages", message, [
      {"Content-type", "application/x-www-form-urlencoded"},
      {"x-api-key", @sign_ui_api_key}
      ]) do
      {:ok, %{status_code: 201}} ->
        :ok

      err ->
        IO.inspect(err)
    end
  end
end

path =
  case System.argv() do
    [path] -> path
    _ ->
      IO.puts("Please provide a path to a CSV file")
      Process.exit(self(), :normal)
  end

{:ok, pid} = CountdownClockPlayback.start_link(path)
send(pid, :run_simulation_step)
Process.monitor(pid)
System.no_halt(true)

receive do
  _ ->
    IO.puts("Simulation complete")
    Process.exit(self(), :normal)
end
