# State Handling

The room handlers are **stateful** in Colyseus. Each room holds its own state. The mutations of the state are synchronized automatically to all connected clients.

The room state is where you put 

- Colyseus uses [MessagePack](https://msgpack.org/) to encode the room state in a binary format.
- Upon first connection, the client receives the latest full binary room state.
- The binary patch is evaluated through [Fossil's Delta algorithm](http://fossil-scm.org/xfer/doc/trunk/www/delta_format.wiki) at every [patch interval](/server/room/#setpatchrate-milliseconds).
- The patched room state is sent to all connected clients.
