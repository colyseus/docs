# State Handling

The room handlers are **stateful** in Colyseus. Each room holds its own state. The mutations of the state are synchronized automatically to all connected clients.

Colyseus currently provides two serialization methods out of the box:

- [Schema](/state/schema/) (default)
- [Fossil Delta](/state/fossil-delta/)

## When the state is synchronized

- When the user successfully joins the room, he receives the full state from the server.
- At every [patchRate](/server/room/#patchrate-number), binary patches of the state are sent to every client (default is `50ms`)
