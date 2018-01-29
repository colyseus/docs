The room handlers are **stateful** in Colyseus. Each room holds its own state. To allow [synchronization](concept-state-synchronization), you **must** mutate the room's state. The server automatically broadcasts the changes to all connected clients at each patch interval.

## Raw Object State

The simplest way to deal with the room state is using a raw JavaScript objects directly in the `Room` handler.

```typescript
import { Room, Client } from "colyseus";

class BattleRoom extends Room {

  onInit (options: any) {
    this.setState({
      messages: []
    });
  }

  onMessage (client: Client, data: any) {
    this.state.messages.push(data.message);
  }
}
```

## Best practices

### Data structures

Use small data structures to re

### Map of entities (`EntityMap`)

### Private variables (`@nosync`)

### Avoid mutating arrays

You can use arrays in your room's state. If possible, avoid mutating them because it's tricky to synchronize the state properly in the client-side when you do.

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