**Why?**

- Models ([`@colyseus/schema`](https://github.com/colyseus/schema)) should contain only data, without game logic.
- Rooms should have as little code as possible, and forward actions to other structures

**The command pattern has several advantages, such as:**

- It decouples the classes that invoke the operation from the object that knows how to execute the operation.
- It allows you to create a sequence of commands by providing a queue system.
- Implementing extensions to add a new command is easy and can be done without changing the existing code.
- Have strict control over how and when commands are invoked.
- The code is easier to use, understand and test since the commands simplify the code.

## Usage

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

## See more

- See [command definitions](https://github.com/colyseus/command/blob/master/test/scenarios/CardGameScenario.ts)
- See [usage](https://github.com/colyseus/command/blob/master/test/Test.ts)
- See [implementation](https://github.com/colyseus/command/blob/master/src/index.ts)
