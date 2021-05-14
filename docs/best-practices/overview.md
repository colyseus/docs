# Best practices with Colyseus

This section provides general recommendations and best practices to keep your codebase healthy and readable for your team.

General object-oriented principles such as [SOLID](https://en.wikipedia.org/wiki/SOLID) apply.

!!! Warning "Important"
    This section needs improvement and more examples! Each paragraph needs it's own page with thorough examples and better explanation.

- Keep your room classes as small as possible, without game logic.
- Keep your synchronizeable data structures as small as possible
    - Ideally, each class extending `Schema` should only have field definitions.
    - Custom getters and setters methods can be implemented, as long as you don't have game logic in them.
- Your game logic should be handled by other structures, such as:
    - See how to use the [Command Pattern](/best-practices/command-pattern/).

## Testing

> TODO: we need to provide a `@colyseus/testing` package with some general recommendations on how to test a Colyseus application.


## Design Patterns

### The Command Pattern

**Why?**

- Models ([`@colyseus/schema`](https://github.com/colyseus/schema)) should contain only data, without game logic.
- Rooms should have as little code as possible, and forward actions to other structures

**The command pattern has several advantages, such as:**

- It decouples the classes that invoke the operation from the object that knows how to execute the operation.
- It allows you to create a sequence of commands by providing a queue system.
- Implementing extensions to add a new command is easy and can be done without changing the existing code.
- Have strict control over how and when commands are invoked.
- The code is easier to use, understand and test since the commands simplify the code.

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

const OnJoinCommand = require("./OnJoinCommand");

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

export class OnJoinCommand extends Command<YourState, {
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
