# 身份驗證 + 社交 (`@colyseus/social`)

!!! Warning "棄用通知"
`@colyseus/social` 模組即將被完全棄用. 目前我們建議使用 Firebase, Auth0 或其他身份證驗服務.

在此介紹 [`@colyseus/social`](http://github.com/colyseus/colyseus-social) 的配置和用法.

`@colyseus/social` 是一個實驗性模組, 提供通用型後端服務, 以方便多人遊戲的開發. 歡迎為此 API 提供建議和改進方法.


!!! Tip
如果想要實現自己的身份驗證方法,請參考 [Room » onAuth()](/server/room/#onauth-client-options-request).

## 安裝

1. [下載和安裝 MongoDB](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials)

2. 安裝 `@colyseus/social` 模組.

```
npm install @colyseus/social
npm install express-jwt
```

3. 匯入和公開 `@colyseus/social` 提供的 Express 入口

```typescript fct_label="TypeScript"
import express from "express";
import socialRoutes from "@colyseus/social/express"

const app = express();
app.use("/", socialRoutes);

app.listen(8080);
```

```typescript fct_label="JavaScript"
const express = require("express");
const socialRoutes = require("@colyseus/social/express").default;

const app = express();
app.use("/", socialRoutes);

app.listen(8080);
```

## 伺服器端配置

### 環境變數

- `MONGO_URI`: MongoDB 連線 URI
- `JWT_SECRET`: 用於身份驗證的安全保密字符串
- `FACEBOOK_APP_TOKEN`: Facebook 應用令牌 (`"appid|appsecret"`)

## 伺服器端 API

`@colyseus/social` 裏提供了 MongoDB 模組,以及令牌驗證功能.

```
typescript import { User, FriendRequest, verifyToken } from "@colyseus/social";
```

### 實現 `onAuth` 以檢索當前用戶

```typescript
import { User, verifyToken } from "@colyseus/social";

class MyRoom extends Room {

  async onAuth(client, options) {
    // 令牌身份驗證
    const token = verifyToken(options.token);

    // 以用戶 id 查找用戶
    return await User.findById(token._id);
  }

  onJoin(client, options, user) {
    console.log(user.username, "has joined the room!");
  }

}
```

### 勾點

#### `hooks.beforeAuthenticate`

在用戶登錄或註冊之前, 會觸發 `beforeAuthenticate`.

```typescript
import { hooks } from "@colyseus/social";

hooks.beforeAuthenticate((provider, $setOnInsert, $set) => {
    // 註冊時賦予預設元數據
    $setOnInsert.metadata = {
      coins: 100,
      trophies: 0
    };
});
```

#### `hooks.beforeUserUpdate`

在用戶 [通過 save() 方法](#update-user-data) 更新自己的資訊之前, 會觸發 `beforeUserUpdate`.

```typescript
import Filter from "bad-words";
const filter = new Filter();

hooks.beforeUserUpdate((_id, fields) => {
  if (fields['username'] && filter.isProfane(fields['username'])) {
    throw new Error("no_swearing_allowed");
  }
})
```

## 客戶端 API

### 登錄

- [匿名](#anonymous)
- [電子郵件 + 密碼](#email-password)
- [Facebook](#facebook)

#### 匿名

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

#### 電子郵件 + 密碼

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
// 請提前安裝和配置好 Facebook SDK
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
// 請提前安裝和配置好 Facebook SDK
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

### 更新用戶數據

您可以在客戶端修改 `username`, `displayName`, `avatarUrl`, `lang`, `location` 和 `timezone`,然後調用 `save()` 方法保存.

```javascript fct_label="JavaScript"
client.auth.username = "Hello world!"
await client.auth.save();
```

```csharp fct_label="C#"
client.Auth.Username = "Hello world!";
await client.Auth.Save();
```

```lua fct_label="lua"
client.auth.username = "Hello world!"
client.auth:save()
```


### 登出

```javascript fct_label="JavaScript"
client.auth.logout();
```

```csharp fct_label="C#"
client.Auth.Logout();
```

```lua fct_label="lua"
client.auth:logout();
```

### 獲取好友數據

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

### 獲取在線好友

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

### 獲取加好友請求

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

### 同意加好友請求

```javascript fct_label="JavaScript"
await client.auth.acceptFriendRequest(friendId);
```

```csharp fct_label="C#"
await client.Auth.AcceptFriendRequest(friendId);
```

```lua fct_label="lua"
client.auth:accept_friend_request(friend_id)
```

### 拒絕加好友請求

```javascript fct_label="JavaScript"
await client.auth.declineFriendRequest(friendId);
```

```csharp fct_label="C#"
await client.Auth.DeclineFriendRequest(friendId);
```

```lua fct_label="lua"
client.auth:decline_friend_request(friend_id)
```

### 發送加好友請求

```javascript fct_label="JavaScript"
await client.auth.sendFriendRequest(friendId);
```

```csharp fct_label="C#"
await client.Auth.SendFriendRequest(friendId);
```

```lua fct_label="lua"
client.auth:send_friend_request(friend_id)
```

### 拉黑用戶

```javascript fct_label="JavaScript"
await client.auth.blockUser(friendId);
```

```csharp fct_label="C#"
await client.Auth.BlockUser(friendId);
```

```lua fct_label="lua"
client.auth:block_user(friend_id)
```

### 拉黑恢復

```javascript fct_label="JavaScript"
await client.auth.unblockUser(friendId);
```

```csharp fct_label="C#"
await client.Auth.UnblockUser(friendId);
```

```lua fct_label="lua"
client.auth:unblock_user(friend_id)
```
