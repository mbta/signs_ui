# first, get the elixir dependencies within an elixir container
FROM hexpm/elixir:1.13.1-erlang-24.2-alpine-3.15.0 as elixir-builder
ENV LANG="C.UTF-8" MIX_ENV="prod"

ARG SECRET_KEY_BASE
ENV SECRET_KEY_BASE=${SECRET_KEY_BASE}
RUN if test -z $SECRET_KEY_BASE; then (>&2 echo "No SECRET_KEY_BASE"); exit 1; fi

WORKDIR /root
ADD . .

# Install git so we can install dependencies from GitHub
RUN apk --update add git make

RUN mix do local.hex --force, local.rebar --force, deps.get --only prod

# next, build the frontend assets within a node.js container
FROM node:14 as assets-builder

WORKDIR /root
ADD . .

# copy in elixir deps required to build node modules for phoenix
COPY --from=elixir-builder /root/deps ./deps

RUN npm ci --prefix assets && npm run deploy --prefix assets

# now, build the application back in the elixir container
FROM elixir-builder as app-builder

WORKDIR /root

# add frontend assets compiled in node container, required by phx.digest
COPY --from=assets-builder /root/priv/static ./priv/static

RUN mix do compile --force, phx.digest, release

# the one the elixir image was built with
FROM alpine:3.15.0

WORKDIR /root
ADD . .

RUN apk --update add \
  libssl1.1 libstdc++ \
  libgcc ncurses-libs bash curl dumb-init \
  && rm -rf /var/cache/apk/*

EXPOSE 4000
ENV MIX_ENV=prod TERM=xterm LANG="C.UTF-8" PORT=4000

# add frontend assets with manifests from app build container
COPY --from=app-builder /root/priv/static ./priv/static
COPY --from=app-builder /root/_build/prod/rel/signs_ui .
RUN mkdir gtfs

# Healthcheck
HEALTHCHECK CMD ["bin/signs_ui", "rpc", "1 + 1"]

# Start application
CMD ["bin/signs_ui", "start"]
