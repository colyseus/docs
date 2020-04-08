You may implement the `onAuth (client, options[, request])` method to validate the authenticity of your clients.

The `onAuth()` method will be executed before `onJoin()`. You can use it to validate if the player is allowed to join the room.

From the client-side, you'd call the `join` method with a token from some authentication service of your choice (i. e. Facebook):

```javascript fct_label="JavaScript"
client.joinOrCreate("world", { accessToken: yourFacebookAccessToken }).then(room => {
  // success
}).catch(err => {
  // handle error...
});
```

```csharp fct_label="C#"
try {
  var room = client.JoinOrCreate<YourStateClass>("world", new { accessToken = yourFacebookAccessToken });
  // success
} catch (ex) {
  // handle error...
}
```

```lua fct_label="Lua"
client:join_or_create("world", { accessToken = yourFacebookAccessToken }, function(err, room)
  -- success
end)
```

```haxe fct_label="Haxe"
client.joinOrCreate("world", { accessToken: yourFacebookAccessToken }, YourStateClass, function (err, room) {
  if (err != null) {
    // handle error...
    return;
  }

  // success
})
```

```cpp fct_label="C++"
client.joinOrCreate("world", {{"accessToken", yourFacebookAccessToken }}, [=](std::string err, Room<YourStateClass>* room) {
  if (err != "") {
    // handle error...
    return;
  }

  // success
});
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
  onAuth (client, options): boolean {
    return (options.password === "secret");
  }
}
```

### Asynchronous usage

You can return a `Promise`, and perform some asynchronous task to validate the client.

```typescript
import { Room } from "colyseus";

class MyRoom extends Room {
  onAuth (client, options): Promise<any> {
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
  async onAuth (client, options) {
    const userData = await validateToken(options.accessToken);
    return (userData) ? userData : false;
  }
}
```

!!! Tip "Getting player's IP address"
    You can use the `request` variable to retrieve the user's IP address, http headers, and more. E.g.: `request.headers['x-forwarded-for'] || request.connection.remoteAddress`
