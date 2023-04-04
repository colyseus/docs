# Load Testing / Stress Testing (`@colyseus/loadtest`)

The `@colyseus/loadtest` tool is useful when you'd like to battle test your server and see how it is going to perform on a live environment.

[![asciicast](https://asciinema.org/a/229378.svg)](https://asciinema.org/a/229378)

## Installation

Install the `@colyseus/loadtest` module:

```
npm install --save-dev @colyseus/loadtest
```

## Usage

The `colyseus-loadtest` command requires a few arguments to work:

- `script`: The custom script the tool is going to use
- `--endpoint`: Your server endpoint (by default uses `ws://localhost:2567`)
- `--room`: Name of the room you'd like to connect to
- `--numClients`: Number of clients you'd like to connect into the room.

### Example

This is an example scripting file. Based on the room lifecycle events for each connected client, you may implement a "bot" to interact with the room.

```typescript fct_label="TypeScript"
// script.ts
import { Client, Room } from "colyseus.js";
import { Options } from "@colyseus/loadtest";

export async function main(options: Options) {
    const client = new Client(options.endpoint);
    const room: Room = await client.joinOrCreate(options.roomName, {
        // your join options here...
    });

    console.log("joined successfully!");

    room.onMessage("*", (type, message) => {
        console.log("onMessage:", type, message);
    });

    room.onStateChange((state) => {
        console.log(room.sessionId, "new state:", state);
    });

    room.onError((err) => {
        console.log(room.sessionId, "!! ERROR !!", err.message);
    })

    room.onLeave((code) => {
        console.log(room.sessionId, "left.");
    });
}
```

```typescript fct_label="JavaScript"
// script.js
exports.main = function (options) {
    const client = new Client(options.endpoint);
    const room = await client.joinOrCreate(options.roomName, {
        // your join options here...
    });

    console.log("joined successfully!");

    room.onMessage("*", (type, message) => {
        console.log("onMessage:", type, message);
    });

    room.onStateChange((state) => {
        console.log(room.sessionId, "new state:", state);
    });

    room.onError((err) => {
        console.log(room.sessionId, "!! ERROR !!", err.message);
    })

    room.onLeave((code) => {
        console.log(room.sessionId, "left.");
    });
}
```

### Connecting 50 clients into a `"battle"` room

```
npx colyseus-loadtest script.ts --room battle --numClients 50 --endpoint ws://localhost:2567
```