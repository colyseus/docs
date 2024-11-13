# Exception Handling in Rooms

!!! tip "This is a new feature since `@colyseus/core` version `0.15.55`"
    Consider upgrading if you'd like to use this feature.

By default, if an uncaught exception occurs inside a room, the server is shut down ungracefully. This means all clients will be disconnected and the server will restart, or stop running (depending on how it's configured).

You can now handle these uncaught exceptions by implementing the `onUncaughtException()` method in your room class. By this method, all user-facing methods will be wrapped in try/catch blocks, and exceptions will be forwarded to your `onUncaughtException()` implementation.

```typescript
import { Room } from "colyseus";

class MyRoom extends Room {
    // ...
    onUncaughtException (err: Error, methodName: string) {
        console.error("An error ocurred in", methodName, ":", err);
        err.cause // original unhandled error
        err.message // original error message
    }
    // ...
}
```

Methods that can throw exceptions are:

- `onCreate()`
- `onAuth()`
- `onJoin()`
- `onLeave()`
- `onDispose()`
- `onMessage()`
- `setSimulationInterval()`
- `clock.setTimeout()`
- `clock.setInterval()`

!!! Note "Exceptions in `onAuth` and `onJoin`"
    Any uncaught exception thrown during `onAuth` or `onJoin` will still result in a failure to join the room, even if caught by `onUncaughtException`. If needed, you may have your own try/catch block in `onAuth` or `onJoin` to ensure clients can join even in case of an exception.

---

## Exception Types

The following exceptions are thrown by the server and can be caught by `onUncaughtException`:

Each exception type has context information that can be accessed through its properties.

### OnCreateException

When the exception is thrown inside the `onCreate` method.

**Properties:**

- `options` - the options passed to the room's `onCreate` method.

```typescript
import { OnCreateException } from "colyseus";
// ...
    onUncaughtException (err: Error, methodName: string) {
        if (err instanceof OnCreateException) {
            err.options; // the options passed to the room's `onCreate` method.
            err.cause; // original unhandled error
            err.message; // original error message
        }
    }
// ...
```

### OnAuthException

When the exception is thrown inside the `onAuth` method.

**Properties:**

- `client` - the client that is trying to authenticate.
- `options` - the options passed to the room's `onAuth` method.

```typescript
import { OnAuthException } from "colyseus";
// ...
    onUncaughtException (err: Error, methodName: string) {
        if (err instanceof OnAuthException) {
            err.client; // the client that is trying to authenticate.
            err.options; // the options passed to the room's `onAuth` method.
            err.cause; // original unhandled error
            err.message; // original error message
        }
    }
```

### OnJoinException

When the exception is thrown inside the `onJoin` method.

**Properties:**

- `client` - the client that is trying to join the room.
- `options` - the options passed to the room's `onJoin` method.

```typescript
import { OnJoinException } from "colyseus";
// ...
    onUncaughtException (err: Error, methodName: string) {
        if (err instanceof OnJoinException) {
            err.client; // the client that is trying to join the room.
            err.options; // the options passed to the room's `onJoin` method.
            err.cause; // original unhandled error
            err.message; // original error message
        }
    }
```

### OnLeaveException

When the exception is thrown inside the `onLeave` method.

**Properties:**

- `client` - the client that is trying to leave the room.
- `consented` - whether the client consented to leave the room.

```typescript
import { OnLeaveException } from "colyseus";
// ...
    onUncaughtException (err: Error, methodName: string) {
        if (err instanceof OnLeaveException) {
            err.client; // the client that is trying to leave the room.
            err.consented; // whether the client consented to leave the room.
            err.cause; // original unhandled error
            err.message; // original error message
        }
    }
```

### OnMessageException

When the exception is thrown inside the `onMessage` method.

**Properties:**

- `client` - the client that sent the message.
- `payload` - the message payload sent by the client.
- `type` - the message type sent by the client.

```typescript
import { OnMessageException } from "colyseus";
// ...
    onUncaughtException (err: Error, methodName: string) {
        if (err instanceof OnMessageException) {
            err.client; // the client that sent the message.
            err.payload; // the message payload sent by the client.
            err.type; // the message type sent by the client.
            err.cause; // original unhandled error
            err.message; // original error message
        }
    }
```

### OnDisposeException

When the exception is thrown inside the `onDispose` method.

```typescript
import { OnDisposeException } from "colyseus";
// ...
    onUncaughtException (err: Error, methodName: string) {
        if (err instanceof OnDisposeException) {
            err.cause; // original unhandled error
            err.message; // original error message
        }
    }
```

### SimulationIntervalException

When the exception is thrown inside the `setSimulationInterval` method.

```typescript
import { SimulationIntervalException } from "colyseus";
// ...
    onUncaughtException (err: Error, methodName: string) {
        if (err instanceof SimulationIntervalException) {
            err.cause; // original unhandled error
            err.message; // original error message
        }
    }
```

### TimedEventException

When the exception is thrown inside the `clock.setTimeout` or `clock.setInterval` methods.

**Properties:**

- `args` - optional arguments passed to the timeout or interval.

```typescript
import { TimedEventException } from "colyseus";
// ...
    onUncaughtException (err: Error, methodName: string) {
        if (err instanceof TimedEventException) {
            err.args; // optional arguments passed to the timeout or interval.
            err.cause; // original unhandled error
            err.message; // original error message
        }
    }
```
