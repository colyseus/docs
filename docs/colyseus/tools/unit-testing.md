# Unit Testing a Colyseus Project

The `@colyseus/testing` package provides a few utility methods for testing your Colyseus application. It can be used along with your favorite testing framework, such as [Mocha](https://mochajs.org/), or [Jest](https://jestjs.io/).

## Recommendations and best practices

- Make assertions on both server-side and client-side structures after simulating an exchange of messages between them.
- Room instances are disposed between tests - make sure each test you declare is creating the room you're going to perform tests and don't re-use room instances between tests.
- Always declare your test cases with `async`.
- Before running assertions make sure you [await for the server or client to process pending actions](#waiting-for-asynchronous-actions-to-process)

```typescript fct_label="Mocha + TypeScript"
import { ColyseusTestServer, boot } from "@colyseus/testing";

// import your "arena.config.ts" file here.
import appConfig from "../src/arena.config";

describe("testing your Colyseus app", () => {
  let colyseus: ColyseusTestServer;

  before(async () => colyseus = await boot(appConfig));
  after(async () => colyseus.shutdown());

  beforeEach(async () => await colyseus.cleanup());

  it("connecting into a room", async() => {
    // `room` is the server-side Room instance reference.
    const room = await colyseus.createRoom("my_room", {});

    // `client1` is the client-side `Room` instance reference (same as JavaScript SDK)
    const client1 = await colyseus.connectTo(room);

    // make your assertions
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
    // `room` is the server-side Room instance reference.
    const room = await colyseus.createRoom("my_room", {});

    // `client1` is the client-side `Room` instance reference (same as JavaScript SDK)
    const client1 = await colyseus.connectTo(room);

    // make your assertions
    expect(client1.sessionId).toEqual(room.clients[0].sessionId);
  });
});
```

---

## Waiting for asynchronous actions to process

### `room.waitForMessage(type)`

Wait for a particular message `type` to arrive in the server.

```typescript
it("should receive message", async() => {
    const room = await colyseus.createRoom("my_room");
    const client1 = await colyseus.connectTo(room);

    client1.send("foo", "payload");

    // wait for specific a message
    const [ client, message ] = await room.waitForMessage("foo");

    // ... message "foo" has been received and processed
    assert.strictEqual(client.sessionId, client1.sessionId);
    assert.strictEqual("payload", message);
});
```

---

### `room.waitForNextMessage()`

Wait for any next message to arrive in the server.

**Parameters**

- `additionalDelay: number` - additional delay after `onMessage` has been called in the server-side, in milliseconds (optional)

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

Wait for the server to send the latest patched state to all clients.

```typescript
it("client state must match server's after patch is received", async() => {
    const room = await colyseus.createRoom("my_room");
    const client1 = await colyseus.connectTo(room);

    await room.waitForNextPatch();

    // server and client's state must match after the patch
    assert.deepStrictEqual(client1.state.toJSON(), room.state.toJSON());
});
```

---

### `room.waitForNextSimulationTick()`

Wait for the next simulation tick to complete.

```typescript
it("should assert something after room's simulation tick", async() => {
    const room = await colyseus.createRoom("my_room");
    const client1 = await colyseus.connectTo(room);

    await room.waitForNextSimulationTick();

    // (this is just an illustration scenario)
    // (assuming the room's state has a "tick" property that updates during setSimulationInterval())
    assert.strictEqual(room.state.tick, 1);
});
```

---

## Client-side SDK methods & utilities

From your test-cases, you may call any of the client-side SDK methods through `colyseus.sdk`

- [`colyseus.sdk.joinOrCreate()`](/colyseus/client/client/#joinorcreate-roomname-string-options-any)
- [`colyseus.sdk.create()`](/colyseus/client/client/#create-roomname-string-options-any)
- [`colyseus.sdk.join()`](/colyseus/client/client/#join-roomname-string-options-any)
- [`colyseus.sdk.joinById()`](/colyseus/client/client/#joinbyid-roomid-string-options-any)

**Example**

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

Wait for client state to be in sync with the server.

```typescript
it("should do xyz after receiving message 'x'", async () => {
    const client = await colyseus.sdk.joinOrCreate("battle_room");
    await client.waitForNextPatch();
    // perform assertions after client has received a message
});
```

---

### `client.waitForMessage(type)`

Wait for a particular message `type` to arrive in the client-side.

```typescript
it("should do xyz after receiving message 'x'", async () => {
    const client = await colyseus.sdk.joinOrCreate("battle_room");
    client.send("ask-for-x");

    await client.waitForMessage("received-x");
    // perform assertions after client has received "received-x" message type.
});
```

---

### `client.waitForNextMessage()`

Wait for any next message to arrive in the client.

```typescript
it("should do xyz after receiving message 'x'", async () => {
    const client = await colyseus.sdk.joinOrCreate("battle_room");
    client.send("ask-for-x");

    await client.waitForNextMessage();
    // perform assertions after client has received a message
});
```

---

## Testing HTTP Routes

The `@colyseus/testing` also offers an HTTP client for requesting your custom http routes:

- `colyseus.http.get(url, opts)`
- `colyseus.http.post(url, opts)`
- `colyseus.http.patch(url, opts)`
- `colyseus.http.delete(url, opts)`
- `colyseus.http.put(url, opts)`

**Example**

```typescript
it("should get json data", async () => {
    const response = await colyseus.http.get("/");

    // "data" is the response body
    assert.deepStrictEqual({ success: true }, response.data);

    // access to response headers.
    assert.strictEqual('header value', response.headers['some-header']);
});
```
