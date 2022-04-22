# first, get the elixir dependencies within an elixir container
FROM hexpm/elixir:1.11.4-erlang-23.3.1-debian-buster-20210326 as elixir-builder
ENV LANG="C.UTF-8" MIX_ENV="prod"

ARG SECRET_KEY_BASE
ENV SECRET_KEY_BASE=${SECRET_KEY_BASE}
RUN if test -z $SECRET_KEY_BASE; then (>&2 echo "No SECRET_KEY_BASE"); exit 1; fi

WORKDIR /root
ADD . .

# Install git so we can install dependencies from GitHub
RUN apt-get update --allow-releaseinfo-change && \
  apt-get install -y --no-install-recommends git ca-certificates

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
FROM debian:buster

WORKDIR /root
ADD . .

RUN apt-get update --allow-releaseinfo-change && \
  apt-get install -y --no-install-recommends libssl1.1 libsctp1 curl && \
  rm -rf /var/lib/apt/lists/*

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
