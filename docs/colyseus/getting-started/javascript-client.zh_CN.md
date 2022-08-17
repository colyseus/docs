# JavaScript/TypeScript SDK

JavaScript/TypeScript SDK 几乎与所有平台兼容:

- 浏览器 (Google Chrome, Firefox, Safari, Opera, Brave等.)
- [Node.js](https://nodejs.org/)
- [Electron](https://github.com/electron/electron)
- [React Native](https://github.com/facebook/react-native)
- [Cocos Creator 3.0](https://cocos.com/creator) ([查看说明](/getting-started/cocos-creator))

## 用法

### 将 JavaScript SDK 引入您的项目

如果您在使用构建工具(`webpack`, `rollup` 或类似工具), 这是最佳方式

```
npm install --save colyseus.js
```

若您不使用构建工具, 推荐从 [GitHub Releases](https://github.com/colyseus/colyseus.js/releases) 下载发布的二进制文件.

```html
<script src="colyseus.js"></script>
```

或者您也可以直接使用 unpkg 加载分布式文件. 记得将其中的 `@x.x.x` 替换为与您的服务器兼容的版本.

```html
<script src="https://unpkg.com/colyseus.js@^0.14.0/dist/colyseus.js"></script>
```

### 连接至服务器:

```ts
import * as Colyseus from "colyseus.js"; // 用 <script> 载入的话不用写这句.

var client = new Colyseus.Client('ws://localhost:2567');
```

### 加入房间:

```ts
client.joinOrCreate("room_name").then(room => {
    console.log(room.sessionId, "joined", room.name);
}).catch(e => {
    console.log("JOIN ERROR", e);
});
```

### 房间事件

房间 state 更新:

```ts
room.onStateChange((state) => {
  console.log(room.name, "has new state:", state);
});
```

从服务器广播或直接发给该客户端的消息:

```ts
room.onMessage("message_type", (message) => {
  console.log(client.id, "received on", room.name, message);
});
```

发生服务器错误:

```ts
room.onError((code, message) => {
  console.log(client.id, "couldn't join", room.name);
});
```

客户端离开房间:

```ts
room.onLeave((code) => {
  console.log(client.id, "left", room.name);
});
```