# Signs UI

Web interface for MBTA countdown signs. Acts as an emulator for the physical hardware, providing real-time feedback on the current sign content. Also provides controls for modifying the sign configuration file, which can be used to override their behavior.

## Prerequisites

* [asdf](https://asdf-vm.com/)
* [direnv](https://direnv.net/)

## Development

* Run `asdf install` from the repository root.
  <!-- Remove this if upgrading the Erlang/OTP version beyond 25 -->
  * Note: If running macOS Sonoma on an Apple Silicon (ARM) machine, use `KERL_CONFIGURE_OPTIONS="--disable-jit" asdf install`[^1]
* Install Elixir dependencies with `mix deps.get`
* Install JS dependencies with `pushd assets && npm install && popd`
* Copy `.envrc.template` to `.envrc`, then edit `.envrc` and make sure all required environment variables are set. When finished, run `direnv allow` to activate them.
* Start the server with `mix run --no-halt`

Now you can visit [`localhost:5000`](http://localhost:5000) from your browser.

### Developing locally with [realtime_signs](https://github.com/mbta/realtime_signs)

See the realtime_signs README for instructions.

[^1]: The way memory is allocated for the JIT in OTP 25 is prohibited in macOS Sonomoa. [Disabling the JIT fixes the issue](https://github.com/erlang/otp/issues/7687#issuecomment-1737184968). This has [been fixed in OTP-25.3.2.7](https://github.com/erlang/otp/commit/ac591a599b09b48b45a7125aa30ec5419ba3cc2f) and beyond.