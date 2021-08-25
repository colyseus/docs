# 身份验证 + 社交 ({1>@colyseus/social<1})

!!!警告："弃用通知" {1>@colyseus/social<1} 模块即将被完全弃用。目前，我们建议使用 Firebase、Auth0 或其它身份证验提供商。

本节介绍 {1>{2>@colyseus/social<2}<1} 的配置和用法。

{1>@colyseus/social<1}  一个实验性模块，提供通用型后端服务，以加速多人游戏开发。欢迎为此 API 提供建议和改进方法。


!!!提示：如果想要实现自己的身份验证方法，请参见 {1>Room » onAuth()<1}

## 安装

1. {1>下载和安装 MongoDB<1}

2. 安装 {1>@colyseus/social<1} 模块。

{1> npm install @colyseus/social npm install express-jwt <1}

3. 导入和显示 {1>@colyseus/social<1} 提供的 Express 路径。

\`\`\`typescript fct\_label="TypeScript" import express from "express"; import socialRoutes from "@colyseus/social/express"

const app = express(); app.use("/", socialRoutes);

app.listen(8080); \`\`\`

\`\`\`typescript fct\_label="JavaScript" const express = require("express"); const socialRoutes = require("@colyseus/social/express").default;

const app = express(); app.use("/", socialRoutes);

app.listen(8080); \`\`\`

## 服务器端配置

### 环境变量

- {1>MONGO\_URI<1}:MongoDB 连接 URI
- {1>JWT\_SECRET<1}:用于身份验证的安全保密字符串
- {1>FACEBOOK\_APP\_TOKEN<1}:Facebook App 令牌 ({2>"appid|appsecret"<2})

## 服务器端 API

{1>@colyseus/social<1} 模块提供 MongoDB 模块，而且，可以使用令牌验证函数。

{1>typescript import { User, FriendRequest, verifyToken } from "@colyseus/social"; <1}

### 实现 {1>onAuth<1} 以检索当前用户

\`\`\`typescript import { User, verifyToken } from "@colyseus/social";

class MyRoom extends Room {

  async onAuth(client, options) { // verify token authenticity const token = verifyToken(options.token);

    // query the user by its id
    return await User.findById(token._id);
  }

  onJoin(client, options, user) { console.log(user.username, "has joined the room!"); }

} \`\`\`

### 挂钩

#### {1>hooks.beforeAuthenticate<1}

在用户登录或注册之前，触发 {1>beforeAuthenticate<1} 挂钩。

\`\`\`typescript import { hooks } from "@colyseus/social";

hooks.beforeAuthenticate((provider, $setOnInsert, $set) => { // assign default metadata upon registration $setOnInsert.metadata = { coins:100, trophies:0 }; }); \`\`\`

#### {1>hooks.beforeUserUpdate<1}

在用户 {2>通过 save() 方法<2} 更新自己的信息之前，触发 {1>beforeUserUpdate<1} 挂钩。

\`\`\`typescript import Filter from "bad-words"; const filter = new Filter();

hooks.beforeUserUpdate((\_id, fields) => { if (fields\['username'] && filter.isProfane(fields\['username'])) { throw new Error("no\_swearing\_allowed"); } }) \`\`\`

## 客户端 API

### 登录

- [匿名](#anonymous)
- [电子邮件 + 密码](#email-password)
- [Facebook](#facebook)

#### 匿名

{1>javascript fct\_label="JavaScript" await client.auth.login(); <1}

{1>csharp fct\_label="C#" await client.Auth.Login(); <1}

{1>lua fct\_label="lua" client.auth:login(function(err, auth) -- ... end); <1}

#### 电子邮件 + 密码

{1}javascript fct\_label="JavaScript" await client.auth.login({ email: "user@example.com", password:{1}

{1>csharp fct\_label="C#" await client.Auth.Login("user@example.com", "12345"); <1}

{1>lua fct\_label="lua" client.auth:login({ email = "user@example.com", password = "12345" }, function(err, auth) -- ... end) <1}

#### Facebook

\`\`\`javascript fct\_label="JavaScript" // // Make sure you have the Facebook SDK installed and configured first // - https://developers.facebook.com/docs/javascript/quickstart // - https://developers.facebook.com/docs/facebook-login/web //

FB.login(function(response) { if (response.authResponse) { client.auth.login({ accessToken: response.authResponse.accessToken }); } }, { scope: 'public\_profile,email,user\_friends' });

\`\`\`

\`\`\`csharp fct\_label="C#" // // Make sure you have the Facebook SDK installed and configured first // - https://developers.facebook.com/docs/unity/gettingstarted // - https://developers.facebook.com/docs/unity/examples#login // var perms = new List{1}(){"public\_profile", "email", "user\_friends"}; FB.LogInWithReadPermissions(perms, AuthCallback);

private void AuthCallback (ILoginResult result) { if (FB.IsLoggedIn) { client.Auth.Login(Facebook.Unity.AccessToken.CurrentAccessToken); } } \`\`\`

{1>lua fct\_label="lua" client.auth:facebook\_login(function(err, auth) pprint(auth) end) <1}

### 更新用户数据

可以在客户端修改 {1>username<1}, {2>displayName<2}, {3>avatarUrl<3}, {4>lang<4}, {5>location<5} 和 {6>timezone<6}，然后调用 {7>save()<7} 方法。

{1>javascript fct\_label="JavaScript" client.auth.username = "Hello world!" await client.auth.save(); <1}

{1>csharp fct\_label="C#" client.Auth.Username = "Hello world!"; await client.Auth.Save(); <1}

{1>lua fct\_label="lua" client.auth.username = "Hello world!" client.auth:save() <1}


### 退出

{1>javascript fct\_label="JavaScript" client.auth.logout(); <1}

{1>csharp fct\_label="C#" client.Auth.Logout(); <1}

{1>lua fct\_label="lua" client.auth:logout(); <1}

### 获取好友

{1>javascript fct\_label="JavaScript" const friends = await client.auth.getFriends(); friends.forEach(friend => { console.log(friend.username); }); <1}

{1>csharp fct\_label="C#" var friends = await client.Auth.GetFriends(); for (var i=0; i<friends.Length; i++) { Debug.Log(friends\[i].Username); } <1}

{1>lua fct\_label="lua" client.auth:get\_friends(function(err, friends) for i, friend in pairs(friends) do print(friend.username) end end); <1}

### 获取在线好友

{1>javascript fct\_label="JavaScript" const friends = await client.auth.getOnlineFriends(); friends.forEach(friend => { console.log(friend.username); }); <1}

{1>csharp fct\_label="C#" var friends = await client.Auth.GetOnlineFriends(); for (var i=0; i<friends.Length; i++) { Debug.Log(friends\[i].Username); } <1}

{1>lua fct\_label="lua" client.auth:get\_online\_friends(function(err, friends) for i, friend in pairs(friends) do print(friend.username) end end); <1}

### 获取好友请求

{1>javascript fct\_label="JavaScript" const friends = await client.auth.getFriendRequests(); friends.forEach(friend => { console.log(friend.username); }); <1}

{1>csharp fct\_label="C#" var friends = await client.Auth.GetFriendRequests(); for (var i=0; i<friends.Length; i++) { Debug.Log(friends\[i].Username); } <1}

{1>lua fct\_label="lua" client.auth:get\_friend\_requests(function(err, friends) for i, friend in pairs(friends) do print(friend.username) end end); <1}

### 接受好友请求

{1>javascript fct\_label="JavaScript" await client.auth.acceptFriendRequest(friendId); <1}

{1>csharp fct\_label="C#" await client.Auth.AcceptFriendRequest(friendId); <1}

{1>lua fct\_label="lua" client.auth:accept\_friend\_request(friend\_id) <1}

### 拒绝好友请求

{1>javascript fct\_label="JavaScript" await client.auth.declineFriendRequest(friendId); <1}

{1>csharp fct\_label="C#" await client.Auth.DeclineFriendRequest(friendId); <1}

{1>lua fct\_label="lua" client.auth:decline\_friend\_request(friend\_id) <1}

### 发送好友请求

{1>javascript fct\_label="JavaScript" await client.auth.sendFriendRequest(friendId); <1}

{1>csharp fct\_label="C#" await client.Auth.SendFriendRequest(friendId); <1}

{1>lua fct\_label="lua" client.auth:send\_friend\_request(friend\_id) <1}

### 屏蔽用户

{1>javascript fct\_label="JavaScript" await client.auth.blockUser(friendId); <1}

{1>csharp fct\_label="C#" await client.Auth.BlockUser(friendId); <1}

{1>lua fct\_label="lua" client.auth:block\_user(friend\_id) <1}

### 屏蔽用户

{1>javascript fct\_label="JavaScript" await client.auth.unblockUser(friendId); <1}

{1>csharp fct\_label="C#" await client.Auth.UnblockUser(friendId); <1}

{1>lua fct\_label="lua" client.auth:unblock\_user(friend\_id) <1}
