# Web-Socket Client

The `client` instance present on:

- [`Room#clients`](api-room/#clients-websocket)
- [`Room#verifyClient()`](api-room/#verifyclient-client-options)
- [`Room#onJoin()`](api-room/#onjoin-client)
- [`Room#onMessage()`](api-room/#onmessage-client-data)
- [`Room#onLeave()`](api-room/#onleave-client)

## Methods

### `close(code?: number)`

Force disconnection of the `client` with the server.

## Properties

### `id: string`

Unique id per client. When the same client connects with multiple browser tabs, the `id` will be the same for every connection.

### `sessionId: string`

Unique id per session. Whilst you may have the same `id` for multiple sessions from the same client, the `sessionId` is always unique.