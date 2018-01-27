As you've seen in [room handlers](Room-handlers) section, you can register as many room handlers as you want, possibly having custom options when initializing them.

The server will always try to instantiate a new room in case the client couldn't join in any of the existing rooms.

Each room you register on the server should implement the `requestJoin(options: any): bool | number` method, which will receive the join request options from the client. The match-making service will call the `requestJoin` method in all available rooms to determine which one he should connect.

### Maximum number of clients

If the only metric you want to use to allow new clients into your room is the number of clients already connected to it, you can simply use the `maxClients` property. No need to implement the `requestJoin` method.

```typescript
class MyRoomHandler extends Room {
  // maximum of 10 clients allowed on this room.
  maxClients = 10;
}
```

### The `requestJoin` method

The simplest usage of `requestJoin` is by returning `true` or `false` to determine if the user request will be accepted.

On the example below, we're combining two features: Initializing the room with custom options (`onInit (options)`) 
to set the `"map"` property, and making the rooms allow connections only when the same `"map"` is provided by the client upon connection.

```typescript
class MapRoomHandler extends Room {
  // maximum of 10 clients allowed on this room.
  maxClients = 10;

  map: string;

  onInit (options: any) {
    this.map = options.map;

    // ...
    // you would initialize the "map" here from the filesystem, database, or somewhere else.
    // ...
  }

  requestJoin (options: any) {
    return (options.map === this.map);
  }
}

// Registering the room handler with options
gameServer.register("forest", MapRoomHandler, { map: "forest" });
gameServer.register("mountains", MapRoomHandler, { map: "mountains" });
gameServer.register("cavern", MapRoomHandler, { map: "cavern" });
```

In the client-side ([colyseus.js](https://github.com/gamestdio/colyseus.js)), you'd request to join one of the registered handlers. 

**Example:**

```typescript
import { Client } from "colyseus.js"
let client = new Client("ws://localhost:2657");
let room = client.join("forest");
room.onJoin.add(() => console.log("joined successfully!"));
```

### Ranked matches

As an alternative to returning `true` or `false` on `requestJoin`, you can provide a number between `0` and `1`. The match-making service will select the highest number for a new user to connect.

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