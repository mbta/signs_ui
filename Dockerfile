FROM hexpm/elixir:1.10.3-erlang-22.3.4-debian-buster-20200224 as builder
ENV MIX_ENV=prod
ENV NODE_ENV=production

ARG ERL_COOKIE
ENV ERL_COOKIE={$ERL_COOKIE}
RUN if test -z $ERL_COOKIE; then (>&2 echo "No ERL_COOKIE"); exit 1; fi

ARG SECRET_KEY_BASE
ENV SECRET_KEY_BASE={$SECRET_KEY_BASE}
RUN if test -z $SECRET_KEY_BASE; then (>&2 echo "No SECRET_KEY_BASE"); exit 1; fi

WORKDIR /root
ADD . .

# Install hex and rebar
RUN mix local.hex --force && \
    mix local.rebar --force && \
    mix do deps.get --only prod, compile --force

WORKDIR /root/assets/
RUN apt-get update && apt-get install -y --no-install-recommends curl
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash - && \
    apt-get install -y nodejs npm && \
    npm install -g npm@latest && \
    npm install -g yarn

RUN yarn install
RUN yarn deploy

WORKDIR /root
RUN mix phx.digest
RUN mix distillery.release --verbose

# the one the elixir image was built with
FROM debian:buster

RUN apt-get update && apt-get install -y --no-install-recommends \
    libssl1.1 libsctp1 curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /root
EXPOSE 4000
ENV MIX_ENV=prod TERM=xterm LANG="C.UTF-8" PORT=4000

COPY --from=builder /root/_build/prod/rel/signs_ui/releases/current/signs_ui.tar.gz .
RUN mkdir gtfs
RUN tar -xzf signs_ui.tar.gz
CMD ["bin/signs_ui", "foreground"]
