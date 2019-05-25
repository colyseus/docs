This section covers the configuration and usage of [`@colyseus/social`](http://github.com/colyseus/colyseus-social).

`@colyseus/social` is an experimental module that provides general-purpose backend services to speed-up your multiplayer game development experience. The API is open for suggestions and improvement.


!!! Tip
    If you're looking to implement your own authentication method, see [Server API » Authentication](/server/authentication)

## Installation

1. [Download and install MongoDB](https://docs.mongodb.com/manual/installation/)

2. Install the `@colyseus/social` module.

```
npm install @colyseus/social
npm install express-jwt
```

3. Import and expose the Express routes provided by `@colyseus/social`.


```typescript
import express from "express";
import socialRoutes from "@colyseus/social/express"

const app = express();
app.use("/", socialRoutes);

app.listen(8080);
```

## Server-side configuration

### Environment Variables

- `MONGO_URI`: MongoDB connection URI
- `JWT_SECRET`: Secure secret string for authentication.
- `FACEBOOK_APP_TOKEN`: Facebook App Token (`"appid|appsecret"`)

## Client-side API

### Login

- [Anonymous](#anonymous)
- [Email + Password](#email-password)
- [Facebook](#facebook)

#### Anonymous

```javascript fct_label="JavaScript"
await client.auth.login();
```

```csharp fct_label="C#"
await client.Auth.Login();
```

```lua fct_label="lua"
client.auth:login(function(err, auth)
  -- ...
end);
```

#### Email + Password

```javascript fct_label="JavaScript"
await client.auth.login({
  email: "user@example.com",
  password: "12345"
});
```

```csharp fct_label="C#"
await client.Auth.Login("user@example.com", "12345");
```

```lua fct_label="lua"
client.auth:login({
  email = "user@example.com",
  password = "12345"
}, function(err, auth)
  -- ...
end)
```

#### Facebook

```javascript fct_label="JavaScript"
//
// Make sure you have the Facebook SDK installed and configured first
// - https://developers.facebook.com/docs/javascript/quickstart
// - https://developers.facebook.com/docs/facebook-login/web
//

FB.login(function(response) {
  if (response.authResponse) {
    client.auth.login({ accessToken: response.authResponse.accessToken });
  }
}, { scope: 'public_profile,email,user_friends' });

```

```csharp fct_label="C#"
//
// Make sure you have the Facebook SDK installed and configured first
// - https://developers.facebook.com/docs/unity/gettingstarted
// - https://developers.facebook.com/docs/unity/examples#login
//
var perms = new List<string>(){"public_profile", "email", "user_friends"};
FB.LogInWithReadPermissions(perms, AuthCallback);

private void AuthCallback (ILoginResult result) {
    if (FB.IsLoggedIn) {
        client.Auth.Login(Facebook.Unity.AccessToken.CurrentAccessToken);
    }
}
```

```lua fct_label="lua"
client.auth:facebook_login(function(err, auth)
  pprint(auth)
end)
```

### Logout

```javascript fct_label="JavaScript"
client.auth.logout();
```

```csharp fct_label="C#"
client.Auth.Logout();
```

```lua fct_label="lua"
client.auth:logout();
```

### Get Friends

```javascript fct_label="JavaScript"
const friends = await client.auth.getFriends();
friends.forEach(friend => {
  console.log(friend.username);
});
```

```csharp fct_label="C#"
var friends = await client.Auth.GetFriends();
for (var i=0; i<friends.Length; i++)
{
  Debug.Log(friends[i].Username);
}
```

```lua fct_label="lua"
client.auth:get_friends(function(err, friends)
  for i, friend in pairs(friends) do
    print(friend.username)
  end
end);
```

### Get Online Friends

```javascript fct_label="JavaScript"
const friends = await client.auth.getOnlineFriends();
friends.forEach(friend => {
  console.log(friend.username);
});
```

```csharp fct_label="C#"
var friends = await client.Auth.GetOnlineFriends();
for (var i=0; i<friends.Length; i++)
{
  Debug.Log(friends[i].Username);
}
```

```lua fct_label="lua"
client.auth:get_online_friends(function(err, friends)
  for i, friend in pairs(friends) do
    print(friend.username)
  end
end);
```

### Get Friend Requests

```javascript fct_label="JavaScript"
const friends = await client.auth.getFriendRequests();
friends.forEach(friend => {
  console.log(friend.username);
});
```

```csharp fct_label="C#"
var friends = await client.Auth.GetFriendRequests();
for (var i=0; i<friends.Length; i++)
{
  Debug.Log(friends[i].Username);
}
```

```lua fct_label="lua"
client.auth:get_friend_requests(function(err, friends)
  for i, friend in pairs(friends) do
    print(friend.username)
  end
end);
```

### Accept Friend Request

```javascript fct_label="JavaScript"
await client.auth.acceptFriendRequest(friendId);
```

```csharp fct_label="C#"
await client.Auth.AcceptFriendRequest(friendId);
```

```lua fct_label="lua"
client.auth:accept_friend_request(friend_id)
```

### Decline Friend Request

```javascript fct_label="JavaScript"
await client.auth.declineFriendRequest(friendId);
```

```csharp fct_label="C#"
await client.Auth.DeclineFriendRequest(friendId);
```

```lua fct_label="lua"
client.auth:decline_friend_request(friend_id)
```

### Send Friend Request

```javascript fct_label="JavaScript"
await client.auth.sendFriendRequest(friendId);
```

```csharp fct_label="C#"
await client.Auth.SendFriendRequest(friendId);
```

```lua fct_label="lua"
client.auth:send_friend_request(friend_id)
```

### Block User

```javascript fct_label="JavaScript"
await client.auth.blockUser(friendId);
```

```csharp fct_label="C#"
await client.Auth.BlockUser(friendId);
```

```lua fct_label="lua"
client.auth:block_user(friend_id)
```

### Unblock User

```javascript fct_label="JavaScript"
await client.auth.unblockUser(friendId);
```

```csharp fct_label="C#"
await client.Auth.UnblockUser(friendId);
```

```lua fct_label="lua"
client.auth:unblock_user(friend_id)
```

## Server-side API

The `@colyseus/social` module provides the MongoDB models, and the token validation function avaialble for you to use.

```typescript
import { User, FriendRequest, verifyToken } from "@colyseus/social";
```

### Implementing `onAuth` to retrieve the current user

```typescript
import { User, verifyToken } from "@colyseus/social";

class MyRoom extends Room {

  async onAuth(options) {
    // verify token authenticity
    const token = verifyToken(options.token);

    // query the user by its id
    return User.findById(token._id);
  }

  onJoin(client, options, user) {
    console.log(user.username, "has joined the room!");
  }

}
```