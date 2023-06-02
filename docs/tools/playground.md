# Playground

The client-side playground tool allows to easily create multiple client
connections with the server, and inspect its communication with the server.

![](https://cdn.jsdelivr.net/npm/@colyseus/playground@latest/screenshot.png)

## Features

- Lists all your defined room types
- Allows to `joinOrCreate` / `create` / `join` into them.
- When `joinById` is selected, provides a list of active rooms by id
- Visualize the client state in JSON format
- Table of incoming and outgoing messages
- Table of raw events from the framework
- Allow the client to send messages by type (auto-detected)

## Installation

The playground tool is installed by default on new projects created via `npm create colyseus-app`.

To manually install on an existing project, please do:

```bash
npm install --save @colyseus/playground
```

Then, import and bind it to your express app instance:

```typescript
// import the route
import { playground } from "@colyseus/playground";

// bind it as an express middleware
app.use("/playground", playground);
```

## Contribute

This tool is built using React and TailwindCSS, making it easier for community
members to contribute.

You are welcome to use the [feedback thread](https://github.com/orgs/colyseus/discussions/585) to share ideas for features and/or improvements.

Pull-requests are also welcome!
