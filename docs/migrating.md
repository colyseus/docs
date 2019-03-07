# Migrating between versions of Colyseus

This document presents all breaking changes on the framework, and what you need
to do to keep your server working on the latest version.

## Migrating to 0.10.x (from 0.9.x)

> TODO

### Server-side

- `EntityMap<T>` has been deprecated. If you're using `EntityMap<T>` to describe a map of entities, you should use the plain TypeScript alternative now. e.g. Replace "`EntityMap<Player>`" with "`{[id: string]: Player}`".

### Client-side

#### colyseus-unity3d

- `client.id` has been renamed to `client.Id`
- `room.id` has been renamed to `room.Id`
- `room.name` has been renamed to `room.Name`
- `room.sessionId` has been renamed to `room.SessionId`
- `room.state` has been renamed to `room.State`
- `e.message` has been renamed to `e.Message` (on `MessageEventArgs` and `ErrorEventArgs`)
- `RoomUpdateEventArgs` has been renamed to `StateChangeEventArgs`
    - `e.state` has been renamed to `e.State`

## Migrating to 0.9.x (from 0.6.x or 0.8.x)

### Server-side

- `ClusterServer` has been deprecated. Use [`Server`](/server/api) instead.
- `Room#verifyClient(client, options)` has been renamed to [`Room#onAuth(options)`](/server/room#onauth-options)
- Integration with [`uws`](https://www.npmjs.com/package/uws) module has changed. See [how to integrate here](/server/api/#optionsengine).

### Client-side

#### colyseus.js
- `room.onData` has been renamed to [`room.onMessage`](/client/room#onmessage).
- `room.onUpdate` has been renamed to [`room.onStateChange`](/client/room#onstatechange)
- `room.data` has been renamed to [`room.state`](/client/room/#state-any)

#### colyseus-unity3d
- `room.OnData` has been renamed to [`room.OnMessage`](/client/room#onmessage).
- `room.OnUpdate` has been renamed to [`room.OnStateChange`](/client/room#onstatechange)
- `room.data` has been renamed to [`room.state`](/client/room/#state-any)

## Migrating to 0.5.x (from 0.4.x)

#### Use `Server#listen` to bind http port.

The `Server` is now using the `ClusterServer` under the hood, which will spawn
workers automatically. If you're using the `Server` instead of `ClusterServer`
directly, you should call its `listen` method.

OLD

```
import { createServer } from 'http';
import { Server } from 'colyseus';
const httpServer = createServer(app);
const gameServer = new Server({ server: httpServer });
httpServer.listen(2567);
```

NEW

```
import { createServer } from 'http';
import { Server } from 'colyseus';
const httpServer = createServer(app);
const gameServer = new Server({ server: httpServer });
gameServer.listen(2567); // calling 'listen' from gameServer instead of httpServer
```

#### `constructor` signature changed. use `onInit` instead.

OLD

```
constructor (options) {
  super(options);
  // ... initialize the room
}
```

NEW

```
constructor () {
  // room has been constructed. no options available yet!
}

onInit (options) {
  // ... initialize the room
}
```

#### `requestJoin` - can return type can be either `boolean` or `number` (`0..1`)

OLD

```
requestJoin (options) {
  // accept connections if this room is not full.
  return this.clients.length < 10;
}
```

NEW

```
requestJoin (options) {
  // give priority to connect on rooms with fewer clients.
  return 1 - (this.clients.length) / 10;
}
```

#### use `patchRate` property instead of `setPatchRate()` method.

OLD

```
constructor (options) {
  this.setPatchRate(1000 / 50);
}
```

NEW

```
class MyRoom extends Room {
  patchRate = 1000 / 50;
}
```

#### `client.id` / `client.sessionId`

- `client.sessionId` - is a unique identifier of a user connected in a room.
- `client.id` - is a unique identifier of a user. if the user connects to the same room twice, you can identify he has two sessions by checking for `client.id`. If you don't bother having the same user connected multiple times in a room, always use `client.sessionId` to identify it.

#### new `room.maxClients` property.

OLD - if you're just checking for `client.length` on `requestJoin`, you probably can switch to `maxClients` instead.

```
requestJoin (options) {
  return this.clients.length < 10;
}
```

NEW

```
class MyRoom extends Room {
  maxClients = 10;
}
```

## Migrating to 0.4.x (from 0.3.x)

#### constructor / patch-rate

OLD constructor / patch-rate

```
class MyRoom extends Room {
  constructor ( options ) {
    super( options, PATH_RATE )
  }
}
```

NEW constructor / patch-rate

```
class MyRoom extends Room {
  constructor ( options ) {
    super( options )
    this.setPatchRate( PATCH_RATE )
  }
}
```

