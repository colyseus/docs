# 身份验证 + 社交 (`@colyseus/social`)

!!! Warning "弃用通知"
    `@colyseus/social` 模块即将被完全弃用. 目前我们建议使用 Firebase, Auth0 或其他身份证验服务.

在此介绍 [`@colyseus/social`](http://github.com/colyseus/colyseus-social) 的配置和用法.

`@colyseus/social` 是一个实验性模块, 提供通用型后端服务, 以方便多人游戏的开发. 欢迎为此 API 提供建议和改进方法.


!!! Tip
    如果想要实现自己的身份验证方法,请参考 [Room » onAuth()](/server/room/#onauth-client-options-request).

## 安装

1. [下载和安装 MongoDB](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials)

2. 安装 `@colyseus/social` 模块.

```
npm install @colyseus/social
npm install express-jwt
```

3. 导入和公开 `@colyseus/social` 提供的 Express 入口

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

## 服务器端配置

### 环境变量

- `MONGO_URI`: MongoDB 连接 URI
- `JWT_SECRET`: 用于身份验证的安全保密字符串
- `FACEBOOK_APP_TOKEN`: Facebook 应用令牌 (`"appid|appsecret"`)

## 服务器端 API

`@colyseus/social` 里提供了 MongoDB 模块,以及令牌验证功能.

```
typescript import { User, FriendRequest, verifyToken } from "@colyseus/social";
```

### 实现 `onAuth` 以检索当前用户

```typescript
import { User, verifyToken } from "@colyseus/social";

class MyRoom extends Room {

  async onAuth(client, options) {
    // 令牌身份验证
    const token = verifyToken(options.token);

    // 以用户 id 查找用户
    return await User.findById(token._id);
  }

  onJoin(client, options, user) {
    console.log(user.username, "has joined the room!");
  }

}
```

### 触发点

#### `hooks.beforeAuthenticate`

在用户登录或注册之前, 会触发 `beforeAuthenticate`.

```typescript
import { hooks } from "@colyseus/social";

hooks.beforeAuthenticate((provider, $setOnInsert, $set) => {
    // 注册时赋予默认元数据
    $setOnInsert.metadata = {
      coins: 100,
      trophies: 0
    };
});
```

#### `hooks.beforeUserUpdate`

在用户 [通过 save() 方法](#update-user-data) 更新自己的信息之前, 会触发 `beforeUserUpdate`.

```typescript
import Filter from "bad-words";
const filter = new Filter();

hooks.beforeUserUpdate((_id, fields) => {
  if (fields['username'] && filter.isProfane(fields['username'])) {
    throw new Error("no_swearing_allowed");
  }
})
```

## 客户端 API

### 登录

- [匿名](#anonymous)
- [电子邮件 + 密码](#email-password)
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

#### 电子邮件 + 密码

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
// 请提前安装和配置好 Facebook SDK
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
// 请提前安装和配置好 Facebook SDK
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

### 更新用户数据

您可以在客户端修改 `username`, `displayName`, `avatarUrl`, `lang`, `location` 和 `timezone`,然后调用 `save()` 方法保存.

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

### 获取好友数据

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

### 获取在线好友

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

### 获取加好友请求

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

### 同意加好友请求

```javascript fct_label="JavaScript"
await client.auth.acceptFriendRequest(friendId);
```

```csharp fct_label="C#"
await client.Auth.AcceptFriendRequest(friendId);
```

```lua fct_label="lua"
client.auth:accept_friend_request(friend_id)
```

### 拒绝加好友请求

```javascript fct_label="JavaScript"
await client.auth.declineFriendRequest(friendId);
```

```csharp fct_label="C#"
await client.Auth.DeclineFriendRequest(friendId);
```

```lua fct_label="lua"
client.auth:decline_friend_request(friend_id)
```

### 发送加好友请求

```javascript fct_label="JavaScript"
await client.auth.sendFriendRequest(friendId);
```

```csharp fct_label="C#"
await client.Auth.SendFriendRequest(friendId);
```

```lua fct_label="lua"
client.auth:send_friend_request(friend_id)
```

### 拉黑用户

```javascript fct_label="JavaScript"
await client.auth.blockUser(friendId);
```

```csharp fct_label="C#"
await client.Auth.BlockUser(friendId);
```

```lua fct_label="lua"
client.auth:block_user(friend_id)
```

### 拉黑恢复

```javascript fct_label="JavaScript"
await client.auth.unblockUser(friendId);
```

```csharp fct_label="C#"
await client.Auth.UnblockUser(friendId);
```

```lua fct_label="lua"
client.auth:unblock_user(friend_id)
```
