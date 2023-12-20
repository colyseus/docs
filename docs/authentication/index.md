# Authentication

To authenticate clients, you can bring your own token validation logic by implementing the `onAuth()` method in your room.

!!! Tip "Authentication module"
    The new [Authentication module](/authentication/module/) provides a set of tools to help you authenticate your players into your application. (Currently in beta, feedback is welcome on [colyseus/colyseus#657](https://github.com/colyseus/colyseus/issues/660))

## Room authentication

To authenticate clients into a room, you must implement the static `onAuth()` method in your room. This method is called before `onCreate` or `onJoin`, and it is responsible for validating the client's authentication token.

#### Client-side

The authentication token set on `client.auth.token` will be sent as `Authorization` header in all http requests to the server, including matchmaking requests.

=== "JavaScript"

    ```typescript
    // set the auth token
    client.auth.token = "YOUR AUTH TOKEN";

    // matchmaking requests will contain the auth token
    client.joinOrCreate("my_room").then((room) => {
        console.log(room);
    });

    // http requests will contain the auth token
    client.http.get("/profile").then((response) => {
      console.log(response.data);
    });
    ```


#### Server-side

=== "Using `@colyseus/auth`"

    ```typescript
    import { Room } from "colyseus";
    import { JWT } from "@colyseus/auth";

    class MyRoom extends Room {
        static async onAuth (token, request) {
            return await JWT.verify(token);
        }
    }
    ```


=== "Using `firebase-admin`"

    ```typescript
    import { Room } from "colyseus";
    import { DecodedIdToken, getAuth } from "firebase-admin/auth";

    class MyRoom extends Room {
        static onAuth(token, req) {
            return getAuth().verifyIdToken(token);
        }
    }
    ```


#### `onAuth (client, options, request)` _- Soon to be deprecated_

!!! Warning "`onAuth` as instance method will be deprecated"
    Since version `0.15.14`, it is preferred to use the static version `onAuth()` method. You can still use it as instance method, but it will be deprecated in future versions. See the reasoning behind this change on [colyseus/colyseus#657](https://github.com/colyseus/colyseus/pull/657)

The `onAuth()` method will be executed before `onJoin()`. It can be used to verify authenticity of a client joining the room.

- If `onAuth()` returns a [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) value, `onJoin()` is going to be called with the returned value as the third argument.
- If `onAuth()` returns a [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) value, the client is immediatelly rejected, causing the matchmaking function call from the client-side to fail.
- You may also throw a `ServerError` to expose a custom error to be handled in the client-side.

If left non-implemented, it always returns `true` - allowing any client to connect.

!!! Tip "Getting player's IP address"
    You can use the `request` variable to retrieve the user's IP address, http headers, and more. E.g.: `request.headers['x-forwarded-for'] || request.socket.remoteAddress`

**Implementations examples**

=== "async / await"

    ``` typescript
    import { Room, ServerError } from "colyseus";

    class MyRoom extends Room {
      async onAuth (client, options, request) {
        /**
         * Alternatively, you can use `async` / `await`,
         * which will return a `Promise` under the hood.
         */
        const userData = await validateToken(options.accessToken);
        if (userData) {
            return userData;

        } else {
            throw new ServerError(400, "bad access token");
        }
      }
    }
    ```

=== "Synchronous"

    ``` typescript
    import { Room } from "colyseus";

    class MyRoom extends Room {
      onAuth (client, options, request): boolean {
        /**
         * You can immediatelly return a `boolean` value.
         */
         if (options.password === "secret") {
           return true;

         } else {
           throw new ServerError(400, "bad access token");
         }
      }
    }
    ```

=== "Promises"

    ``` typescript
    import { Room } from "colyseus";

    class MyRoom extends Room {
      onAuth (client, options, request): Promise<any> {
        /**
         * You can return a `Promise`, and perform some asynchronous task to validate the client.
         */
        return new Promise((resolve, reject) => {
          validateToken(options.accessToken, (err, userData) => {
            if (!err) {
              resolve(userData);
            } else {
              reject(new ServerError(400, "bad access token"));
            }
          });
        });
      }
    }
    ```

**Client-side examples**

From the client-side, you may call the matchmaking method (`join`, `joinOrCreate`, etc) with a token from some authentication service of your choice (i. e. Facebook):

=== "JavaScript"

    ``` javascript
    client.joinOrCreate("world", {
      accessToken: yourFacebookAccessToken

    }).then((room) => {
      // success

    }).catch((err) => {
      // handle error...
      err.code // 400
      err.message // "bad access token"
    });
    ```

=== "C#"

    ``` csharp
    try {
      var room = await client.JoinOrCreate<YourStateClass>("world", new {
        accessToken = yourFacebookAccessToken
      });
      // success

    } catch (err) {
      // handle error...
      err.code // 400
      err.message // "bad access token"
    }
    ```

=== "Lua"

    ``` lua
    client:join_or_create("world", {
      accessToken = yourFacebookAccessToken

    }, function(err, room)
      if err then
        -- handle error...
        err.code -- 400
        err.message -- "bad access token"
        return
      end

      -- success
    end)
    ```

=== "Haxe"

    ``` haxe
    client.joinOrCreate("world", {
      accessToken: yourFacebookAccessToken

    }, YourStateClass, function (err, room) {
      if (err != null) {
        // handle error...
        err.code // 400
        err.message // "bad access token"
        return;
      }

      // success
    })
    ```

=== "C++"

    ``` cpp
    client.joinOrCreate("world", {
      { "accessToken", yourFacebookAccessToken }

    }, [=](MatchMakeError *err, Room<YourStateClass>* room) {
      if (err != "") {
        // handle error...
        err.code // 400
        err.message // "bad access token"
        return;
      }

      // success
    });
    ```

!!! Note "These APIs are currently in beta."
    Only the JavaScript SDK implements these APIs.
