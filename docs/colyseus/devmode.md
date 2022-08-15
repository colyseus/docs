**How it works? **

When engaging in iterative development, `ts-node-dev` is forcing the application to restart.
By default, the restart is going to flush application data by disposing every room, disconnecting clients and after the restart there will be an empty new server without any room in it.

To make the iterative development easier the `devMode` is introduced.
The `devMode` works as,

![devMode flow](devmode_flow.png)

As soon as seat reservations are ready for previous clients, Colyseus client-side SDKs(JavaScript SDK, Unity SDK, Defold SDK and Haxe SDK) will re-establish the connection automatically with the server.


### Enabling devMode

The devMode is disabled by default and it can be enabled via server options.
This operation costs heavily and it is recommended not to use it in a production environment.

```typescript fct_label="JavaScript"
const colyseus = require("colyseus");

const gameServer = new colyseus.Server({
  // ...
  devMode: true
});
```

### Restoring data outside the room’s `state`

:warning: **Attention **

Upon devMode connection re-establishing, schema-callbacks(`onAdd`) will be triggered again.
It is advised to be prepared!
