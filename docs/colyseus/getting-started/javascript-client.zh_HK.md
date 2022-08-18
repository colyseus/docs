# JavaScript/TypeScript SDK

JavaScript/TypeScript SDK 幾乎與所有平台兼容:

- 浏覽器 (Google Chrome, Firefox, Safari, Opera, Brave等.)
- [Node.js](https://nodejs.org/)
- [Electron](https://github.com/electron/electron)
- [React Native](https://github.com/facebook/react-native)
- [Cocos Creator 3.0](https://cocos.com/creator) ([查看說明](/getting-started/cocos-creator))

## 用法

### 將 JavaScript SDK 引入您的項目

如果您在使用構建工具(`webpack`, `rollup` 或類似工具), 這是最佳方式

```
npm install --save colyseus.js
```

若您不使用構建工具, 推薦從 [GitHub Releases](https://github.com/colyseus/colyseus.js/releases) 下載發布的二進制文件.

```html
<script src="colyseus.js"></script>
```

或者您也可以直接使用 unpkg 加載分布式文件. 記得將其中的 `@x.x.x` 替換爲與您的服務器兼容的版本.

```html
<script src="https://unpkg.com/colyseus.js@^0.14.0/dist/colyseus.js"></script>
```

### 連接至服務器:

```ts
import * as Colyseus from "colyseus.js"; // 用 <script> 載入的話不用寫這句.

var client = new Colyseus.Client('ws://localhost:2567');
```

### 加入房間:

```ts
client.joinOrCreate("room_name").then(room => {
    console.log(room.sessionId, "joined", room.name);
}).catch(e => {
    console.log("JOIN ERROR", e);
});
```

### 房間事件

房間 state 更新:

```ts
room.onStateChange((state) => {
  console.log(room.name, "has new state:", state);
});
```

從服務器廣播或直接發給該客戶端的消息:

```ts
room.onMessage("message_type", (message) => {
  console.log(client.id, "received on", room.name, message);
});
```

發生服務器錯誤:

```ts
room.onError((code, message) => {
  console.log(client.id, "couldn't join", room.name);
});
```

客戶端離開房間:

```ts
room.onLeave((code) => {
  console.log(client.id, "left", room.name);
});
```

---

### 強類型 State / 自動補全

使用 TypeScript, 您能得益于強類型泛型和編輯器對 [state](/colyseus/state/schema/) 的自動補全.

可以只引用 state 本身的類型, 也可以引用其具體類型實現.

_(以下示例把 state 類型應用于 `joinOrCreate`, `create`, `join`, `joinById`, `reconnect` 和 `consumeSeatReservation` 函數.)_

#### 只導入 `type`:

可以用 `import type` 只導入服務器端 state 的類型.

```ts
import type { MyState } from "../server/path/MyState";

client.joinOrCreate<MyState>(...)
```

#### 導入具體類型實現:

某些情況下, 您可能需要具體的類型實現, 以便在客戶端重用服務器端 state 裏面實現的函數.

```ts
import { MyState } from "../server/path/MyState"

client.joinOrCreate("my_room", {}, MyState);
```