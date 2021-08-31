# JavaScript/TypeScript SDK

JavaScript/TypeScript SDK 幾乎與所有平台相容：

- 瀏覽器（Google Chrome、Firefox、Safari、Opera、Brave 等）
- [Node.js](https://nodejs.org/)
- [Electron](https://github.com/electron/electron)
- [React Native](https://github.com/facebook/react-native)
- [Cocos Creator 3.0](https://cocos.com/creator)（[>查看說明](/getting-started/cocos-creator)）

## 使用方式

### 在您的專案中包含 JavaScript SDK

如果您使用建構工具（`webpack`、`rollup` 或類似工具），這是首選方法

``` npm install --save colyseus.js ```

如果您不使用建置工具，建議從 [GitHub Releases](https://github.com/colyseus/colyseus.js/releases) 下載發布二進位檔

```html
<script src="colyseus.js"></script>
```

或者，您可以使用 unpkg 直接包含發行檔案。確保將其中的 `@x.x.x` 部分替換為與您的伺服器相容的版本。

```html
<script src="https://unpkg.com/colyseus.js@^0.14.0/dist/colyseus.js"></script>
```

### 連接到伺服器：

```ts import * as Colyseus from "colyseus.js"; // 如果包含透過，則不需要 <script> tag.

var client = new Colyseus.Client('ws://localhost:2567'); ```

### 加入房間：

```ts client.joinOrCreate("room_name").then(room => { console.log(room.sessionId, "joined", room.name); }).catch(e => { console.log("JOIN ERROR", e); }); ```

### 房間事件

房間狀態已更新：

```ts room.onStateChange((state) => { console.log(room.name, "has new state:", state); }); ```

從伺服器或直接向此用戶端廣播的訊息：

```ts room.onMessage("message_type", (message) => { console.log(client.id, "received on", room.name, message); }); ```

發生伺服器錯誤：

```ts room.onError((code, message) => { console.log(client.id, "couldn't join", room.name); }); ```

客戶離開房間：

```ts room.onLeave((code) => { console.log(client.id, "left", room.name); }); ```