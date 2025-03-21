# Architecture

This document describes the high-level architecture of Signs UI. The goal of this document is to
provide a useful orientation to a new contributor to the codebase.

## Application description

Signs UI is a web app used in a few ways:

1. To emulate the current state of countdown signs throughout the system.
2. To configure what "mode" a sign is in
3. To tie sign content to the expiration of an alert or a datetime
4. To manage headway configurations
5. To manage SCU migration status

Like Realtime Signs, throughout this app when we talk about a "sign" it could actually represent
multiple physical signs in the field, all behaving identically. In ARINC terminology a sign is a
"zone" at a station and is the minimally granular unit that we have control over.

## Architecture overview
### Emulating sign state
When a browser loads Signs UI, the frontend subscribes to a Phoenix channel ([`SignsUiWeb.SignsChannel`](/lib//signs_ui_web/channels/signs_channel.ex)) which is kept open and is the primary way the client receives updates from the server.

When Realtime Signs successfully sends a message to a given sign, it subsequently sends the same message to Signs UI. These messages are received by [`SignsUiWeb.MessagesController`](/lib/signs_ui_web/controllers/messages_controller.ex).
Signs UI will then parse the messages and store them in memory in the [`SignsUi.Signs.State`](/lib/signs_ui/signs/state.ex) GenServer. The message is then broadcasted via the `SignsChannel` to all connected clients.

When the frontend receives updates to state, it applies its own logic to determine exactly what content to render (see [`SignDisplay.tsx`](/assets/js/SignDisplay.tsx)). It makes a best attempt to emulate what should be displayed on real-world signs at any given time, but note that there are cases where it may not be an exact reflection.

When Signs UI starts up, the known contents of every sign are blank. However, since message expirations are generally set at 2-3 minutes, Realtime Signs will send a POST to
every sign in the system relatively quickly, and within 2-3 minutes Signs UI will know what's on
all the signs.

### Config

When the application starts up, it reads a JSON file saved in S3 at `mbta-signs/config.json` (or `mbta-signs-dev`) to initialize `SignsUi.Config.State`. When users
of Signs UI make configuration changes, such as changing a sign mode (e.g., from "auto" to "off"), the internal state is updated, and the updated state is written back to the JSON file in S3. (see [`SignsUi.Config.Writer`](/lib/signs_ui/config/writer.ex)). The same occurs when a sign is configured to expire in association with the expiration of an alert or datetime, headway values or groups are updated, or an SCU is migrated.

The primary way Signs UI interacts with Realtime Signs and other clients is via the aforementioned JSON file saved in S3. Clients typically poll the file for changes.

### Frontend

Signs UI is a react app. There's only one page, but it's not really a "SPA" in that there's no
router or API requests. Instead, when the page is first loaded and rendered, the initial signs and
configuration state are serialized onto the page as global variables on `window`. The react app
uses this data to initialize the page with all the relevant data. There are handlers that listen
on the Phoenix channels for sign and configuration updates, and update the top-level state when
there are changes.
