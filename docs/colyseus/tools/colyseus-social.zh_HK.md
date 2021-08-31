# 身份验证 + 社交 (`@colyseus/social`)

!!!警告："弃用通知" `@colyseus/social` 模块即将被完全弃用。目前，我们建议使用 Firebase、Auth0 或其它身份证验提供商。

本节介绍 [`@colyseus/social`](http://github.com/colyseus/colyseus-social) 的配置和用法。

`@colyseus/social`  一个实验性模块，提供通用型后端服务，以加速多人游戏开发。欢迎为此 API 提供建议和改进方法。


!!!提示：如果想要实现自己的身份验证方法，请参见 [Room » onAuth()](/server/room/#onauth-client-options-request)

## 安装

1. [下载和安装 MongoDB](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials)

2. 安装 `@colyseus/social` 模块。

``` npm install @colyseus/social npm install express-jwt ```

3. 导入和显示 `@colyseus/social` 提供的 Express 路径。

```typescript fct\_label="TypeScript" import express from "express"; import socialRoutes from "@colyseus/social/express"

const app = express(); app.use("/", socialRoutes);

app.listen(8080); ```

```typescript fct\_label="JavaScript" const express = require("express"); const socialRoutes = require("@colyseus/social/express").default;

const app = express(); app.use("/", socialRoutes);

app.listen(8080); ```

## 服务器端配置

### 环境变量

- `MONGO_URI`:MongoDB 连接 URI
- `JWT_SECRET`:用于身份验证的安全保密字符串
- `FACEBOOK_APP_TOKEN`:Facebook App 令牌 (`"appid|appsecret"`)

## 服务器端 API

`@colyseus/social` 模块提供 MongoDB 模块，而且，可以使用令牌验证函数。

```typescript import { User, FriendRequest, verifyToken } from "@colyseus/social"; ```

### 实现 `onAuth` 以检索当前用户

```typescript import { User, verifyToken } from "@colyseus/social";

class MyRoom extends Room {

  async onAuth(client, options) { // verify token authenticity const token = verifyToken(options.token);

    // query the user by its id
    return await User.findById(token._id);
  }

  onJoin(client, options, user) { console.log(user.username, "has joined the room!"); }

} ```

### 挂钩

#### `hooks.beforeAuthenticate`

在用户登录或注册之前，触发 `beforeAuthenticate` 挂钩。

```typescript import { hooks } from "@colyseus/social";

hooks.beforeAuthenticate((provider, $setOnInsert, $set) => { // assign default metadata upon registration $setOnInsert.metadata = { coins:100, trophies:0 }; }); ```

#### `hooks.beforeUserUpdate`

在用户 [通过 save() 方法](#update-user-data) 更新自己的信息之前，触发 `beforeUserUpdate` 挂钩。

```typescript import Filter from "bad-words"; const filter = new Filter();

hooks.beforeUserUpdate((\_id, fields) => { if (fields\['username'] && filter.isProfane(fields\['username'])) { throw new Error("no\_swearing\_allowed"); } }) ```

## 客户端 API

### 登录

- [匿名](#anonymous)
- [电子邮件 + 密码](#email-password)
- [Facebook](#facebook)

#### 匿名

```javascript fct_label="JavaScript" await client.auth.login(); ```

```csharp fct_label="C#" await client.Auth.Login(); ```

```lua fct_label="lua" client.auth:login(function(err, auth) -- ... end); ```

#### 电子邮件 + 密码

```javascript fct_label="JavaScript" await client.auth.login({ email: "user@example.com", password:"12345" }); ```

```csharp fct_label="C#" await client.Auth.Login("user@example.com", "12345"); ```

```lua fct_label="lua" client.auth:login({ email = "user@example.com", password = "12345" }, function(err, auth) -- ... end) ```

#### Facebook

```javascript fct\_label="JavaScript" // // Make sure you have the Facebook SDK installed and configured first // - https://developers.facebook.com/docs/javascript/quickstart // - https://developers.facebook.com/docs/facebook-login/web //

FB.login(function(response) { if (response.authResponse) { client.auth.login({ accessToken: response.authResponse.accessToken }); } }, { scope: 'public\_profile,email,user\_friends' });

```

```csharp fct\_label="C#" // // Make sure you have the Facebook SDK installed and configured first // - https://developers.facebook.com/docs/unity/gettingstarted // - https://developers.facebook.com/docs/unity/examples#login // var perms = new List<string>(){"public\_profile", "email", "user\_friends"}; FB.LogInWithReadPermissions(perms, AuthCallback);

private void AuthCallback (ILoginResult result) { if (FB.IsLoggedIn) { client.Auth.Login(Facebook.Unity.AccessToken.CurrentAccessToken); } } ```

```lua fct_label="lua" client.auth:facebook_login(function(err, auth) pprint(auth) end) ```

### 更新用户数据

可以在客户端修改 `username`, `displayName`, `avatarUrl`, `lang`, `location` 和 `timezone`，然后调用 `save()` 方法。

```javascript fct_label="JavaScript" client.auth.username = "Hello world!" await client.auth.save(); ```

```csharp fct_label="C#" client.Auth.Username = "Hello world!"; await client.Auth.Save(); ```

```lua fct_label="lua" client.auth.username = "Hello world!" client.auth:save() ```


### 退出

```javascript fct_label="JavaScript" client.auth.logout(); ```

```csharp fct_label="C#" client.Auth.Logout(); ```

```lua fct_label="lua" client.auth:logout(); ```

### 获取好友

```javascript fct_label="JavaScript" const friends = await client.auth.getFriends(); friends.forEach(friend => { console.log(friend.username); }); ```

```csharp fct_label="C#" var friends = await client.Auth.GetFriends(); for (var i=0; i<friends.Length; i++) { Debug.Log(friends[i].Username); } ```

```lua fct_label="lua" client.auth:get_friends(function(err, friends) for i, friend in pairs(friends) do print(friend.username) end end); ```

### 获取在线好友

```javascript fct_label="JavaScript" const friends = await client.auth.getOnlineFriends(); friends.forEach(friend => { console.log(friend.username); }); ```

```csharp fct_label="C#" var friends = await client.Auth.GetOnlineFriends(); for (var i=0; i<friends.Length; i++) { Debug.Log(friends[i].Username); } ```

```lua fct_label="lua" client.auth:get_online_friends(function(err, friends) for i, friend in pairs(friends) do print(friend.username) end end); ```

### 获取好友请求

```javascript fct_label="JavaScript" const friends = await client.auth.getFriendRequests(); friends.forEach(friend => { console.log(friend.username); }); ```

```csharp fct_label="C#" var friends = await client.Auth.GetFriendRequests(); for (var i=0; i<friends.Length; i++) { Debug.Log(friends[i].Username); } ```

```lua fct_label="lua" client.auth:get_friend_requests(function(err, friends) for i, friend in pairs(friends) do print(friend.username) end end); ```

### 接受好友请求

```javascript fct_label="JavaScript" await client.auth.acceptFriendRequest(friendId); ```

```csharp fct_label="C#" await client.Auth.AcceptFriendRequest(friendId); ```

```lua fct_label="lua" client.auth:accept_friend_request(friend_id) ```

### 拒绝好友请求

```javascript fct_label="JavaScript" await client.auth.declineFriendRequest(friendId); ```

```csharp fct_label="C#" await client.Auth.DeclineFriendRequest(friendId); ```

```lua fct_label="lua" client.auth:decline_friend_request(friend_id) ```

### 发送好友请求

```javascript fct_label="JavaScript" await client.auth.sendFriendRequest(friendId); ```

```csharp fct_label="C#" await client.Auth.SendFriendRequest(friendId); ```

```lua fct_label="lua" client.auth:send_friend_request(friend_id) ```

### 屏蔽用户

```javascript fct_label="JavaScript" await client.auth.blockUser(friendId); ```

```csharp fct_label="C#" await client.Auth.BlockUser(friendId); ```

```lua fct_label="lua" client.auth:block_user(friend_id) ```

### 屏蔽用户

```javascript fct_label="JavaScript" await client.auth.unblockUser(friendId); ```

```csharp fct_label="C#" await client.Auth.UnblockUser(friendId); ```

```lua fct_label="lua" client.auth:unblock_user(friend_id) ```
