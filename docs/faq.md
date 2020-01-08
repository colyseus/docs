# Frequently Asked Questions

### How many CCU a Colyseus server can handle?!

The maximum number of concurrent users (CCU) a Colyseus server can handle will vary accourding to how CPU-intensive your game loop is, and how much traffic your server is sending back to the clients.

The default "file descriptor limit" (amount of open connections you can have) of Linux servers is around 1024 - this value can be increased at your own risk. So, you can safely assume the cheapest cloud server is capable of holding 1024 concurrent connections. There are reports of people managing to have up to [600k open WebSocket connections](https://blog.jayway.com/2015/04/13/600k-concurrent-websocket-connections-on-aws-using-node-js/), even though they're idle connections, without transferring data - it proves you can potentially handle more than 1024 concurrent connections by fine tuning the server specs and configuration.


### I'm getting this error: `Class constructor Room cannot be invoked without 'new'"`, what should I do?

Make sure you have `es2015` or higher in your `tsconfig.json`:

```javascript
{
    "compilerOptions": {
        // ...
        "target": "es2015",
        // ...
    },
    // ...
}
```

### How can I sync data of the `state` only to a specific client?

In the current state of the framework, you can't do that. You'd need to send data manually to each client (through [room's send method](/api-room/#send-client-message)), and not use the state for the data you'd like to hide from particular players.

- There's a big discussion about this on issue [#59](https://github.com/colyseus/colyseus/issues/59)
- Hopefully this will be improved when the [new serialization](https://github.com/colyseus/schema) gets stable, and integrated with the framework.

### How would I broadcast data from one client to others?

You usually don't do that. By using an authoritative game server, the clients generally send **actions** to the server, and the server **mutates** the state of the game session. After having the mutation, all clients will receive the latest state from the server in the next patch interval.

### Does Colyseus help me with client-prediction?

Colyseus does not provide any client-prediction solution out of the box. Games such as [wilds.io](http://wilds.io/) and [mazmorra.io](https://mazmorra.io/) do not use any form of client-prediction. [`lerp`](http://gamestd.io/mathf/globals.html#lerp)ing user coordinates usually gives reasonable results.
