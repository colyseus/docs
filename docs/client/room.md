# Room API (Client-side)

## Properties

### `state: any`

The current room's state. This variable is always synched with the latest
`state` from the server-side. To listen for updates on the whole state, see
[`onStateChange`](#onstatechange) event.

### `sessionId: string`

Unique identifier for the player. This property matches the [`client.sessionId`](/server/client/#sessionid-string) from the server-side.

### `id: string`

The unique idenfitier of the room. You can share this id with other clients in
order to allow them to connect directly to this room.

```typescript fct_label="JavaScript"
// get `roomId` from the query string
let roomId = location.href.match(/roomId=([a-zA-Z0-9\-_]+)/)[1];

// joining a room by its id
client.joinById(roomId).then(room => {
  // ...
});
```

### `name: string`

Name of the room handler. Ex: `"battle"`.

## Methods

### `send (data)`

Send message to the room handler.

```typescript fct_label="JavaScript"
room.send({ move: "left" });
```

```csharp fct_label="C#"
await room.Send(new { move = "left" });
```

```lua fct_label="lua"
room:send({ move = "left" })
```

```haxe fct_label="Haxe"
room.send({ move: "left" });
```

Use [Room#onMessage()](/server/room/#onmessage-client-data) from the server-side to read the message.

### `leave ()`

Disconnect from the room.

```typescript fct_label="JavaScript"
room.leave();
```

```csharp fct_label="C#"
room.Leave();
```

```lua fct_label="lua"
room:leave()
```

```haxe fct_label="Haxe"
room.leave();
```

!!! Tip
    Use [Room#onLeave()](/server/room/#onleave-client-consented) to handle the disconnection from the server-side.

### `removeAllListeners()`

Removes `onMessage`, `onStateChange`, `onLeave` and `onError` listeners.

Also removes all `.listen()` calls if you're using [Fossil Delta](/state/fossil-delta/#client-side) serializer..

## Events

### onStateChange

This event is triggered when the server updates its state.

```typescript fct_label="JavaScript"
room.onStateChange.once((state) => {
  console.log("this is the first room state!", state);
});

room.onStateChange((state) => {
  console.log("the room state has been updated:", state);
});
```

```csharp fct_label="C#"
room.OnStateChange += (state, isFirstState) => {
  if (isFirstState) {
    Debug.Log ("this is the first room state!");
  }

  Debug.Log ("the room state has been updated");
}
```

```lua fct_label="lua"
room:on("statechange", function(state)
  print("new state:", state)
end)
```

```haxe fct_label="Haxe"
room.onStateChange += function(state) {
  trace("new state:" + Std.string(state));
};
```

```cpp fct_label="C++"
room.onStateChange = [=](State>* state) {
  std::cout << "new state" << std::endl;
  // ...
};
```

### onMessage

This event is triggered when the server sends a message directly to the client.

```typescript fct_label="JavaScript"
room.onMessage((message) => {
  console.log("message received from server");
  console.log(message);
});
```

```csharp fct_label="C#"
room.OnMessage += (message) => {
  Debug.Log ("message received from server");
  Debug.Log(message);
}
```

```lua fct_label="lua"
room:on("message", function(message)
  print("message received from server")
  print(message)
end)
```

```haxe fct_label="Haxe"
room.onMessage += function(message) {
  trace("message received from server");
  trace(Std.string(message));
};
```

```cpp fct_label="C++"
room.onMessage = [=](msgpack::object message) -> void {
    std::cout << "message received from server" << std::endl;
    std::cout << message << std::endl;
};
```

!!! Tip
    To send a message from the server directly to the clients you'll need to use
    either [room.send()](/server/room/#send-client-message) or
    [room.broadcast()](/server/room/#broadcast-message)

### onLeave

This event is triggered when the client leave the room. 

**Possible codes:**

- `1000`: Regular Socket Shutdown
- higher than `1000`: Abnormal Socket Shutdown ([more details](https://github.com/Luka967/websocket-close-codes#websocket-close-codes))

```typescript fct_label="JavaScript"
room.onLeave((code) => {
  console.log("client left the room");
});
```

```csharp fct_label="C#"
room.OnLeave += (code) => {
  Debug.Log ("client left the room");
}
```

```lua fct_label="lua"
room:on("leave", function()
  print("client left the room")
end)
```

```haxe fct_label="Haxe"
room.onLeave += function () {
  trace("client left the room");
};
```

```haxe fct_label="Haxe"
room.onLeave = [=]() -> void {
  std::cout << "client left the room" << std::endl;
};
```

### onError

This event is triggered when some error occurs in the room handler.

```typescript fct_label="JavaScript"
room.onError((message) => {
  console.log("oops, error ocurred:");
  console.log(message);
});
```

```csharp fct_label="C#"
room.OnError += (message) => {
  Debug.Log ("oops, error ocurred:");
  Debug.Log(message);
}
```

```lua fct_label="lua"
room:on("error", function(message)
  print("oops, error ocurred:")
  print(message)
end)
```

```haxe fct_label="Haxe"
room.onError += function(message) {
  trace("oops, error ocurred:");
  trace(message);
};
```

```cpp fct_label="C++"
room.onError = [=] (std::string message) => void {
  std::cout << "oops, error ocurred: " << message << std::endl;
};
```
