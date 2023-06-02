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

The playground tool is installed by default on new projects.

```bash
npm install --save @colyseus/playground
```

Import it, and bind it to your express app instance:

```typescript
// import the route
import { playground } from "@colyseus/playground";

// bind it as an express middleware
app.use("/playground", playground);
```

## Contribute

This tool is built using React and TailwindCSS, making it easier for community
members to contribute.

Feel free to [submit your ideas on GitHub Discussions](https://github.com/orgs/colyseus/discussions/categories/ideas), and
contribute with pull-requests!
