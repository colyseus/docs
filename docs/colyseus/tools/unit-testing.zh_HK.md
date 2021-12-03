# Colyseus 工程的單元測試

在 `@colyseus/testing` 包中提供了一些用於測試 Colyseus 應用的工具. 它們也可以同您喜歡的測試工具, 比如 [Mocha](https://mochajs.org/), 或者 [Jest](https://jestjs.io/) 一起使用.

## 建議與最佳實踐

- 模擬服務端與客戶端資訊交換之後, 在兩端分別設置斷言.
- 測試完成後釋放 Room 實例 - 確保每個測試對象都是為了測試而新建的, 不同測試間不要共用房間.
- 每個測試都要標註 `async`.
- 測試斷言之前確保 [等待伺服器或客戶端的任務處理完成](#等待異步程序處理完成)

```typescript fct_label="Mocha + TypeScript"
import { ColyseusTestServer, boot } from "@colyseus/testing";

// 在此處匯入您的 "arena.config.ts" 文件.
import appConfig from "../src/arena.config";

describe("testing your Colyseus app", () => {
  let colyseus: ColyseusTestServer;

  before(async () => colyseus = await boot(appConfig));
  after(async () => colyseus.shutdown());

  beforeEach(async () => await colyseus.cleanup());

  it("connecting into a room", async() => {
    // `room` 是服務端的房間.
    const room = await colyseus.createRoom("my_room", {});

    // `client1` 是客戶端 `Room` 實例 (JavaScript SDK 雷同)
    const client1 = await colyseus.connectTo(room);

    // 設置斷言
    assert.strictEqual(client1.sessionId, room.clients[0].sessionId);
  });
});
```

```typescript fct_label="Jest + TypeScript"
import { ColyseusTestServer, boot } from "@colyseus/testing";

// import your "arena.config.ts" file here.
import appConfig from "../src/arena.config";

describe("testing your Colyseus app", () => {
  let colyseus: ColyseusTestServer;

  beforeAll(async () => colyseus = await boot(appConfig));
  afterAll(async () => await colyseus.shutdown());

  beforeEach(async () => await colyseus.cleanup());

  it("connecting into a room", async() => {
    // `room` 是服務端的房間.
    const room = await colyseus.createRoom("my_room", {});

    // `client1` 是客戶端 `Room` 實例 (JavaScript SDK 雷同)
    const client1 = await colyseus.connectTo(room);

    // 設置斷言
    expect(client1.sessionId).toEqual(room.clients[0].sessionId);
  });
});
```

---

## 等待異步程序處理完成

### `room.waitForMessage(type)`

等待某個 `type` 資訊發送至伺服器.

```typescript
it("should receive message", async() => {
    const room = await colyseus.createRoom("my_room");
    const client1 = await colyseus.connectTo(room);

    client1.send("foo", "payload");

    // 等待想要的資訊
    const [ client, message ] = await room.waitForMessage("foo");

    // ... 資訊 "foo" 被伺服器接收處理完成
    assert.strictEqual(client.sessionId, client1.sessionId);
    assert.strictEqual("payload", message);
});
```

---

### `room.waitForNextMessage()`

等待下一個資訊發送至伺服器.

**參數**

- `additionalDelay: number` - 在伺服器 `onMessage` 觸發之後額外再多等待的毫秒數 (可選參數)

```typescript
it("should receive message", async() => {
    const room = await colyseus.createRoom("my_room");
    const client1 = await colyseus.connectTo(room);

    let received = false;
    room.onMessage("foo", (client, message) => {
        received = true;
    });

    client1.send("foo");
    await room.waitForNextMessage();

    assert.ok(received);
});
```

---

### `room.waitForNextPatch()`

等待伺服器對客戶端發送最新補丁數據.

```typescript
it("client state must match server's after patch is received", async() => {
    const room = await colyseus.createRoom("my_room");
    const client1 = await colyseus.connectTo(room);

    await room.waitForNextPatch();

    // 接到補丁數據後客戶端與伺服器端狀態應保持一致
    assert.deepStrictEqual(client1.state.toJSON(), room.state.toJSON());
});
```

---

### `room.waitForNextSimulationTick()`

等待模擬心跳數據.

```typescript
it("should assert something after room's simulation tick", async() => {
    const room = await colyseus.createRoom("my_room");
    const client1 = await colyseus.connectTo(room);

    await room.waitForNextSimulationTick();

    // (這裏只作說明之用)
    // (假設房間狀態裏有一個叫做 "tick" 的屬性隨 setSimulationInterval() 而更新)
    assert.strictEqual(room.state.tick, 1);
});
```

---

## 客戶端 SDK 功能與工具

在測試當中, 可以通過客戶端 SDK 的 `colyseus.sdk` 來調用客戶端的各種功能.

- [`colyseus.sdk.joinOrCreate()`](/colyseus/client/#joinorcreate-roomname-string-options-any)
- [`colyseus.sdk.create()`](/colyseus/client/#create-roomname-string-options-any)
- [`colyseus.sdk.join()`](/colyseus/client/#join-roomname-string-options-any)
- [`colyseus.sdk.joinById()`](/colyseus/client/#joinbyid-roomid-string-options-any)

**舉例**

```typescript
it("should connect into battle_room with options x, y, z", async () => {
    const client = await colyseus.sdk.joinOrCreate("battle_room", {
        a: "a",
        b: "b",
        c: "c"
    });
    assert.ok(client.sessionId);
});
```

### `client.waitForNextPatch()`

等待客戶端狀態與伺服器同步.

```typescript
it("should do xyz after receiving message 'x'", async () => {
    const client = await colyseus.sdk.joinOrCreate("battle_room");
    await client.waitForNextPatch();
    // 客戶端收到資訊後在這裏設置斷言
});
```

---

### `client.waitForMessage(type)`

等待某個 `type` 資訊發送至客戶端.

```typescript
it("should do xyz after receiving message 'x'", async () => {
    const client = await colyseus.sdk.joinOrCreate("battle_room");
    client.send("ask-for-x");

    await client.waitForMessage("received-x");
    // 客戶端收到 "received-x" 資訊後在這裏設置斷言.
});
```

---

### `client.waitForNextMessage()`

等待下一個資訊發送至客戶端.

```typescript
it("should do xyz after receiving message 'x'", async () => {
    const client = await colyseus.sdk.joinOrCreate("battle_room");
    client.send("ask-for-x");

    await client.waitForNextMessage();
    // 客戶端收到下一個資訊後在這裏設置斷言
});
```

---

## 測試 HTTP 請求

在 `@colyseus/testing` 裏還提供了一個 HTTP 客戶端用於發送自定義的 http 請求:

- `colyseus.http.get(url, opts)`
- `colyseus.http.post(url, opts)`
- `colyseus.http.patch(url, opts)`
- `colyseus.http.delete(url, opts)`
- `colyseus.http.put(url, opts)`

**舉例**

```typescript
it("should get json data", async () => {
    const response = await colyseus.http.get("/");

    // "data" 是響應體
    assert.deepStrictEqual({ success: true }, response.data);

    // 查看響應頭部
    assert.strictEqual('header value', response.headers['some-header']);
});
```
