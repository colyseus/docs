# Best practices & recommendations

This section provides general recommendations and best practices to keep your codebase healthy and readable for your team. They are all optional, but if followed can improve code readability and cleanliness.

- Keep your room classes as small as possible, delegating game-specific functionality to other composable structures.
- Keep your synchronizeable data structures as small as possible
    - Ideally, each class extending `Schema` should only have field definitions.
    - Do not implement _heavy_ game logic inside `Schema` structures. _Some_ logic is fine, specially if they're self-contained within the scope of the structure itself, mutating only its own properties.
- Rooms should have as little code as possible, and forward actions to other structures
- Your game logic should be handled by other structures, such as:
    - Custom external functions
    - The [Command Pattern](#the-command-pattern).
    - An [Entity-Component System](#entity-component-system-ecs).

## Unit Testing

See how to [Unit Test](/colyseus/tools/unit-testing/) your application. Applications created via `npm init colyseus-app` already start with a small testing boilerplate you can modify to meet your needs.

## Design Patterns

### The Command Pattern

The command pattern has several advantages, such as:

- It decouples the classes that invoke the operation from the object that knows how to execute the operation.
- It allows you to create a sequence of commands by providing a queue system.
- Implementing extensions to add a new command is easy and can be done without changing the existing code.
- Have strict control over how and when commands are invoked.
- Improves code readability and the possibility of unit testing.

#### Usage

Installation

```
npm install --save @colyseus/command
```

Initialize the `dispatcher` in your room implementation:

```typescript fct_label="TypeScript"
import { Room } from "colyseus";
import { Dispatcher } from "@colyseus/command";

import { OnJoinCommand } from "./OnJoinCommand";

class MyRoom extends Room<YourState> {
  dispatcher = new Dispatcher(this);

  onCreate() {
    this.setState(new YourState());
  }

  onJoin(client, options) {
    this.dispatcher.dispatch(new OnJoinCommand(), {
        sessionId: client.sessionId
    });
  }

  onDispose() {
    this.dispatcher.stop();
  }
}
```

```typescript fct_label="JavaScript"
const colyseus = require("colyseus");
const command = require("@colyseus/command");

const { OnJoinCommand } = require("./OnJoinCommand");

class MyRoom extends colyseus.Room {

  onCreate() {
    this.dispatcher = new command.Dispatcher(this);
    this.setState(new YourState());
  }

  onJoin(client, options) {
    this.dispatcher.dispatch(new OnJoinCommand(), {
        sessionId: client.sessionId
    });
  }

  onDispose() {
    this.dispatcher.stop();
  }
}
```

How a command implementation looks like:

```typescript fct_label="TypeScript"
// OnJoinCommand.ts
import { Command } from "@colyseus/command";

export class OnJoinCommand extends Command<MyRoom, {
    sessionId: string
}> {

  execute({ sessionId }) {
    this.state.players[sessionId] = new Player();
  }

}
```

```typescript fct_label="JavaScript"
// OnJoinCommand.js
const command = require("@colyseus/command");

exports.OnJoinCommand = class OnJoinCommand extends command.Command {

  execute({ sessionId }) {
    this.state.players[sessionId] = new Player();
  }

}
```

#### See more

- See [command definitions](https://github.com/colyseus/command/blob/master/test/scenarios/CardGameScenario.ts)
- See [usage](https://github.com/colyseus/command/blob/master/test/Test.ts)
- See [implementation](https://github.com/colyseus/command/blob/master/src/index.ts)

### Entity-Component System (ECS)

We currently do not have an official ECS (Entity-Component System), although we've seen members of the community implement their own solutions.

!!! Warning "Very experimental"
    Some work [has started trying to combine ECSY with @colyseus/schema](http://github.com/endel/ecs).
