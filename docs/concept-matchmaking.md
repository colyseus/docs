To allow matchmaking on your Colyseus server, you'll need to implement a room handler, and register it in your server.

See:

- [Room](/server/room/)
- [Server#register()](/server/api/#register-name-string-handler-room-options-any)

## The matchmaking cycle

**1.** Client asks to connect into a specific room:

```typescript fct_label="JavaScript"
// client-side
let room = client.join("battle");
```

```csharp fct_label="C#"
// client-side
Room room = client.Join("battle");
```

**2.** Server will loop through all spawned room instances named `"battle"` and call [`requestJoin`][requestJoin] method against that instance.

```typescript fct_label="Example 1"
// server-side
requestJoin (options: any) {
    // Prevent the client from joining the same room from another browser tab
    return this.clients.filter(c => c.id === options.clientId).length === 0;
}
```

```typescript fct_label="Example 2"
// server-side
onInit (options: any) {
    this.password = options.password;
}

requestJoin (options: any) {
    // Private room. Only accept connections with the correct password.
    return this.password === options.password;
}
```

**3.** If [`requestJoin`][requestJoin] succeeds, [`Room#onJoin()`](/server/room/#onjoin-client) will be called with the [`client`](/server/client) reference and `options` given by the client.

**4.** If [`requestJoin`][requestJoin] fails on every available room instance, a new instance will be spawned for that client. In case [`requestJoin`][requestJoin] fails again, the client will receive an `"error"` event.

```typescript fct_label="JavaScript"
// client-side
room.onError.add(function(err) {
    console.log("error ocurred:", err);
});
```

```csharp fct_label="C#"
// client-side
room.OnError += (object sender, MessageEventArgs e) => Debug.Log(e.data);
```

### Ranked matches

As an alternative to returning `true` or `false` on `requestJoin`, you can provide a number between `0` and `1` to manage priority. The match-making service will select the highest number for the new user to connect.

On this example, we're prioritizing rooms with the fewer number of clients. You can write your own logic to calculate the average skill level of your user, for example.

```typescript
class MyRoomHandler extends Room {
  // maximum of 10 clients allowed on this room.
  maxClients = 10;

  requestJoin (options: any) {
    return 1 - (this.clients.length / 10);
  }
}
```

[requestJoin]: api-room/#requestjoin-options-isnew
