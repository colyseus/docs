You may implement the `onAuth (options)` method to validate the authenticity of your clients.

When requesting to join a room, this is the order of methods which will be called in your room handler:

1. `requestJoin (options)` - should check if a room is available for new clients
2. `onAuth (options)` - should validate the client based on the options provided (i.e. auth token)
3. `onJoin (client, options, auth)` - should initialize the new client into your room's state.

From the client-side, you'd call the `join` method with a token from some authentication service of your choice (i. e. Facebook):

```javascript fct_label="JavaScript"
client.join("world", { accessToken: yourFacebookAccessToken });
```

```csharp fct_label="C#"
client.Join("world", new { accessToken = yourFacebookAccessToken });
```

```lua fct_label="Lua"
client:join("world", { accessToken = yourFacebookAccessToken })
```

```lua fct_label="Haxe"
client.join("world", { accessToken: yourFacebookAccessToken })
```

The `onAuth` method in your room handler should return a truthy value if the
access token is valid.

You may also return custom user-related data, which will be passed on the third
parameter of `onJoin`.

### Synchronous usage

You can immediatelly return a `boolean` value.

```typescript
import { Room } from "colyseus";

class MyRoom extends Room {
  onAuth (options): boolean {
    return (options.password === "secret");
  }
}
```

### Asynchronous usage

You can return a `Promise`, and perform some asynchronous task to validate the client.

```typescript
import { Room } from "colyseus";

class MyRoom extends Room {
  onAuth (options): Promise<any> {
    return new Promise((resolve, reject) => {
      validateToken(options.accessToken, (err, userData) => {
        if (!err) {
          resolve(userData);
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
  async onAuth (options) {
    const userData = await validateToken(options.accessToken);
    return (userData) ? userData : false;
  }
}
```
