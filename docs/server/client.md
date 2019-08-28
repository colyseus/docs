# Web-Socket Client

The `client` instance present on:

- [`Room#clients`](/server/room/#clients-websocket)
- [`Room#onJoin()`](/server/room/#onjoin-client)
- [`Room#onMessage()`](/server/room/#onmessage-client-data)
- [`Room#onLeave()`](/server/room/#onleave-client-consented)

!!! Note
    This is the raw WebSocket connection coming from the [`ws`](https://www.npmjs.com/package/ws) package. There are more methods available which aren't encouraged to use along with Colyseus.

## Properties

### `id: string`

Alias to `sessionId`.

### `sessionId: string`

Unique id per session. Whilst you may have the same `id` for multiple sessions from the same client, the `sessionId` is always unique.

!!! Note
    In the client-side, you can find the [`sessionId` in the `room` instance](/client/room/#sessionid-string).

### `auth: any`

Custom data you return during [`onAuth()`](/server/room/#onauth-client-options-request).

## Methods

### `close(code?: number)`

Force disconnection of the `client` with the server.

!!! Tip
    This will trigger [`room.onLeave`](/client/room/#onleave) event on the client-side.

