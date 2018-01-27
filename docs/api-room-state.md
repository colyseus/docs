The room handlers are stateful in Colyseus. Each room holds its own state. The server automatically broadcasts the changes (patched state) to all connected clients in a configurable interval.

**Room state diagram:**

```
              room.send({ action: "left" })                             
                                                                        
                           |                                            
      +------------+       |       +-----------------------------------+
+-----| Client #1  --------|       |  Room handler #1                  |
|     +------------+       |       |                                   |
|     +------------+       |       |  onMessage (client, data) {       |
|------ Client #2  |       --------+    if (data.action === "left") {  |
|     +------------+               |      // update the room state     |
|     +------------+               |    }                              |
|------ Client #3  |               |  }                                |
|     +------------+               +-----------------------------------+
|                                                    |                  
|        patch state broadcast (binary diff)         |                  
|----------------------------------------------------+
```

There are two ways of dealing with the room state: using plain JavaScript objects, or having a state handler class.

## Plain Object State

The simplest way to deal with the room state is using a plain JavaScript object.

```javascript
class ChatRoom extends Room {
  constructor(options) {
    super(options)

    // broadcast patched state every 1 second
    this.setPatchRate( 1000 )

    // use a plain object state, holding the room "messages".
    this.setState({
      messages: []
    })
  }

  onMessage (client, data) {
    this.state.messages.push(data.message)
  }
}
```

## State Handler Class

Even though you can use plain objects to define the state directly in the room handler, the recommended way is to define your own data structures for it, and methods to manipulate the state inside these data structures.

You can use the `@nosync` decorator to define data that won't be synched with the clients (non-enumerable).

```typescript
import { nosync, EntityMap } from "colyseus";

export class StateHandler {
  players: any = {};

  @nosync mapBuilder =  new MapBuilder();

  constructor () {
    this.players = {};
    this.map = this.mapBuilder.build();
  }

  restart () {
    this.map = this.mapBuilder.build();
  }

  addPlayer (client) {
    this.players[ client.id ] = {};
  }

  removePlayer (client) {
    delete this.players[ client.id ];
  }

}
```

On this example, the `StateHandler` creates a `MapBuilder` instance (that won't be visible in the client-side), which would be responsible for creating the map data. It exposes some methods to be called from the parent `Room` instance, such as `addPlayer` and `restart`.

To use this `StateHandler` class in a `Room` instance it would look like this:

```typescript
import { Room } from "colyseus"
import { StateHandler } from "./StateHandler";

export class MapRoom extends Room<StateHandler> {
  onInit (options) {

    // sync state every 50ms
    this.setPatchRate( 1000 / 20 );

    // initialize StateHandler
    this.setState( new StateHandler() );

    // reset the state every 3 minutes
    setInterval(() => this.state.restart(), 1000 * 60 * 3);
  }

  onJoin (client) {
    // add player instance to room state
    this.state.addPlayer(client);
  }

  onLeave (client) {
    // add player instance to room state
    this.state.removePlayer(client);
  }
}
```

You can go on and define more data structures for any kind of object you need. Let's define the `Player` now.

```typescript
export class Player {
  life: number = 50;
  maxLife: number = 50;
  damage: number = 9;

  constructor () {
    // recovers a life a little every 2 seconds
    setInterval(() => this.recoverLife(), 2000);
  }

  recoverLife () {
    if (this.life < this.maxLife) {
      this.life++
    }
  }

  takeDamage (otherPlayer) {
    this.life -= otherPlayer.damage
  }
}
```

Having defined the `Player` class, you'd instantiate it rather than using plain objects in the `StateHandler#addPlayer` method:

```typescript
// StateHandler.ts
// ...
  addPlayer (client) {
    this.players[ client.id ] = new Player();
  }
// ...
```