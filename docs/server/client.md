# Web-Socket Client

The `client` instance present on:

- [`Room#clients`](/server/room/#clients-websocket)
- [`Room#onJoin()`](/server/room/#onjoin-client)
- [`Room#onLeave()`](/server/room/#onleave-client-consented)
- [`Room#onMessage()`](/server/room/#onmessage-type-callback)

!!! Note
    This is the raw WebSocket connection coming from the [`ws`](https://www.npmjs.com/package/ws) package. There are more methods available which aren't encouraged to use along with Colyseus.

## Properties

### `sessionId: string`

Unique id per session.

!!! Note
    In the client-side, you can find the [`sessionId` in the `room` instance](/client/room/#sessionid-string).

### `auth: any`

Custom data you return during [`onAuth()`](/server/room/#onauth-client-options-request).

## Methods

### `send(type, message)`

Send message a type of message to the client. Messages are encoded with MsgPack and can hold any JSON-seriazeable data structure.

The `type` can be either a `string` or a `number`.

```typescript
//
// sending message with string type
//
client.send("powerup", { type: "ammo" });

//
// sending message with number type
//
client.send(1, { type: "ammo"});
```

!!! Tip
    This will trigger [`room.onMessage`](/client/room/#onmessage) on the client-side, if registered.

### `leave(code?: number)`

Force disconnection of the `client` with the room.

!!! Tip
    This will trigger [`room.onLeave`](/client/room/#onleave) event on the client-side.

### `error(code, message)`

Send an error with code and message to the client. The client can handle it on [`onError`](/client/room/#onerror)