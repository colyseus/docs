# Room API (Client-side)

## Properties

### `state: any`

The current room's state. This variable is always synched with the latest
`state` from the server-side. To listen for updates on the whole state, see
[`onStateChange`](#onstatechange) event.

### `sessionId: string`

Unique session identifier.

This property matches the [`client.sessionId`](/server/client/#sessionid-string) from the server-side.

### `id: string`

The unique idenfitier of the room. You can share this id with other clients in
order to allow them to connect directly to this room.

```typescript fct_label="JavaScript"
// get `roomId` from the query string
let roomId = location.href.match(/roomId=([a-zA-Z0-9\-_]+)/)[1];

// connect the client directly into a specific room id
let room = client.join(roomId);
```

!!! Warning
    If you're looking for the unique identifier of the client, use [`client.id`](/client/client/#id-string) instead.

### `name: string`

Name of the room handler. Ex: `"battle"`.

## Methods

### `listen (path: string, callback: Function, immediate?: boolean): Listener`

Listen to state changes applied in the client. Returns a `Listener` instance, that can be removed through [`removeListener()`](#removelistener-listener-listener) method.

!!! Warning "The `listen()` method is only available for [Fossil Delta](/state/fossil-delta/#client-side)"
    See [Fossil Delta](/state/fossil-delta/#client-side) state handling for more details.

### `removeListener (listener: Listener)`

Removes a listener registered through `listen()` method.

!!! Warning "The `removeListener()` method is only available for [Fossil Delta](/state/fossil-delta/#client-side)"
    See [Fossil Delta](/state/fossil-delta/#client-side) state handling for more details.

### `send (data)`

Send message to the room handler.

```typescript fct_label="JavaScript"
room.send({ move: "left" });
```

```csharp fct_label="C#"
room.Send(new { move = "left" });
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

Removes `onJoin`, `onMessage`, `onLeave` and `onError` listeners.

Also removes all `.listen()` calls if you're using [Fossil Delta](/state/fossil-delta/#client-side) serializer..

## Events

### onStateChange

This event is triggered when the server updates its state.

```typescript fct_label="JavaScript"
room.onStateChange.addOnce(function(state) {
  console.log("this is the first room state!", state);
});

room.onStateChange.add(function(state) {
  console.log("the room state has been updated:", state);
});
```

```csharp fct_label="C#"
room.OnStateChange += (object sender, RoomUpdateEventArgs e) => {
  if (e.isFirstState) {
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

### onMessage

This event is triggered when the server sends a message directly to the client.

```typescript fct_label="JavaScript"
room.onMessage.add(function(message) {
  console.log("server just sent this message:");
  console.log(message);
});
```

```csharp fct_label="C#"
room.OnMessage += (object sender, MessageEventArgs e) => {
  Debug.Log ("server just sent this message:");
  Debug.Log(e.message);
}
```

```lua fct_label="lua"
room:on("message", function(message)
  print("server just sent this message:")
  print(message)
end)
```

```haxe fct_label="Haxe"
room.onMessage += function(message) {
  trace("server just sent this message:");
  trace(Std.string(message));
};
```

!!! Tip
    To send a message from the server directly to the clients you'll need to use
    either [room.send()](/server/room/#send-client-message) or
    [room.broadcast()](/server/room/#broadcast-message)

### onJoin

This event is triggered when the client successfuly joins the room.

```typescript fct_label="JavaScript"
room.onJoin.add(function() {
  console.log("client joined successfully");
});
```

```csharp fct_label="C#"
room.OnJoin += (object sender, EventArgs e) => {
  Debug.Log ("client joined successfully");
}
```

```lua fct_label="lua"
room:on("join", function()
  print("client joined successfully")
end)
```

```haxe fct_label="Haxe"
room.onJoin += function () {
  trace("client joined successfully");
};
```

### onLeave

This event is triggered when the client leave the room.

```typescript fct_label="JavaScript"
room.onLeave.add(function() {
  console.log("client left the room");
});
```

```csharp fct_label="C#"
room.OnLeave += (object sender, EventArgs e) => {
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

### onError

This event is triggered when some error occurs in the room handler.

```typescript fct_label="JavaScript"
room.onError.add(function(err) {
  console.log("oops, error ocurred:");
  console.log(err);
});
```

```csharp fct_label="C#"
room.OnError += (object sender, EventArgs e) => {
  Debug.Log ("oops, error ocurred:");
  Debug.Log(e);
}
```

```lua fct_label="lua"
room:on("error", function()
  print("oops, error ocurred:")
  print(e)
end)
```

```haxe fct_label="Haxe"
room.onError += function(err) {
  trace("oops, error ocurred:");
  trace(err);
};
```
