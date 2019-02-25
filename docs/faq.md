# Frequently Asked Questions

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

In the current state of the framework, you can't do that. You'd need to send data manually to each client (through [room's send method](/api-room/#send-client-)), and not use the state for the data you'd like to hide from particular players.

- There's a big discussion about this on issue [#59](https://github.com/colyseus/colyseus/issues/59)
- Hopefully this will be improved when the [new serialization](https://github.com/colyseus/schema) gets stable, and integrated with the framework.

### How would I broadcast data from one client to others?

You usually don't do that. By using an authoritative game server, the clients generally send **actions** to the server, and the server **mutates** the state of the game session. After having the mutation, all clients will receive the latest state from the server in the next patch interval.

### Does Colyseus help me with client-prediction?

Colyseus does not provide any client-prediction solution out of the box. Games such as [wilds.io](http://wilds.io/) and [crashracing.com](https://crashracing.com/) do not use any form of client-prediction. [`lerp`](http://gamestd.io/mathf/globals.html#lerp)ing user coordinates usually gives reasonable results.
