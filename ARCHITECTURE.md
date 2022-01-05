# Architecture

This document describes high-level architecture of signs-ui. The goal of this document is to
provide a useful orientation to a new contributor to the codebase.

## Application description

Signs UI is a web app used in primarily two ways:

1. To monitor the current state of countdown signs throughout the system. (The "viewer")
2. To control the signs in certain ways. (The "configuration")

Like Realtime Signs, throughout this app when we talk about a "sign" it could actually represent
multiple physical signs in the field, all behaving identically. In ARINC terminology a sign is a
"zone" at a station and is the minimally granular unit that we have control over.

## Architecture of the "viewer"

The applications that drive the signs throughout the system, Realtime Signs for subway and
TransitwayEngine for bus, do so by sending HTTP POST requests to the ARINC head-end server. The
two apps, upon a successful post to ARINC, also send the exact same request to signs-ui, which is
handled by the `SignsUiWeb.MessagesController`.

Signs-UI tries to simulate the behavior of the ARINC head end server. The
`SignsUi.Messages.SignContent` module is a parser that handles the particular format of
`MsgType=SignContent` messages that ARINC can receive. It does not handle `AdHoc` or `Canned`
messages, which are generally used for audio.

The received messages get stored in memory in the `SignsUi.Signs.State` GenServer. This means when
signs-ui starts up, the known contents of every sign is blank. However, since message expirations
are generally set at 2-3 minutes, our Realtime Signs and Transitway Engine will send a POST to
every sign in the system relatively quickly, and within 2-3 minutes signs-ui will know what's on
all the signs.

When a browser loads signs-ui to look at the viewer, a Phoenix channel is kept open. Whenever
`SignsUi.Signs.State` is updated, the entire new state is broadcast to all connected browsers. The
main signs-ui app on the frontend is a React app, which takes the signs' state at the top of the
component tree.

## Architecture of the "configuration"

The way signs-ui interacts with Realtime Signs and TransitwayEngine is via a JSON file saved in S3
at `mbta-signs/config.json` (or `mbta-signs-dev`). Signs-UI writes to the file, and the clients
poll the file for changes. Depending on configuration values in that file, the two clients may
consider certain signs turned off, displaying particular custom text values, etc.

The JSON file is a serialized version of the state that Signs-UI keeps in `SignsUi.Config.State`.
When the application starts up, it reads the S3 file itself to initialize that state. When users
of Signs-UI make any configuration changes, the state is updated, and the new state is then
written to S3.

## Architecture of the frontend

Signs-UI is a react app. There's only one page, but it's not really a "SPA" in that there's no
router or API requests. Instead, when the page is first loaded and rendered, the initial signs and
configuration state are serialized onto the page as global variables on `window`. The react app
uses this data to initialize the page with all the relevant data. There are handlers that listen
on the Phoenix channels for sign and configuration updates, and update the top-level state when
there are changes.

## Diagram
![Signs UI Architecture Diagram](/signs_ui_architecture.jpg)
