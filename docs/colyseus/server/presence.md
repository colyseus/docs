# Server API &raquo; Presence

When you need to scale your server on multiple processes and/or machines, you'd need to provide the [`Presence`](/server/api/#optionspresence) option to the `Server`. The purpose of `Presence` is to allow communicating and sharing data between different processes, specially during match-making.

- [`LocalPresence`](#localpresence) (default)
- [`RedisPresence`](#redispresence-clientopts)

The `presence` instance is also available on every `Room` handler. You may use its [API](#api) to persist data and communicate between rooms via PUB/SUB.

### `LocalPresence`

This is the default option. It's meant to be used when you're running Colyseus in a single process.

### `RedisPresence (clientOpts?)`

Use this option when you're running Colyseus on multiple processes and/or machines.

**Parameters:**

- `clientOpts`: The redis client options (host/credentials). [See full list of options](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/2e6f3e603a01589534cb5f6197849a6bc8ca71dc/types/ioredis/index.d.ts#L1997-L2160).

```typescript fct_label="TypeScript"
import { Server, RedisPresence } from "colyseus";

// This happens on the slave processes.
const gameServer = new Server({
    // ...
    presence: new RedisPresence()
});

gameServer.listen(2567);
```

```typescript fct_label="JavaScript"
const colyseus = require('colyseus');

// This happens on the slave processes.
const gameServer = new colyseus.Server({
    // ...
    presence: new colyseus.RedisPresence()
});

gameServer.listen(2567);
```

## API

The `Presence` API is highly based on Redis's API, which is a key-value database.

Every [`Room`](/server/room) instance has a [`presence`](/server/room/#presence-presence) property:

```typescript
export class MyRoom extends Room {
    onCreate() {
        this.presence // full Presence API is available from here
    }
}
```

Alternatively, you can access `matchMaker.presence` from anywhere, by importing the [Match-maker API](/colyseus/server/matchmaker/):

```typescript
import { matchMaker } from "colyseus";

matchMaker.presence // full Presence API is available from here
```

### `subscribe(topic: string, callback: Function)`

Subscribes to the given `topic`. The `callback` will be triggered whenever a message is [published](#publishtopic-string-data-any) on `topic`.

```typescript
this.presence.subscribe("global-event", (data) => {
    console.log("received message:", data);
});
```

### `unsubscribe(topic: string, callback?: Function)`

Unsubscribe from given `topic`.

**Example:** Unsubscribe from all previously subscribed "global-event" callbacks.

```typescript
//
this.presence.unsubscribe("global-event");
```

**Example:** Unsubscribe from a specific "topic" callback.

```typescript
function callback(data) { }
this.presence.subscribe("global-event", callback);

// unsubscribing from specific callback
this.presence.unsubscribe("global-event", callback);
```

### `publish(topic: string, data: any)`

Posts a message to given `topic`.

```typescript
this.presence.publish("global-event", { any: 1, data: 2, here: "3" });
```

### `setex(key: string, value: string, seconds: number)`

Set key to hold the string value and set key to timeout after a given number of seconds.

**Example:** Setting a `"global-key"` that is globally available for 2 minutes.

```typescript
this.presence.setex("global-key", "a string value", 120);
```

### `get(key: string)`

Get the value of key.

```typescript
const globalKeyValue = await this.presence.get("global-key");
```

### `del(key: string): void`

Removes the specified key.

```typescript
await this.presence.del("global-key");
```

### `exists(key: string): Promise<boolean>`

Returns if key exists.

```typescript
const globalKeyExists = await this.presence.exists("global-key");
```

### `incr(key: string)`

Increments the number stored at key by one.

If the key does not exist, it is set to 0 before performing the operation.

An error is returned if the key contains a value of the wrong type or contains a string that can not be represented as integer.

This operation is limited to 64 bit signed integers.

```typescript
await this.presence.incr("global-count");
await this.presence.incr("global-count");
await this.presence.incr("global-count");

// get value from "global-count" key
const count = await this.presence.get("global-count");
console.log(count) // => 3
```

### `decr(key: string)`

Decrements the number stored at key by one.

If the key does not exist, it is set to 0 before performing the operation.

An error is returned if the key contains a value of the wrong type or contains a string that can not be represented as integer.

This operation is limited to 64 bit signed integers.

```typescript
await this.presence.decr("global-count");
await this.presence.decr("global-count");
await this.presence.decr("global-count");

// get value from "global-count" key
const count = await this.presence.get("global-count");
console.log(count) // => 33
```

### `sadd(key: string, value: any)`

Add the specified members to the set stored at key.

Specified members that are already a member of this set are ignored.

If key does not exist, a new set is created before adding the specified members.

```typescript
await this.presence.sadd("global-set1", "member-one");
await this.presence.sadd("global-set1", "member-one"); // ignored, not added
await this.presence.sadd("global-set1", "member-two");
await this.presence.sadd("global-set1", "member-three");
```

### `smembers(key: string)`

Returns all the members of the set value stored at key.

```typescript
const globalSetMembers = await this.presence.del("global-set1");
console.log(globalSetMembers) // => ["member-one", "member-two", "member-three"]
```

### `sismember(key: string, member: string)`

Returns if `member` is a member of the set stored at key

**Return value**

- `1` if the element is a member of the set.
- `0` if the element is not a member of the set, or if key does not exist.

```typescript
const isMember = await this.presence.sismember("global-set1", "member-three");

if (isMember) {
    console.log("member-three IS present on 'global-set1'");

} else {
    console.log("member-three IS NOT present on 'global-set1'");
}
```

### `srem(key: string, value: any)`

Remove the specified members from the set stored at key.

Specified members that are not a member of this set are ignored.

If key does not exist, it is treated as an empty set and this command returns `0`.

```typescript
await this.presence.srem("global-set1", "member-three");
```

### `scard(key: string)`

Returns the set number of elements (cardinality) of the set stored at key.

```typescript
const cardinality = await this.presence.scard("global-set1");
console.log(cardinality) // => 2
```

### `sinter(...keys: string[])`

Returns the members of the set resulting from the intersection of all the given sets.

```typescript
// add members to "global-set1"
await this.presence.sadd("global-set1", "member-one");
await this.presence.sadd("global-set1", "member-two");

// add members to "global-set2"
await this.presence.sadd("global-set2", "member-two");
await this.presence.sadd("global-set2", "member-three");

// get the intersection
const intersection = await this.presence.sinter("global-set1", "global-set2");
console.log(intersection); // => ["member-two"]
```

### `hset(key: string, field: string, value: string)`

Sets field in the hash stored at key to value.

If key does not exist, a new key holding a hash is created.

If field already exists in the hash, it is overwritten.

```typescript
await this.presence.hset("global-hashmap1", "key1", "1");
await this.presence.hset("global-hashmap1", "key2", "2");
```

### `hincrby(key: string, field: string, value: number)`

Increments the number stored at field in the hash stored at key by increment.

If key does not exist, a new key holding a hash is created.

If field does not exist the value is set to 0 before the operation is performed.

```typescript
await this.presence.hset("global-hashmap1", "key1", "2");
const incr = await this.presence.hincrby("global-hashmap1", "key1", "5");
console.log(incr) // => "7"
```

### `hget(key: string, field: string): Promise<string>`

Returns the value associated with field in the hash stored at key.

```typescript
await this.presence.hset("global-hashmap1", "key", "value");
const value = await this.presence.hget("global-hashmap1", "key");
console.log(value) // => "value"
```

### `hgetall(key: string): Promise<{[field: string]: string}>`

Returns all fields and values of the hash stored at key.

```typescript
await this.presence.hset("global-hashmap1", "key1", "1");
await this.presence.hset("global-hashmap1", "key2", "2");

const value = await this.presence.hgetall("global-hashmap1");
console.log(value) // => {"key1": "1", "key2": "2"}
```

### `hdel(key: string, field: string)`

Removes the specified fields from the hash stored at key.

Specified fields that do not exist within this hash are ignored.

If key does not exist, it is treated as an empty hash and this command returns 0.

```typescript
await this.presence.hset("global-hashmap1", "key1", "1");
await this.presence.hset("global-hashmap1", "key2", "2");

// delete "key2" from "global-hashmap1".
await this.presence.hset("global-hashmap1", "key2");
```

### `hlen(key: string): Promise<number>`

Returns the number of fields contained in the hash stored at key

```typescript
await this.presence.hset("global-hashmap1", "key1", "1");
await this.presence.hset("global-hashmap1", "key2", "2");

// get length from "global-hashmap1".
const length = await this.presence.hlen("global-hashmap1");
console.log(length) // => 2
```
