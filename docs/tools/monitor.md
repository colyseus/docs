# Monitor Panel (`@colyseus/monitor`)

The `@colyseus/monitor` is a handy tool that allows you to view and inspect the current list of rooms spawned by the server.

**Features**

- List all active rooms
    - Force to dispose a specific room
- Inspect a specific room
    - View room's state
    - Send/broadcast messages for a client
    - Force to disconnect a client.

<img src="https://github.com/colyseus/colyseus/raw/master/packages/monitor/media/demo.gif?raw=true" />

## Installation

Install the module:

```
npm install --save @colyseus/monitor
```

Include it in your project:

=== "TypeScript"

``` typescript
// ...
import { monitor } from "@colyseus/monitor";

// ...
app.use("/colyseus", monitor());
```

=== "JavaScript"

``` javascript
// ...
const monitor = require("@colyseus/monitor").monitor;

// ...
app.use("/colyseus", monitor());
```


## Restrict access to the panel using a password

You can use an express middleware to enable authentication on the monitor route, such as `express-basic-middleware`:

``` bash
npm install --save express-basic-auth
```

Create a user and password using `express-basic-auth`.

``` typescript
import basicAuth from "express-basic-auth";

const basicAuthMiddleware = basicAuth({
    // list of users and passwords
    users: {
        "admin": "admin",
    },
    // sends WWW-Authenticate header, which will prompt the user to fill
    // credentials in
    challenge: true
});

app.use("/colyseus", basicAuthMiddleware, monitor());
```

## Setting custom room listing columns

``` typescript
app.use("/colyseus", basicAuthMiddleware, monitor({
  columns: [
    'roomId',
    'name',
    'clients',
    { metadata: "spectators" }, // display 'spectators' from metadata
    'locked',
    'elapsedTime'
  ]
}));
```

If unspecified, the default room listing columns are: `['roomId', 'name', 'clients', 'maxClients', 'locked', 'elapsedTime']`.
