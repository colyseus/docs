- [Inspector (`--inspect` flag)](#inspector)
- [Debug messages](#debug-messages)

## Inspector

You can use the the built-in inspector from Node.js to debug your application.

!!! Tip
    Read more about [Debugging Node.js Applications](https://nodejs.org/en/docs/inspector/).

## Debug messages

The server provides some debug messages that you can enable individually per category, by setting the `DEBUG` environment variable.

To enable all logs, you can run your server using:

```
DEBUG=colyseus:* node server.js
```

See below all available debug categories with sample outputs.

### `colyseus:patch`

Logs the number of bytes and interval between patches broadcasted to all clients.

```
colyseus:patch "chat" (roomId: "ryWiL5rLTZ") is sending 28 bytes: +57ms
```

### `colyseus:patch:data`

Displays a human-readable version of the data broadcasted to all clients.

```
colyseus:patch:data [ { op: 'replace', path: '/players/BygiLqrLpZ/x', value: 5 } ] +56ms
```

### `colyseus:cluster`

Logs when worker processes are spawned and re-spawned.

```
colyseus:cluster master spawned with pid 77216 +0ms
colyseus:cluster matchmaking spawned with pid 77217 +8ms
colyseus:cluster fork spawned with pid 77218 +7ms
colyseus:cluster fork spawned with pid 77219 +3ms
colyseus:cluster fork spawned with pid 77220 +3ms
colyseus:cluster fork spawned with pid 77221 +17ms
```

### `colyseus:matchmaking`

Logs the messages sent back and forth from master node to worker processes. You'll see them only if using `ClusterServer`.

```
colyseus:matchmaking requesting CREATE_ROOM +54s
colyseus:matchmaking spawning 'chat' on worker 77218 +52s
colyseus:matchmaking disposing 'chat' on worker 77218 +2s
```
