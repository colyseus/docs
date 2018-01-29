# Room API

Considering that you already [set up your server](concept-worker-processes), now it's time to register session handlers, and start accepting connections from your users.

You'll define session handlers creating classes that extends from `Room`.

```typescript fct_label="TypeScript"
import { Room, Client } from "colyseus";

export class MyRoom extends Room {
    // When room is initialized
    onInit (options: any) { } 

    // Checks if a new client is allowed to join. (default: `return true`)
    requestJoin (options: any) { } 

    // When client successfully join the room
    onJoin (client: Client) { } 

    // When a client leaves the room
    onLeave (client: Client) { } 

    // When a client sends a message
    onMessage (client: Client, data: any) { } 

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
}
```

## Abstract methods

Room handlers can implement all these methods.

### `onInit (options)`

Is called once when room is initialized. You may specify custom initialization options when registering the room handler.

!!! Tip
    The `options` will contain the merged values you specified on [Server#register()](api-server/#register-name-string-handler-room-options-any) + the options provided by the first client on `client.join()`

### `verifyClient (client, options)`

Can be used to verify authenticity of the client that's joining the room. 

If left non-implemented it returns `true`, allowing any client to connect.

See [authentication](api-authentication) section.

### `requestJoin (options)` 

Synchronous function used to checks if a new client is allowed to join. 

If left non-implemented it returns `true`, allowing any client to connect.

### `onJoin (client)` 

Is called when client successfully join the room, after `requestJoin` and `verifyClient` succeeded.

### `onMessage (client, data)` 

Is called when a client sends a message to the server. Here's where you'll process client actions to update the room's state.

**Example:**

```typescript
onMessage (client, data) {
    let player = this.playersByClientId.get(client);

    if (data.command === "left") {
        player.x -= 1;

    } else if (data.command === "right") {
        player.x += 1;
    }
}
```

### `onLeave (client)` 

Is called when a client leave the room. 

You can define this function as `async`. See [graceful shutdown](api-graceful-shutdown)

### `onDispose ()` 

Cleanup callback, called after there are no more clients in the room.

You can define this function as `async`. See [graceful shutdown](api-graceful-shutdown)

## Public properties

### `clients: WebSocket[]` 

The array of connected clients.

### `maxClients: number`

Maximum number of clients allowed to connect into the room

### `patchRate: number`

Frequency to send the room state to connected clients (in milliseconds)

See [state synchronization](concept-state-synchronization/).

### `autoDispose: boolean`

Automatically dispose the room when last client disconnect. (default: `true`)

### `clock: ClockTimer` 

A [`ClockTimer`](https://github.com/gamestdio/timer#api) instance.

## Public methods

Room handlers have these methods available.

### `setState (object)` 

Set the new room state. 

!!! tip
    You'll usually call this method only once in your handler.

Set the current state to be broadcasted / patched.

### `setSimulationInterval (callback[, milliseconds=16.6])` 

(Optional) Create the simulation interval that will change the state of the game. Default simulation interval: 16.6ms (60fps)

### `setPatchRate (milliseconds)` 

Set frequency the patched state should be sent to all clients. (default: `50` = 20fps)

### `send (client, data)` 

Send data to a particular client

### `lock ()` 

Locking the room will remove it from the pool of available rooms for new clients to connect to.

### `unlock ()`

Unlocking the room returns it to the pool of available rooms for new clients to connect to.

### `broadcast ( data )`

Send raw data to all connected clients.

### `disconnect ()`

Disconnect all clients, then dispose