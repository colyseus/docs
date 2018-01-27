# Architecture


## State sync / Binary patches

When connected to a Room, all the clients should have access to the full state available from the server. Here's how it works:

- Upon the first connection, the client receives the latest encoded room state ([msgpack format](https://en.wikipedia.org/wiki/MessagePack)).
- At the `patchRate` interval (default: 50ms), the server will encode the whole room state again. If it differs from the latest encoded state, the delta ([fossil's delta](http://fossil-scm.org/xfer/doc/trunk/www/delta_format.wiki)) between the latest state and the new state is calculated and sent to all connected clients.
- When the client receives the delta, it is applied against the latest encoded state (the result of the last applied patch), and then decoded.