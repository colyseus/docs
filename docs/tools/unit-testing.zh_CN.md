# Colyseus 工程的单元测试

在 `@colyseus/testing` 包中提供了一些用于测试 Colyseus 应用的工具. 它们也可以同您喜欢的测试工具, 比如 [Mocha](https://mochajs.org/), 或者 [Jest](https://jestjs.io/) 一起使用.

## 建议与最佳实践

- 模拟服务端与客户端数据交换之后, 在两端分别设置断言.
- 测试完成后释放 Room 实例 - 确保每个测试对象都是为了测试而新建的, 不同测试间不要共用房间.
- 每个测试都要标注 `async`.
- 测试断言之前确保 [等待服务器或客户端的任务处理完成](#等待异步程序处理完成)

```typescript fct_label="Mocha + TypeScript"
import { ColyseusTestServer, boot } from "@colyseus/testing";

// 在此处导入您的 "app.config.ts" 文件.
import appConfig from "../src/app.config";

describe("testing your Colyseus app", () => {
  let colyseus: ColyseusTestServer;

  before(async () => colyseus = await boot(appConfig));
  after(async () => colyseus.shutdown());

  beforeEach(async () => await colyseus.cleanup());

  it("connecting into a room", async() => {
    // `room` 是服务端的房间.
    const room = await colyseus.createRoom("my_room", {});

    // `client1` 是客户端 `Room` 实例 (JavaScript SDK 雷同)
    const client1 = await colyseus.connectTo(room);

    // 设置断言
    assert.strictEqual(client1.sessionId, room.clients[0].sessionId);
  });
});
```

```typescript fct_label="Jest + TypeScript"
import { ColyseusTestServer, boot } from "@colyseus/testing";

// import your "app.config.ts" file here.
import appConfig from "../src/app.config";

describe("testing your Colyseus app", () => {
  let colyseus: ColyseusTestServer;

  beforeAll(async () => colyseus = await boot(appConfig));
  afterAll(async () => await colyseus.shutdown());

  beforeEach(async () => await colyseus.cleanup());

  it("connecting into a room", async() => {
    // `room` 是服务端的房间.
    const room = await colyseus.createRoom("my_room", {});

    // `client1` 是客户端 `Room` 实例 (JavaScript SDK 雷同)
    const client1 = await colyseus.connectTo(room);

    // 设置断言
    expect(client1.sessionId).toEqual(room.clients[0].sessionId);
  });
});
```

---

## 等待异步程序处理完成

### `room.waitForMessage(type)`

等待某 `type` 的消息发送至服务器.

```typescript
it("should receive message", async() => {
    const room = await colyseus.createRoom("my_room");
    const client1 = await colyseus.connectTo(room);

    client1.send("foo", "payload");

    // 等待想要的消息
    const [ client, message ] = await room.waitForMessage("foo");

    // ... 消息 "foo" 被服务器接收处理完成
    assert.strictEqual(client.sessionId, client1.sessionId);
    assert.strictEqual("payload", message);
});
```

---

### `room.waitForNextMessage()`

等待下一个消息发送至服务器.

**参数**

- `additionalDelay: number` - 在服务器 `onMessage` 触发之后额外再多等待的毫秒数 (可选参数)

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

等待服务器对客户端发送最新补丁数据.

```typescript
it("client state must match server's after patch is received", async() => {
    const room = await colyseus.createRoom("my_room");
    const client1 = await colyseus.connectTo(room);

    await room.waitForNextPatch();

    // 接到补丁数据后客户端与服务器端状态应保持一致
    assert.deepStrictEqual(client1.state.toJSON(), room.state.toJSON());
});
```

---

### `room.waitForNextSimulationTick()`

等待模拟心跳数据.

```typescript
it("should assert something after room's simulation tick", async() => {
    const room = await colyseus.createRoom("my_room");
    const client1 = await colyseus.connectTo(room);

    await room.waitForNextSimulationTick();

    // (这里只作说明之用)
    // (假设房间状态里有一个叫做 "tick" 的属性随 setSimulationInterval() 而更新)
    assert.strictEqual(room.state.tick, 1);
});
```

---

## 客户端 SDK 功能与工具

在测试当中, 可以通过客户端 SDK 的 `colyseus.sdk` 来调用客户端的各种功能.

- [`colyseus.sdk.joinOrCreate()`](/client/client/#joinorcreate-roomname-string-options-any)
- [`colyseus.sdk.create()`](/client/client/#create-roomname-string-options-any)
- [`colyseus.sdk.join()`](/client/client/#join-roomname-string-options-any)
- [`colyseus.sdk.joinById()`](/client/client/#joinbyid-roomid-string-options-any)

**举例**

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

等待客户端状态与服务器同步.

```typescript
it("should do xyz after receiving message 'x'", async () => {
    const client = await colyseus.sdk.joinOrCreate("battle_room");
    await client.waitForNextPatch();
    // 客户端收到消息后在这里设置断言
});
```

---

### `client.waitForMessage(type)`

等待某 `type` 的消息发送至客户端.

```typescript
it("should do xyz after receiving message 'x'", async () => {
    const client = await colyseus.sdk.joinOrCreate("battle_room");
    client.send("ask-for-x");

    await client.waitForMessage("received-x");
    // 客户端收到 "received-x" 消息后在这里设置断言.
});
```

---

### `client.waitForNextMessage()`

等待下一个消息发送至客户端.

```typescript
it("should do xyz after receiving message 'x'", async () => {
    const client = await colyseus.sdk.joinOrCreate("battle_room");
    client.send("ask-for-x");

    await client.waitForNextMessage();
    // 客户端收到下一个消息后在这里设置断言
});
```

---

## 测试 HTTP 请求

在 `@colyseus/testing` 里还提供了一个 HTTP 客户端用于发送自定义的 http 请求:

- `colyseus.http.get(url, opts)`
- `colyseus.http.post(url, opts)`
- `colyseus.http.patch(url, opts)`
- `colyseus.http.delete(url, opts)`
- `colyseus.http.put(url, opts)`

**举例**

```typescript
it("should get json data", async () => {
    const response = await colyseus.http.get("/");

    // "data" 是响应体
    assert.deepStrictEqual({ success: true }, response.data);

    // 查看响应头部
    assert.strictEqual('header value', response.headers['some-header']);
});
```