# Room API (Server-side)

Considering that you already [set up your server](/api-server), now it's time to register session handlers, and start accepting connections from your users.

You'll define session handlers creating classes that extends from `Room`.

```typescript fct_label="JavaScript"
const colyseus = require('colyseus');

export class MyRoom extends colyseus.Room {
    // When room is initialized
    onInit (options) { }

    // Checks if a new client is allowed to join. (default: `return true`)
    requestJoin (options, isNew) { }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth (options) { }

    // When client successfully join the room
    onJoin (client, options, auth) { }

    // When a client sends a message
    onMessage (client, message) { }

    // When a client leaves the room
    onLeave (client, consented) { }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
}
```

```typescript fct_label="TypeScript"
import { Room, Client } from "colyseus";

export class MyRoom extends Room {
    // When room is initialized
    onInit (options: any) { }

    // Checks if a new client is allowed to join. (default: `return true`)
    requestJoin (options: any, isNew: boolean) { }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth (options: any) { }

    // When client successfully join the room
    onJoin (client: Client, options: any, auth: any) { }

    // When a client sends a message
    onMessage (client: Client, message: any) { }

    // When a client leaves the room
    onLeave (client: Client, consented: boolean) { }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
}
```

## Abstract methods

Room handlers can implement all these methods.

### `onInit (options)`

Is called once when room is initialized. You may specify custom initialization options when registering the room handler.

