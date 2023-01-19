# Signs UI

Web interface for MBTA countdown signs. Acts as an emulator for the physical hardware, providing real-time feedback on the current sign content. Also provides controls for modifying the sign configuration file, which can be used to override their behavior.

## Development

  * Install languages with `asdf install`
  * Install Elixir dependencies with `mix deps.get`
  * Install JS dependencies with `pushd assets && npm install && popd`
  * Install [direnv](https://direnv.net/docs/installation.html)
  * Copy .envrc.template into .envrc, and fill in `API_V3_ORIGIN` and `API_V3_KEY` with the desired origin (e.g. https://api-v3.mbta.com) and desired key (e.g. a key from https://api-v3.mbta.com)
  * Start the server with `NODE_ENV=development mix run --no-halt`

Now you can visit [`localhost:5000`](http://localhost:5000) from your browser.

### Developing locally with [realtime_signs](https://github.com/mbta/realtime_signs)

See the realtime_signs README for instructions.