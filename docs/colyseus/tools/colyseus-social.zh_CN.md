# 驗證 + 社交 (`@colyseus/social`)

!!!警告「取代注意事項」`@colyseus/social` 模組將在近期被完全取代。目前我們建議使用 Firebase、Auth0 或其他您選擇的驗證提供者。

本章節涵蓋 [`@colyseus/social`](http://github.com/colyseus/colyseus-social) 的設定與使用方式。

`@colyseus/social` 是實驗性模組，提供了一般目的後端服務以加速您的多玩家遊戲開發體驗。該 API 為開放，以接受建議與改進。


!!!提示如果您要實作自己的驗證方法，請查看[房間 » onAuth()](/server/room/#onauth-client-options-request)

## 安裝

1. [下載並安裝 MongoDB](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials)

2. 安裝 `@colyseus/social` 模組。

``` npm 安裝 @colyseus/social npm 安裝 express-jwt ```

3. 匯入並公開 `@colyseus/social` 提供的 Express 路由。

\`\`\`typescript fct\_label="TypeScript" import express from "express"; import socialRoutes from "@colyseus/social/express"

const app = express(); app.use("/", socialRoutes);

app.listen(8080); \`\`\`

\`\`\`typescript fct\_label="JavaScript" const express = require("express"); const socialRoutes = require("@colyseus/social/express").default;

const app = express(); app.use("/", socialRoutes);

app.listen(8080); \`\`\`

## 伺服器端設定

### 環境變數

- `MONGO_URI`:MongoDB 連線 URI
- `JWT_SECRET`:驗證的安全密碼字串。
- `FACEBOOK_APP_TOKEN`:Facebook 應用程式權杖 (`"appid|appsecret"`)

## 伺服器端 API

`@colyseus/social` 模組提供 MongoDB 模組以及權杖驗證函式，供您使用。

```typescript import { User, FriendRequest, verifyToken } from "@colyseus/social"; ```

### 實作 `onAuth` 以擷取目前使用者

\`\`\`typescript import { User, verifyToken } from "@colyseus/social";

class MyRoom extends Room {

  async onAuth(client, options) { // verify token authenticity const token = verifyToken(options.token);

    // query the user by its id
    return await User.findById(token._id);
  }

  onJoin(client, options, user) { console.log(user.username, "has joined the room!"); }

} \`\`\`

### 勾點

#### `hooks.beforeAuthenticate`

`beforeAuthenticate` 勾點會在使用者登入或註冊之前觸發。

\`\`\`typescript import { hooks } from "@colyseus/social";

hooks.beforeAuthenticate((provider, $setOnInsert, $set) => { // assign default metadata upon registration $setOnInsert.metadata = { coins:100, trophies:0 }; }); \`\`\`

#### `hooks.beforeUserUpdate`

`beforeUserUpdate` 勾點會在使用者[透過 save() 方法](#update-user-data)更新其訊息之前觸發。

\`\`\`typescript import Filter from "bad-words"; const filter = new Filter();

hooks.beforeUserUpdate((\_id, fields) => { if (fields\['username'] && filter.isProfane(fields\['username'])) { throw new Error("no\_swearing\_allowed"); } }) \`\`\`

## 用戶端 API

### 登入

- [匿名](#anonymous)
- [電子郵件 + 密碼](#email-password)
- [Facebook](#facebook)

#### 匿名

```javascript fct_label="JavaScript" await client.auth.login(); ```

```csharp fct_label="C#" await client.Auth.Login(); ```

```lua fct_label="lua" client.auth:login(function(err, auth) -- ... end); ```

#### 電子郵件 + 密碼

```javascript fct_label="JavaScript" await client.auth.login({ email: "user@example.com", password:"12345" }); ```

```csharp fct_label="C#" await client.Auth.Login("user@example.com", "12345"); ```

```lua fct_label="lua" client.auth:login({ email = "user@example.com", password = "12345" }, function(err, auth) -- ... end) ```

#### Facebook

\`\`\`javascript fct\_label="JavaScript" // // 請確保您有先安裝並設定 Facebook SDK // - https://developers.facebook.com/docs/javascript/quickstart // - https://developers.facebook.com/docs/facebook-login/web //

FB.login(function(response) { if (response.authResponse) { client.auth.login({ accessToken: response.authResponse.accessToken }); } }, { scope: 'public\_profile,email,user\_friends' });

\`\`\`

\`\`\`csharp fct\_label="C#" // // 請確保您有先安裝並設定 Facebook SDK // - https://developers.facebook.com/docs/unity/gettingstarted // - https://developers.facebook.com/docs/unity/examples#login // var perms = new List<string>(){"public\_profile", "email", "user\_friends"}; FB.LogInWithReadPermissions(perms, AuthCallback);

private void AuthCallback (ILoginResult result) { if (FB.IsLoggedIn) { client.Auth.Login(Facebook.Unity.AccessToken.CurrentAccessToken); } } \`\`\`

```lua fct_label="lua" client.auth:facebook_login(function(err, auth) pprint(auth) end) ```

### 更新使用者資料

您可以從用戶端修改`使用者名稱`、`displayName`、`avatarUrl`、`lang`、`位置` 和 `時區`，並接著呼叫 `save()` 方法。

```javascript fct_label="JavaScript" client.auth.username = "Hello world!" await client.auth.save(); ```

```csharp fct_label="C#" client.Auth.Username = "Hello world!"; await client.Auth.Save(); ```

```lua fct_label="lua" client.auth.username = "Hello world!" client.auth:save() ```


### 登出

```javascript fct_label="JavaScript" client.auth.logout(); ```

```csharp fct_label="C#" client.Auth.Logout(); ```

```lua fct_label="lua" client.auth:logout(); ```

### 取得朋友

```javascript fct_label="JavaScript" const friends = await client.auth.getFriends(); friends.forEach(friend => { console.log(friend.username); }); ```

```csharp fct_label="C#" var friends = await client.Auth.GetFriends(); for (var i=0; i<friends.Length; i++) { Debug.Log(friends[i].Username); } ```

```lua fct_label="lua" client.auth:get_friends(function(err, friends) for i, friend in pairs(friends) do print(friend.username) end end); ```

### 取得線上朋友

```javascript fct_label="JavaScript" const friends = await client.auth.getOnlineFriends(); friends.forEach(friend => { console.log(friend.username); }); ```

```csharp fct_label="C#" var friends = await client.Auth.GetOnlineFriends(); for (var i=0; i<friends.Length; i++) { Debug.Log(friends[i].Username); } ```

```lua fct_label="lua" client.auth:get_online_friends(function(err, friends) for i, friend in pairs(friends) do print(friend.username) end end); ```

### 取得朋友請求

```javascript fct_label="JavaScript" const friends = await client.auth.getFriendRequests(); friends.forEach(friend => { console.log(friend.username); }); ```

```csharp fct_label="C#" var friends = await client.Auth.GetFriendRequests(); for (var i=0; i<friends.Length; i++) { Debug.Log(friends[i].Username); } ```

```lua fct_label="lua" client.auth:get_friend_requests(function(err, friends) for i, friend in pairs(friends) do print(friend.username) end end); ```

### 接受朋友請求

```javascript fct_label="JavaScript" await client.auth.acceptFriendRequest(friendId); ```

```csharp fct_label="C#" await client.Auth.AcceptFriendRequest(friendId); ```

```lua fct_label="lua" client.auth:accept_friend_request(friend_id) ```

### 拒絕朋友請求

```javascript fct_label="JavaScript" await client.auth.declineFriendRequest(friendId); ```

```csharp fct_label="C#" await client.Auth.DeclineFriendRequest(friendId); ```

```lua fct_label="lua" client.auth:decline_friend_request(friend_id) ```

### 傳送朋友請求

```javascript fct_label="JavaScript" await client.auth.sendFriendRequest(friendId); ```

```csharp fct_label="C#" await client.Auth.SendFriendRequest(friendId); ```

```lua fct_label="lua" client.auth:send_friend_request(friend_id) ```

### 封鎖使用者

```javascript fct_label="JavaScript" await client.auth.blockUser(friendId); ```

```csharp fct_label="C#" await client.Auth.BlockUser(friendId); ```

```lua fct_label="lua" client.auth:block_user(friend_id) ```

### 解除封鎖使用者

```javascript fct_label="JavaScript" await client.auth.unblockUser(friendId); ```

```csharp fct_label="C#" await client.Auth.UnblockUser(friendId); ```

```lua fct_label="lua" client.auth:unblock_user(friend_id) ```
