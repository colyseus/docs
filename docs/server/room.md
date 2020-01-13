# Room API (Server-side)

Considering that you already [set up your server](/server/api), now it's time to register room handlers, and start accepting connections from your users.

You'll define room handlers creating classes that extends from `Room`.

```typescript fct_label="TypeScript"
import http from "http";
import { Room, Client } from "colyseus";

export class MyRoom extends Room {
    // When room is initialized
    onCreate (options: any) { }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth (client: Client, options: any, request: http.IncomingMessage) { }

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

```typescript fct_label="JavaScript"
const colyseus = require('colyseus');

export class MyRoom extends colyseus.Room {
    // When room is initialized
    onCreate (options) { }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth (client, options, request) { }

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

## Abstract methods

Room handlers can implement all these methods.

### `onCreate (options)`

Is called once when room is initialized. You may specify custom initialization options when registering the room handler.

!!! Tip
    The `options` will contain the merged values you specified on [Server#define()](/server/api/#define-name-string-handler-room-options-any) + the options provided by [`client.joinOrCreate()`](/client/client/#joinorcreate-roomname-string-options-any) or [`client.create()`](/client/client/#create-roomname-string-options-any)


### `onAuth (client, options, request)`

Can be used to verify authenticity of the client that's joining the room.

If left non-implemented it returns `true`, allowing any client to connect.

See [Authentication API](/server/authentication) section.

!!! Tip "Getting player's IP address"
    You can use the `request` variable to retrieve the user IP address, http headers, and more. E.g.: `request.headers['x-forwarded-for'] || request.connection.remoteAddress`

### `onJoin (client, options, auth?)`

**Parameters:**

- `client`: The [`client`](/server/client) instance.
- `options`: merged values specified on [Server#define()](/server/api/#define-name-string-handler-room-options-any) with the options provided the client on [`client.join()`](/client/client/#join-roomname-string-options-any)
- `auth`: (optional) auth data returned by [`onAuth`](#onauth-client-options-request) method.

Is called when client successfully join the room, after `requestJoin` and `onAuth` has been succeeded.

### `onMessage (client, data)`

Is called when a client sends a message to the server. Here's where you'll process client actions to update the room's state.

**Example:**

```typescript
onMessage (client, data) {
    // typically this object would be held in the Room State
    let player = {x: 1, y: 0};

    if (data.command === "left") {
        player.x -= 1;

    } else if (data.command === "right") {
        player.x += 1;
    }
}
```
Note: The suggested way to maintain shared information about a game world is through using a [Room State](/state/overview.md)

### `onLeave (client, consented)`

Is called when a client leave the room. If the disconnection was [initiated by the client](/client/room/#leave), the `consented` parameter will be `true`, otherwise, it will be `false`.

You can define this function as `async`. See [graceful shutdown](/server/graceful-shutdown)

### `onDispose ()`

Cleanup callback, called after there are no more clients in the room.

You can define this function as `async`. See [graceful shutdown](/server/graceful-shutdown)

## Public properties

### `roomId: string`

A unique, auto-generated, 9-character-long id of the room.

### `roomName: string`

The name of the room you provided as first argument for [`gameServer.define()`](/server/api/#define-name-string-handler-room-options-any).

### `state: T`

The state instance you provided to [`setState()`](#setstate-object).

### `clients: WebSocket[]`

The array of connected clients. See [Web-Socket Client](/server/client).

### `maxClients: number`

Maximum number of clients allowed to connect into the room. When room reaches
this limit, it is locked automatically. Unless the room was explicitly locked by
you via [lock()](#lock) method, the room will be unlocked as soon as a client
disconnects from it.

### `patchRate: number`

Frequency to send the room state to connected clients, in milliseconds. Default is `50`ms (20fps)

### `autoDispose: boolean`

Automatically dispose the room when last client disconnect. Default is `true`

### `locked: boolean` (read-only)

This property will change on these situations:

- The maximum number of allowed clients has been reached (`maxClients`)
- You manually locked, or unlocked the room using [`lock()`](#lock) or [`unlock()`](#unlock).

### `clock: ClockTimer`

A [`ClockTimer`](https://github.com/gamestdio/timer#api) instance, used for
[timing events](/server/timing-events).

### `presence: Presence`

The `presence` instance. Check [Presence API](/server/presence) for more details.

## Public methods

Room handlers have these methods available.

### `setState (object)`

Set the new room state instance. See [State Handling](/state/overview/) for more details on the state object. It's highly recommended to use the new [Schema Serializer](/state/schema/) to handle your state.

!!! Warning
    Do not call this method for updates in the room state. The binary patch algorithm is re-set every time you call it.

!!! tip
    You usually will call this method only once during [`onCreate()`](#onCreate-options) in your room handler.

### `setSimulationInterval (callback[, milliseconds=16.6])`

(Optional) Set a simulation interval that can change the state of the game. The simulation interval is your game loop. Default simulation interval: 16.6ms (60fps)

```typescript
onCreate () {
    this.setSimulationInterval((deltaTime) => this.update(deltaTime));
}

update (deltaTime) {
    // implement your physics or world updates here!
    // this is a good place to update the room state
}
```

### `setPatchRate (milliseconds)`

Set frequency the patched state should be sent to all clients. Default is `50ms` (20fps)

### `setPrivate (bool)`

Set the room listing as private (or revert to public, if `false` is provided).

Private rooms are not listed in the [`getAvailableRooms()`](/client/client/#getavailablerooms-roomname-string) method.

### `setMetadata (metadata)`

Set metadata to this room. Each room instance may have metadata attached to it - the only purpose for attaching metadata is to differentiate one room from another when getting the list of available rooms from the client-side, to connect to it by its `roomId`, using [`client.getAvailableRooms()`](/client/client/#getavailablerooms-roomname).

```typescript
// server-side
this.setMetadata({ friendlyFire: true });
```

Now that a room has metadata attached to it, the client-side can check which room has `friendlyFire`, for example, and connect directly to it via its `roomId`:

```javascript
// client-side
client.getAvailableRooms("battle").then(rooms => {
  for (var i=0; i<rooms.length; i++) {
    if (room.metadata && room.metadata.friendlyFire) {
      //
      // join the room with `friendlyFire` by id:
      //
      var room = client.join(room.roomId);
      return;
    }
  }
});
```

!!! Tip
    [See how to call `getAvailableRooms()` in other languages.](/client/client/#getavailablerooms-roomname)

### `setSeatReservationTime (seconds)`

Set the number of seconds a room can wait for a client to effectively join the room. You should consider how long your [`onAuth()`](#onauth-client-options-request) will have to wait for setting a different seat reservation time. The default value is usually enough. (8 seconds)

### `send (client, message)`

Send a message to a particular client. The `message` can be either a plain JavaScript object, or a [`Schema`](/state/schema) instance.

**Sending a msgpack-encoded message:**

This is the recommended way if you're using an interpreted language on the client-side, such as JavaScript or LUA.

```typescript
this.send(client, { message: "Hello world!" });
```

**Sending a schema-encoded message:**

Sending schema-encoded messages is particularly useful for statically-typed languages such as C#.

```typescript
class MyMessage extends Schema {
  @type("string") message: string;
}

const data = new MyMessage();
data.message = "Hello world!";
this.send(client, data);
```

!!! Tip
    [See how to handle these messages on client-side.](/client/room/#onmessage)

### `broadcast (message, options?)`

Send a message to all connected clients.

Available options are:

- **`except`**: a [`Client`](/server/client/) instance not to send the message to
- **`afterNextPatch`**: waits until next patch to broadcast the message

#### Broadcast examples

Broadcasting a message to all clients:

```typescript
onMessage (client, message) {
    if (message === "action") {
        // broadcast a message to all clients
        this.broadcast("an action has been taken!");
    }
}
```

Broadcasting a message to all clients, except the sender.

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

Broadcasting a schema-encoded message:

```typescript
class MyMessage extends Schema {
  @type("string") message: string;
}

// ...

onMessage (client, message) {
    if (message === "action") {
        const data = new MyMessage();
        data.message = "an action has been taken!";
        this.broadcast(data);
    }
}
```

!!! Tip
    [See how to handle these onMessage() in the client-side.](/client/room/#onmessage)

### `lock ()`

Locking the room will remove it from the pool of available rooms for new clients to connect to.

### `unlock ()`

Unlocking the room returns it to the pool of available rooms for new clients to connect to.

### `allowReconnection (client, seconds)`

Allow the specified client to [`reconnect`](/client/client/#reconnect-roomid-string-sessionid-string) into the room. Must be used inside [`onLeave()`](#onleave-client) method.

```typescript
async onLeave (client, consented: boolean) {
  // flag client as inactive for other users
  this.state.players[client.sessionId].connected = false;

  try {
    if (consented) {
        throw new Error("consented leave");
    }

    // allow disconnected client to reconnect into this room until 20 seconds
    await this.allowReconnection(client, 20);

    // client returned! let's re-activate it.
    this.state.players[client.sessionId].connected = true;

  } catch (e) {

    // 20 seconds expired. let's remove the client.
    delete this.state.players[client.sessionId];
  }
}
```

### `disconnect ()`

Disconnect all clients, then dispose.
