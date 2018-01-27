You may implement the `Room#verifyClient(client, options)` method to authenticate your clients. 

When requesting to join a room, that's the order of methods which will be called in your room handler:

- `requestJoin` - should check if a room is available for new clients
- `verifyClient (client, options)` - should validate the client based on the options provided (i.e. auth token)
- `onJoin (client, options)` - should initialize the newly connected client into your room's state.

This page explains how to use `verifyClient`.

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

### Synchronous usage (`verifyClient(client, options): boolean`)

```typescript
import { Room } from "colyseus";

class MyRoom extends Room {
  verifyClient (client, options) {
    return (options.password === "secret");
  }
}
```

### Asynchronous usage (`verifyClient(client, options): Promise`)

By returning a promise directly:

```typescript
import { Room } from "colyseus";

class MyRoom extends Room {
  verifyClient (client, options) {
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

By using `async`/`await`:

```typescript
import { Room } from "colyseus";

class MyRoom extends Room {
  async verifyClient (client, options) {
    const userData = await validateToken(options.accessToken);
    return (userData) ? true : false;
  }
}
```