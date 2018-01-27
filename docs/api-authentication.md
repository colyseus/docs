You may implement the `verifyClient(client, options)` method validate the authenticity of your clients. 

When requesting to join a room, that's the order of methods which will be called in your room handler:

1. `requestJoin` - should check if a room is available for new clients
2. `verifyClient (client, options)` - should validate the client based on the options provided (i.e. auth token)
3. `onJoin (client, options)` - should initialize the newly connected client into your room's state.

From the client-side, you'd call the `join` method with a token from some authentication service (i. e. Facebook):

```javascript fct_label="JavaScript"
client.join("world", {
  accessToken: yourFacebookAccessToken
});
```

```javascript fct_label="C#"
client.Join("world", new {
  accessToken = yourFacebookAccessToken
});
```

The `verifyClient` method in your room handler should return `true` only if the access token is valid.

### Synchronous usage 

You can immediatelly return a `boolean` value.

```typescript
import { Room } from "colyseus";

class MyRoom extends Room {
  verifyClient (client, options): boolean {
    return (options.password === "secret");
  }
}
```

### Asynchronous usage 

You can return a `Promise`, and perform some asynchronous task to validate the client.

```typescript
import { Room } from "colyseus";

class MyRoom extends Room {
  verifyClient (client, options): Promise {
    return new Promise((resolve, reject) => {
      validateToken(options.accessToken, (err, success) => {
        if (!err) { 
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }
}
```

Alternatively, you can use `async` / `await`, which will return a `Promise` under the hood.

```typescript
import { Room } from "colyseus";

class MyRoom extends Room {
  async verifyClient (client, options) {
    const userData = await validateToken(options.accessToken);
    return (userData) ? true : false;
  }
}
```