**Why?**

- Models ([`@colyseus/schema`](https://github.com/colyseus/schema)) should contain only data, without game logic.
- Rooms should have a little code as possible, and forward actions to other structures

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

```typescript
import { Room } from "colyseus";
import { Dispatcher } from "@colyseus/command";

class MyRoom extends Room<YourState> {
  dispatcher = new Dispatcher(this);

  onCreate() {
    this.setState(new YourState());
  }

  onJoin(client, options) {
    this.dispatcher.dispatch(new OnJoinCommand(), { sessionId: client.sessionId });
  }

  onDispose() {
    this.dispatcher.stop();
  }
}
```

How a command implementation looks like:

```typescript
import { Command } from "@colyseus/command";

export class OnJoinCommand extends Command<YourState, { sessionId: string }> {
  execute({ sessionId }) {
    this.state.players[sessionId] = new Player();
  }
}
```

## See more

- See [command definitions](https://github.com/colyseus/command/blob/master/test/scenarios/CardGameScenario.ts)
- See [usage](https://github.com/colyseus/command/blob/master/test/Test.ts)
- See [implementation](https://github.com/colyseus/command/blob/master/src/index.ts)
