You can register as many custom room handlers as you want on the server.

When creating a room class, you'll need to implement its [basic API](Room-API) in order to change its state to deal with your game, such as:

- `requestJoin (options)`
- `onJoin (client, options)`
- `onLeave (client)`
- `onMessage (client, data)`

```javascript
var Room = require('colyseus').Room

class ChatRoom extends Room {

  onInit (options) {
    // initialize room
  }

  onJoin (client, options) {
    console.log(client.id, "joined!")
  }

  onLeave (client) {
    console.log(client.id, "left!")
  }

  onMessage (client, data) {
    console.log(client.id, "sent", data)
  }
}

module.exports = ChatRoom
```

## Registering the room handler

Considering you have a `colyseus.Server` or `colyseus.ClusterServer` instance in your `index.js` file ([as in the example project](https://github.com/gamestdio/colyseus-examples/blob/master/index.ts)), you'll need to specify a unique identifier for your room handler upon registration.

```javascript
gameServer.register('chat', ChatRoom);
```

You can register the same room class multiple times, by using different identifiers. Use the third argument to set custom `onInit()` options.

```javascript
gameServer.register('chat', ChatRoom);
gameServer.register('chat_with_more_players', ChatRoom, {
  maxClients: 20
})
```

In this example, we're going to limit the maximum clients allowed on rooms called `'chat_room_with_more_players'` to `20`. In order to make this `maxClients` option work as expected, we'll need to implement the `requestJoin` method:

```javascript
class ChatRoom extends Room {
  onInit (options) {
    this.options = options;
  }

  // ...
  requestJoin(options) {
    return this.clients.length < this.options.maxClients;
  }
  // ...
}
```

## Listening to room events outside the room scope

You can listen to room events per registered room handler, outside the room scope, by listening to these events:

- `"create"` - when room has been created
- `"dispose"` - when room has been disposed
- `"join"` - when a client join the room
- `"leave"` - when a client leave the room
- `"lock"` - when room has been locked
- `"unlock"` - when room has been unlocked

**Example:**

```typescript
gameServer.register("chat", ChatRoom).
  on("create", (room) => console.log("room created:", room.roomId)).
  on("dispose", (room) => console.log("room disposed:", room.roomId)).
  on("join", (room, client) => console.log(client.id, "joined", room.roomId)).
  on("leave", (room, client) => console.log(client.id, "left", room.roomId));
```

**Note:** It's completely discouraged to use these methods to manipulate room state. Implement the [abstract methods](Room-API#abstract-methods) in your room class instead.