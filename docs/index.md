---
icon: material/home
---

# What is Colyseus?

Colyseus is a framework for writing your own authoritative multiplayer game servers using JavaScript/TypeScript and Node.js, and easily integrating it with your favorite game engine.

<div class="grid cards" markdown>

- [**:octicons-people-16: Room system/Matchmaking**](/server/room) – from a single _room definition_, clients can join or create different game rooms.
- [**:octicons-sync-16: State sync**](/state) – automatically synchronize the state from the server with connected clients.
- [**:octicons-server-16: Scalable**](/scalability) – built to be horizontally and/or vertically scalable
- [**:octicons-cloud-16: Cloud-agnostic**](/deployment) – you may self-host it on your own servers for free, or use our commercial [Colyseus Cloud](https://cloud.colyseus.io/) service.

</div>

---

## Getting started

Before we start, let's make sure you have the necessary system requirements installed in your local machine.

**Requirements**:

- [Download and install Node.js](https://nodejs.org/) LTS version
- [Download and install Git SCM](https://git-scm.com/downloads)
- [Download and install Visual Studio Code](https://code.visualstudio.com/) (or other editor of your choice)

## Creating your server

Use the command below to set up a new Colyseus server project:

=== ":octicons-terminal-16: Terminal: Node.js"

    ``` bash
    # Create a new Colyseus project
    npx create colyseus-app@latest ./my-server

    # Enter the project directory
    cd my-server

    # Run the server
    npm start
    ```

=== ":octicons-terminal-16: Terminal: Bun"

    ``` bash
    # Create a new Colyseus project
    bunx create-colyseus-app@latest ./my-server

    # Enter the project directory
    cd my-server

    # Install Bun transport & Run the server
    bun add @colyseus/bun-websockets
    bun run src/index.ts
    ```

---

## Next steps

- See how to connect to the server through one of the available [client-side SDKs](/client/).
- Implement your own [Room definition](/server/room) to handle your game sessions.
- Learn how to [exchange messages](/server/room/#onmessage-type-callback) between client and server.
- Learn how the [state synchronization](/state/) works.
- Experiment, play, and have fun!
