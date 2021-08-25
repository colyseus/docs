# 驗證 + 社交 ({1>@colyseus/social<1})

!!!警告「取代注意事項」{1>@colyseus/social<1} 模組將在近期被完全取代。目前我們建議使用 Firebase、Auth0 或其他您選擇的驗證提供者。

本章節涵蓋 {1>{2>@colyseus/social<2}<1} 的設定與使用方式。

{1>@colyseus/social<1} 是實驗性模組，提供了一般目的後端服務以加速您的多玩家遊戲開發體驗。該 API 為開放，以接受建議與改進。


!!!提示如果您要實作自己的驗證方法，請查看{1>房間 » onAuth()<1}

## 安裝

1. {1>下載並安裝 MongoDB<1}

2. 安裝 {1>@colyseus/social<1} 模組。

{1> npm 安裝 @colyseus/social npm 安裝 express-jwt <1}

3. 匯入並公開 {1>@colyseus/social<1} 提供的 Express 路由。

\`\`\`typescript fct\_label="TypeScript" import express from "express"; import socialRoutes from "@colyseus/social/express"

const app = express(); app.use("/", socialRoutes);

app.listen(8080); \`\`\`

\`\`\`typescript fct\_label="JavaScript" const express = require("express"); const socialRoutes = require("@colyseus/social/express").default;

const app = express(); app.use("/", socialRoutes);

app.listen(8080); \`\`\`

## 伺服器端設定

### 環境變數

- {1>MONGO\_URI<1}：MongoDB 連線 URI
- {1>JWT\_SECRET<1}：驗證的安全密碼字串。
- {1>FACEBOOK\_APP\_TOKEN<1}：Facebook 應用程式權杖 ({2>"appid|appsecret"<2})

## 伺服器端 API

{1>@colyseus/social<1} 模組提供 MongoDB 模組以及權杖驗證函式，供您使用。

{1>typescript import { User, FriendRequest, verifyToken } from "@colyseus/social"; <1}

### 實作 {1>onAuth<1} 以擷取目前使用者

\`\`\`typescript import { User, verifyToken } from "@colyseus/social";

class MyRoom extends Room {

  async onAuth(client, options) { // verify token authenticity const token = verifyToken(options.token);

    // query the user by its id
    return await User.findById(token._id);
  }

  onJoin(client, options, user) { console.log(user.username, "has joined the room!"); }

} \`\`\`

### 勾點

#### {1>hooks.beforeAuthenticate<1}

{1>beforeAuthenticate<1} 勾點會在使用者登入或註冊之前觸發。

\`\`\`typescript import { hooks } from "@colyseus/social";

hooks.beforeAuthenticate((provider, $setOnInsert, $set) => { // assign default metadata upon registration $setOnInsert.metadata = { coins:100, trophies:0 }; }); \`\`\`

#### {1>hooks.beforeUserUpdate<1}

{1>beforeUserUpdate<1} 勾點會在使用者{2>透過 save() 方法<2}更新其訊息之前觸發。

\`\`\`typescript import Filter from "bad-words"; const filter = new Filter();

hooks.beforeUserUpdate((\_id, fields) => { if (fields\['username'] && filter.isProfane(fields\['username'])) { throw new Error("no\_swearing\_allowed"); } }) \`\`\`

## 用戶端 API

### 登入

- [匿名](#anonymous)
- [電子郵件 + 密碼](#email-password)
- [Facebook](#facebook)

#### 匿名

{1>javascript fct\_label="JavaScript" await client.auth.login(); <1}

{1>csharp fct\_label="C#" await client.Auth.Login(); <1}

{1>lua fct\_label="lua" client.auth:login(function(err, auth) -- ... end); <1}

#### 電子郵件 + 密碼

{1}javascript fct\_label="JavaScript" await client.auth.login({ email: "user@example.com", password:{1}

{1>csharp fct\_label="C#" await client.Auth.Login("user@example.com", "12345"); <1}

{1>lua fct\_label="lua" client.auth:login({ email = "user@example.com", password = "12345" }, function(err, auth) -- ... end) <1}

#### Facebook

\`\`\`javascript fct\_label="JavaScript" // // 請確保您有先安裝並設定 Facebook SDK // - https://developers.facebook.com/docs/javascript/quickstart // - https://developers.facebook.com/docs/facebook-login/web //

FB.login(function(response) { if (response.authResponse) { client.auth.login({ accessToken: response.authResponse.accessToken }); } }, { scope: 'public\_profile,email,user\_friends' });

\`\`\`

\`\`\`csharp fct\_label="C#" // // 請確保您有先安裝並設定 Facebook SDK // - https://developers.facebook.com/docs/unity/gettingstarted // - https://developers.facebook.com/docs/unity/examples#login // var perms = new List{1}(){"public\_profile", "email", "user\_friends"}; FB.LogInWithReadPermissions(perms, AuthCallback);

private void AuthCallback (ILoginResult result) { if (FB.IsLoggedIn) { client.Auth.Login(Facebook.Unity.AccessToken.CurrentAccessToken); } } \`\`\`

{1>lua fct\_label="lua" client.auth:facebook\_login(function(err, auth) pprint(auth) end) <1}

### 更新使用者資料

您可以從用戶端修改{1>使用者名稱<1}、{2>displayName<2}、{3>avatarUrl<3}、{4>lang<4}、{5>位置<5} 和 {6>時區<6}，並接著呼叫 {7>save()<7} 方法。

{1>javascript fct\_label="JavaScript" client.auth.username = "Hello world!" await client.auth.save(); <1}

{1>csharp fct\_label="C#" client.Auth.Username = "Hello world!"; await client.Auth.Save(); <1}

{1>lua fct\_label="lua" client.auth.username = "Hello world!" client.auth:save() <1}


### 登出

{1>javascript fct\_label="JavaScript" client.auth.logout(); <1}

{1>csharp fct\_label="C#" client.Auth.Logout(); <1}

{1>lua fct\_label="lua" client.auth:logout(); <1}

### 取得朋友

{1>javascript fct\_label="JavaScript" const friends = await client.auth.getFriends(); friends.forEach(friend => { console.log(friend.username); }); <1}

{1>csharp fct\_label="C#" var friends = await client.Auth.GetFriends(); for (var i=0; i<friends.Length; i++) { Debug.Log(friends\[i].Username); } <1}

{1>lua fct\_label="lua" client.auth:get\_friends(function(err, friends) for i, friend in pairs(friends) do print(friend.username) end end); <1}

### 取得線上朋友

{1>javascript fct\_label="JavaScript" const friends = await client.auth.getOnlineFriends(); friends.forEach(friend => { console.log(friend.username); }); <1}

{1>csharp fct\_label="C#" var friends = await client.Auth.GetOnlineFriends(); for (var i=0; i<friends.Length; i++) { Debug.Log(friends\[i].Username); } <1}

{1>lua fct\_label="lua" client.auth:get\_online\_friends(function(err, friends) for i, friend in pairs(friends) do print(friend.username) end end); <1}

### 取得朋友請求

{1>javascript fct\_label="JavaScript" const friends = await client.auth.getFriendRequests(); friends.forEach(friend => { console.log(friend.username); }); <1}

{1>csharp fct\_label="C#" var friends = await client.Auth.GetFriendRequests(); for (var i=0; i<friends.Length; i++) { Debug.Log(friends\[i].Username); } <1}

{1>lua fct\_label="lua" client.auth:get\_friend\_requests(function(err, friends) for i, friend in pairs(friends) do print(friend.username) end end); <1}

### 接受朋友請求

{1>javascript fct\_label="JavaScript" await client.auth.acceptFriendRequest(friendId); <1}

{1>csharp fct\_label="C#" await client.Auth.AcceptFriendRequest(friendId); <1}

{1>lua fct\_label="lua" client.auth:accept\_friend\_request(friend\_id) <1}

### 拒絕朋友請求

{1>javascript fct\_label="JavaScript" await client.auth.declineFriendRequest(friendId); <1}

{1>csharp fct\_label="C#" await client.Auth.DeclineFriendRequest(friendId); <1}

{1>lua fct\_label="lua" client.auth:decline\_friend\_request(friend\_id) <1}

### 傳送朋友請求

{1>javascript fct\_label="JavaScript" await client.auth.sendFriendRequest(friendId); <1}

{1>csharp fct\_label="C#" await client.Auth.SendFriendRequest(friendId); <1}

{1>lua fct\_label="lua" client.auth:send\_friend\_request(friend\_id) <1}

### 封鎖使用者

{1>javascript fct\_label="JavaScript" await client.auth.blockUser(friendId); <1}

{1>csharp fct\_label="C#" await client.Auth.BlockUser(friendId); <1}

{1>lua fct\_label="lua" client.auth:block\_user(friend\_id) <1}

### 解除封鎖使用者

{1>javascript fct\_label="JavaScript" await client.auth.unblockUser(friendId); <1}

{1>csharp fct\_label="C#" await client.Auth.UnblockUser(friendId); <1}

{1>lua fct\_label="lua" client.auth:unblock\_user(friend\_id) <1}
