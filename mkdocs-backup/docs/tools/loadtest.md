# Load Testing / Stress Testing (`@colyseus/loadtest`)

The `@colyseus/loadtest` is a tool for simulating multiple client connections with your Colyseus server, using the [JavaScript SDK](/getting-started/javascript-client/) itself.

[![asciicast](https://asciinema.org/a/229378.svg)](https://asciinema.org/a/229378)

## Caveats

- As this tool is single-threaded, it will struggle to keep too many WebSocket connections open from a single process.
- Usually 200 connections per process is a good number.
- In order to test more connections, you need to use more processes.
- Keep in mind that simulating so many connections is going to stress testing the
  client-side as well as the server.
- It is recommended to distribute the clients on multiple VMs. (_[Colyseus Cloud](https://colyseus.io/cloud-managed-hosting/) plans to offer a stress testing service in the future. Please reach out if you are interested in this._)

## Installation

Install the `@colyseus/loadtest` module:

``` bash
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

=== "TypeScript: `loadtest/example.ts`"

    ``` typescript
    import { Client, Room } from "colyseus.js";
    import { cli, Options } from "@colyseus/loadtest";

    async function main(options: Options) {
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

    cli(main);
    ```

=== "JavaScript: `loadtest/example.js`"

    ``` typescript
    const { Client } = require("colyseus.js");
    const { cli } = require("@colyseus/loadtest");

    function main (options) {
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

    cli(main);
    ```

#### Connecting 50 clients into a `"battle"` room

``` bash
npx tsx loadtest/example.ts --room battle --numClients 50 --endpoint ws://localhost:2567
```