!!! Tip
    The `options` will contain the merged values you specified on [Server#register()](/api-server/#register-name-string-handler-room-options-any) + the options provided by the first client on `client.join()`

### `requestJoin (options, isNew)`

**Parameters:**

- `options`: The options provided by the client ([`client.join()`](/client-overview#join-roomname-string-options-any)), merged with options provided by the server ([`gameServer.register()`](/api-server/#register-name-string-handler-room-options-any)).
- `isNew`: will be `true` for rooms being created and `false` for existing ones.

Synchronous function to check if a new client is allowed to join.

If left non-implemented, this method returns `true`, allowing any client to connect.

### `onAuth (options)`

Can be used to verify authenticity of the client that's joining the room.

If left non-implemented it returns `true`, allowing any client to connect.

See [authentication](/api-authentication) section.

### `onJoin (client, options, auth?)`

**Parameters:**

- `client`: The [`client`](/api-client) instance.
- `options`: merged values specified on [Server#register()](/api-server/#register-name-string-handler-room-options-any) with the options provided the client on [`client.join()`](/client-overview/#join-roomname-string-options-any)
- `auth`: (optional) auth data returned by [`onAuth`](#onauth-options) method.

Is called when client successfully join the room, after `requestJoin` and `onAuth` has been succeeded.

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

### `onLeave (client, consented)`

Is called when a client leave the room. If the disconnection was [initiated by the client](/client-room/#leave), the `consented` parameter will be `true`, otherwise, it will be `false`.

You can define this function as `async`. See [graceful shutdown](/api-graceful-shutdown)

### `onDispose ()`

Cleanup callback, called after there are no more clients in the room.

You can define this function as `async`. See [graceful shutdown](/api-graceful-shutdown)

## Public properties

### `clients: WebSocket[]`

The array of connected clients. See [Web-Socket Client](/api-client).

### `maxClients: number`

Maximum number of clients allowed to connect into the room. When room reaches
this limit, it is locked automatically. Unless the room was explicitly locked by
you via [lock()](#lock) method, the room will be unlocked as soon as a client
disconnects from it.

### `patchRate: number`

Frequency to send the room state to connected clients (in milliseconds)

See [state synchronization](/concept-state-synchronization/).

### `autoDispose: boolean`

Automatically dispose the room when last client disconnect. (default: `true`)

### `locked: boolean` (read-only)

This property will change on these situations:

- The maximum number of allowed clients has been reached (`maxClients`)
- You manually locked, or unlocked the room using [`lock()`](#lock) or [`unlock()`](#unlock).

### `clock: ClockTimer`

A [`ClockTimer`](https://github.com/gamestdio/timer#api) instance, used for
[timing events](/api-timing-events).

### `presence: Presence`

The `presence` instance. Check [Presence API](/api-presence) for more details.

## Public methods

Room handlers have these methods available.

### `setState (object)`

Set the new room state.

!!! Warning
    Do not call this method for updates in the room state. The binary patch algorithm is re-set every time you call it.

!!! tip
    You'll usually call this method only once (on [`Room.onInit()`](#oninit-options)) in your room handler.

### `setSimulationInterval (callback[, milliseconds=16.6])`

(Optional) Set a simulation interval that can change the state of the game. The simulation interval is your game loop. Default simulation interval: 16.6ms (60fps)

```typescript
onInit () {
    this.setSimulationInterval(() => this.update());
}

update () {
    // implement your physics or world updates here!
    // this is a good place to update your `this.state`
}
```

### `setPatchRate (milliseconds)`

Set frequency the patched state should be sent to all clients. (default: `50` = 20fps)

### `setMetadata (metadata)`

Set metadata for the room instance. This metadata is public when requesting the
room list through [`client.getAvailableRooms()`](/client-overview/#getavailablerooms-roomname) method.

### `setSeatReservationTime (seconds)`

(Default=3) Set the number of seconds a room can wait for a client to effectively join the room. You should consider how long your [`onAuth()`](#onauth-options) will have to wait for setting a different seat reservation time. The default value is usually good enough.

### `send (client, message)`

Send a message to a particular client.

```typescript fct_label="Server"
this.send(client, { message: "Hello world!" });
```

!!! Tip
    [See how to handle these messages on client-side.](/client-room/#onmessage)

### `broadcast ( message, options? )`

Send a message to all connected clients. 

Available options are:

- **`except`**: a [`Client`](/api-client/) instance not to send the message to
- **`afterNextPatch`**: waits until next patch to broadcast the message

#### Examples

Broadcasting a message to all clients:

```typescript
onMessage (client, message) {
    if (message === "action") {
        // broadcast a message to all clients
        this.broadcast("an action was taken!");
    }
}
```

Broadcasting a message to all clients, except the one who sent it:

```typescript
onMessage (client, message) {
    if (message === "fire") {
        // sends "fire" event to every client, except the one who triggered it.
        this.broadcast("fire!", { except: client });
    }
}
```

Broadcasting a message to all clients, only after a change in the state has been applied:

```typescript
onMessage (client, message) {
    if (message === "destroy") {
        // perform changes in your state!
        this.state.destroySomething();

        // this message will arrive only after new state has been applied
        this.broadcast("has been destroyed!", { afterNextPatch: true });
    }
}
```

!!! Tip
    [See how to handle these messages on client-side.](/client-room/#onmessage)

### `lock ()`

Locking the room will remove it from the pool of available rooms for new clients to connect to.

### `unlock ()`

Unlocking the room returns it to the pool of available rooms for new clients to connect to.

### `disconnect ()`

Disconnect all clients, then dispose.

### `allowReconnection (client, seconds)`

Allow the specified client to [`rejoin`](/client-overview/#rejoin-roomnameorid-string-sessionid-string) into the room. Must be used inside [`onLeave()`](#onleave-client) method.

```typescript
async onLeave (client, consented: boolean) {
  // flag client as inactive for other users
  this.state.players[client.sessionId].connected = false;

  try {
    if (consented) {
        throw new Error("consented leave");
    }

    // allow disconnected client to rejoin into this room until 20 seconds
    await this.allowReconnection(client, 20);

    // client returned! let's re-activate it.
    this.state.players[client.sessionId].connected = true;

  } catch (e) {

    // 20 seconds expired. let's remove the client.
    delete this.state.players[client.sessionId];
  }
}
```
