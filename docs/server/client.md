# Server API &raquo; Client

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

Send a type of message to the client. Messages are encoded with MsgPack and can hold any JSON-seriazeable data structure.

The `type` can be either a `string` or a `number`.

**Sending a message:**

```typescript
//
// sending message with a string type ("powerup")
//
client.send("powerup", { kind: "ammo" });

//
// sending message with a number type (1)
//
client.send(1, { kind: "ammo"});
```

<!-- 
**Sending a schema-encoded message:**

Sending schema-encoded messages is particularly useful for statically-typed languages such as C#.

```typescript
class MyMessage extends Schema {
  @type("string") message: string;
}

const data = new MyMessage();
data.message = "Hello world!";

client.send(data);
```
 -->

!!! Tip
    [See how to handle these messages on client-side.](/client/room/#onmessage)

### `leave(code?: number)`

Force disconnection of the `client` with the room.

!!! Tip
    This will trigger [`room.onLeave`](/client/room/#onleave) event on the client-side.

### `error(code, message)`

Send an error with code and message to the client. The client can handle it on [`onError`](/client/room/#onerror)