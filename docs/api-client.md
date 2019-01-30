# Web-Socket Client

The `client` instance present on:

- [`Room#clients`](/api-room/#clients-websocket)
- [`Room#onJoin()`](/api-room/#onjoin-client)
- [`Room#onMessage()`](/api-room/#onmessage-client-data)
- [`Room#onLeave()`](/api-room/#onleave-client-consented)

!!! Note
    This is the raw WebSocket connection coming from the [`ws`](https://www.npmjs.com/package/ws) package. There are more methods available which aren't encouraged to use along with Colyseus.

## Properties

### `id: string`

Unique id per client. When the same client connects with multiple browser tabs, the `id` will be the same for every connection.

### `sessionId: string`

Unique id per session. Whilst you may have the same `id` for multiple sessions from the same client, the `sessionId` is always unique.

!!! Note
    In the client-side, you can find the [`sessionId` in the `room` instance](/client-room/#sessionid-string).

## Methods

### `close(code?: number)`

Force disconnection of the `client` with the server.

!!! Tip
    This will trigger [`room.onLeave`](/client-room/#onleave) event on the client-side.

