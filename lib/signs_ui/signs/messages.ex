defmodule SignsUi.Signs.Messages do
  use GenServer
  import Timex

  @type message :: String.t()

  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, opts)
  end

  def init(_opts) do
    {:ok, %{}}
  end

  def list_messages(pid \\ __MODULE__) do
    GenServer.call(pid, :list_messages)
  end

  def add_message(pid \\ __MODULE__, message) do
    GenServer.call(pid, {:add_message, message})
  end

  def handle_call(:list_messages, _from, messages) do
    message_list =
      messages
      |> Enum.map(fn {sign_id, line_map} ->
        current_time = Timex.now()
        line_one = line_map[1] || %{text: "", duration: expiration_time(current_time, "0")}
        line_two = line_map[2] || %{text: "", duration: expiration_time(current_time, "0")}
        lines = [line_one, line_two]
        {sign_id, lines}
      end)
      |> Map.new()

    {:reply, message_list, messages}
  end

  def handle_call({:add_message, message}, _from, messages) do
    sta = message["sta"]
    commands = parse_commands(message["c"])

    command_lines =
      Enum.reduce(commands, %{}, fn {duration, zone, line_no, text}, acc ->
        sign_id = "#{sta}-#{zone}"
        current_time = Timex.now()
        expiration = expiration_time(current_time, duration)

        line_data = %{line_no => %{text: text, duration: expiration}}
        Map.update(acc, sign_id, line_data, &Map.merge(&1, line_data))
      end)

    broadcast_update(command_lines)

    messages =
      Enum.reduce(command_lines, messages, fn {sign_id, lines}, acc ->
        new_sign =
          if acc[sign_id] != nil do
            Map.merge(acc[sign_id], lines)
          else
            lines
          end

        Map.put(acc, sign_id, new_sign)
      end)

    {:reply, {:ok, messages}, messages}
  end

  defp parse_commands(commands) do
    commands
    |> Enum.map(fn command ->
      [duration, zone_line_text] = String.split(command, ["~"])
      duration_regex = ~r/([a-z])([\d]+)/
      [_original, _expires?, duration] = Regex.run(duration_regex, duration)

      [zone_line | text_list] = String.split(zone_line_text, ["-"])

      text_list =
        text_list
        |> Enum.map(fn text ->
          text_time_regex = ~r/([\w\d\s]+)\.?([\d]?+)$/

          text =
            text
            |> URI.decode()
            |> String.replace("\"", "")
            |> String.replace("+", " ")

          text =
            case Regex.run(text_time_regex, text) do
              [_original, text, _text_time] -> text
              nil -> ""
            end

          text
        end)

      {zone, line_no} = String.split_at(zone_line, 1)
      line_no = String.to_integer(line_no)

      display_text =
        case text_list do
          [_away, _stopped, n_stops] -> n_stops
          [n_minutes] -> n_minutes
          text_list -> List.first(text_list)
        end

      {duration, zone, line_no, display_text}
    end)
  end

  defp broadcast_update(sign_lines) do
    sign_lines
    |> Enum.each(fn {sign_id, lines} ->
      lines
      |> Enum.each(fn {number, %{text: line, duration: duration}} ->
        SignsUiWeb.Endpoint.broadcast!("signs:all", "sign_update", %{
          sign_id: sign_id,
          line_number: number,
          text: line,
          duration: duration
        })
      end)
    end)
  end

  defp expiration_time(current_time, duration) do
    {duration, _} = Integer.parse(duration)
    Timex.shift(current_time, seconds: duration)
  end
end
