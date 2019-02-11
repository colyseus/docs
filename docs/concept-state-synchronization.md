# State synchronization

- Colyseus uses [MessagePack](https://msgpack.org/) to encode the room state in a binary format.
- Upon first connection, the client receives the latest full binary room state.
- The binary patch is evaluated through [Fossil's Delta algorithm](http://fossil-scm.org/xfer/doc/trunk/www/delta_format.wiki) at every [patch interval](/api-room/#setpatchrate-milliseconds).
- The patched room state is sent to all connected clients.
