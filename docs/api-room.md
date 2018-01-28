# Room API

Considering that you already [set up your server](concept-worker-processes), now it's time to register session handlers, and start accepting connections from your users.

You'll define session handlers creating classes that extends from `Room`.

```typescript fct_label="TypeScript"
import { Room } from "colyseus";

export class MyRoom extends Room {

    // When room is initialized
    onInit (options) {} 

    // Checks if a new client is allowed to join. (default: `return true`)
    requestJoin (options) {} 

    // When client successfully join the room
    onJoin (client) {} 

    // When a client leaves the room
    onLeave (client) {} 

    // When a client sends a message
    onMessage (client, data) {} 

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () {} 
}
```

## Abstract methods

Room handlers can implement all these methods.

### `onInit (options)`

Is called once when room is initialized.

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

### `patchRate` 

Frequency to send the room state to connected clients (in milliseconds)

### `maxClients` 

Maximum number of clients allowed to connect into the room

### `autoDispose` 

Automatically dispose the room when last client disconnect. (default: `true`)

### `clock` 

A [`ClockTimer`](https://github.com/gamestdio/clock-timer.js) instance

### `clients` 

Array of connected clients

## Public methods

Room handlers have these methods available.

### `setState( object )` 

Set the current state to be broadcasted / patched.

### `setSimulationInterval( callback[, milliseconds=16.6] )` 

(Optional) Create the simulation interval that will change the state of the game. Default simulation interval: 16.6ms (60fps)

### `setPatchRate( milliseconds )` 

Set frequency the patched state should be sent to all clients. (default: `50` = 20fps)

### `send( client, data )` 

Send data to a particular client

### `lock()` 

Prevent new clients from joining the room

### `unlock()`

Unlock the room for new clients

### `broadcast( data )`

Send data to all connected clients

### `disconnect()`

Disconnect all clients, then dispose