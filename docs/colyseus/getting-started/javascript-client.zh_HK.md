# JavaScript/TypeScript SDK

JavaScript/TypeScript SDK 幾乎與所有平臺兼容：

- 瀏覽器(Google Chrome, Firefox, Safari, Opera, Brave等.)
- [Node.js](https://nodejs.org/)
- [Electron](https://github.com/electron/electron)
- [React Native](https://github.com/facebook/react-native)
- [Cocos Creator 3.0](https://cocos.com/creator) ([查看說明](/getting-started/cocos-creator))

## 用法

### 將 JavaScript SDK 包括在你的項目中

如果你在使用構建工具(`webpack`,  `rollup` 或類似工具), 這是最佳方式

```
npm install --save colyseus.js
```

若您不使用生成工具, 推薦從 [GitHub Releases](https://github.com/colyseus/colyseus.js/releases) 下載發布的二進位文件.

```html
<script src="colyseus.js"></script>
```

或者您也可以直接使用 unpkg 加載分布式文件.記得將其中的 `@x.x.x` 內容替換為與您服務器兼容的版本.

```html
<script src="https://unpkg.com/colyseus.js@^0.14.0/dist/colyseus.js"></script>
```

### 連接至服務器：

```ts
import * as Colyseus from "colyseus.js"; // not necessary if included via <script> tag.

var client = new Colyseus.Client('ws://localhost:2567');
```

### 加入房間：

```ts
client.joinOrCreate("room_name").then(room => {
    console.log(room.sessionId, "joined", room.name);
}).catch(e => {
    console.log("JOIN ERROR", e);
});
```

### 房間事件

房間狀態已更新：

```ts
room.onStateChange((state) => {
  console.log(room.name, "has new state:", state);
});
```

從服務器廣播的消息或直接發給本客戶端的消息：

```ts
room.onMessage("message_type", (message) => {
  console.log(client.id, "received on", room.name, message);
});
```

發生服務器錯誤：

```ts
room.onError((code, message) => {
  console.log(client.id, "couldn't join", room.name);
});
```

服務器離開房間：

```ts
room.onLeave((code) => {
  console.log(client.id, "left", room.name);
});
```
