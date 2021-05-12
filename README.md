# SignsUi

To start your Phoenix server:

  * Install languages with `asdf install`
  * Install Elixir dependencies with `mix deps.get`
  * Install JS dependencies with `pushd assets && npm install && popd`
  * Install [direnv](https://direnv.net/docs/installation.html)
  * Copy .envrc.template into .envrc, and fill in `API_V3_ORIGIN` and `API_V3_KEY` with the desired origin (e.g. https://api-v3.mbta.com) and desired key (e.g. a key from https://api-v3.mbta.com)
  * Start Phoenix endpoint with `NODE_ENV=development mix run --no-halt` (substituting whatever username/password you want)

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

To get updates on the signs locally, run `realtime_signs` with a `SIGN_UI_URL` of the local url of `signs_ui`.
See that `README` for more details.

Ready to run in production? Please [check our deployment guides](http://www.phoenixframework.org/docs/deployment).

## Learn more

  * Official website: http://www.phoenixframework.org/
  * Guides: http://phoenixframework.org/docs/overview
  * Docs: https://hexdocs.pm/phoenix
  * Mailing list: http://groups.google.com/group/phoenix-talk
  * Source: https://github.com/phoenixframework/phoenix
