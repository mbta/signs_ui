FROM elixir:1.6 as builder

ENV MIX_ENV=prod
ENV NODE_ENV=production

WORKDIR /root
ADD . .

# Configure Git to use HTTPS in order to avoid issues with the internal MBTA network
RUN git config --global url.https://github.com/.insteadOf git://github.com/

# Install hex and rebar
RUN mix local.hex --force && \
    mix local.rebar --force && \
    mix do deps.get --only prod, compile --force

WORKDIR /root/assets/
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@latest && \
    npm install -g yarn

RUN yarn install
RUN yarn deploy

WORKDIR /root
RUN mix phx.digest
RUN mix release --verbose

# the one the elixir image was built with
FROM debian:stretch

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
