# [状态同步](/state/overview) &raquo; 架构

!!! Tip "还没使用 TypeScript?"
    强烈建议您使用 TypeScript 以便更好地定义 Schema 结构并提高整体开发体验. TypeScript 支持的 "实验性修饰器" 会在本手册内大量使用.

## 如何定义可同步结构

- `Schema` 结构由服务器定义, 用于房间状态同步.
- 只有以 `@type()` 修饰的字段才会被用于同步.
- _(可同步 Schema 结构仅应用于状态相关的数据.)_

### 定义 `Schema` 结构

```typescript fct_label="TypeScript"
// MyState.ts
import { Schema, type } from "@colyseus/schema";

export class MyState extends Schema {
    @type("string") currentTurn: string;
}
```

```typescript fct_label="JavaScript"
// MyState.ts
const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class MyState extends Schema {
}
schema.defineTypes(MyState, {
  currentTurn: "string"
});
```

!!! Tip "_"这个 `@type()` 关键字是什么? 我之前从未见过!"_"
    您看见的在本页大量使用的 `@type()` 是一个即将推出的 JavaScript 功能, 还没有被 TC39 正式认可. `type` 其实只是一个从 `@colyseus/schema` 模块导入的函数. 在属性层级调用带有 `@` 前缀的 `type`, 意味着我们将其作为一个 _属性修饰器_ 进行调用. [在这里查看修饰器方案](https://github.com/tc39/proposal-decorators).

### 在您的 `Room` 内使用状态

```typescript
// MyRoom.ts
import { Room } from "colyseus";
import { MyState } from "./MyState";

export class MyRoom extends Room<MyState> {
    onCreate() {
        this.setState(new MyState());
    }
}
```


## 使用 Schema

- 只有服务器端有权修改 Schema 数据
- 客户端要包含以 [`schema-codegen`](#client-side-schema-generation) 生成的与服务器端同样的 `Schema` 定义. _(如果使用 [JavaScript SDK](/getting-started/javascript-client/) 则此条为可选项)_
- 为了从服务器获得更新, 需要 [在客户端把回调附加在 schema 实例上](#callbacks).
- 客户端永远不应主动修改 schema - 因为在收到来自服务器的下一个心跳就会把它更新覆盖掉.

### 基本类型

基本类型为数字, 字符串和布尔型.

| 类型 | 描述 | 范围 |
|------|-------------|------------|
| `"string"` | utf8 字符串 | 最大 `4294967295` 字节|
| `"number"` | 又称为 "正整数". 自动定义数字类型. (编码时可能会多用1个字节) | 取值范围 `0` 到 `18446744073709551615` |
| `"boolean"` | `true` 或 `false` | 取值为 `0` 或 `1` |

**特定数值类型:**

| 类型 | 描述 | 范围 |
|------|-------------|------------|
| `"int8"` | 有符号 8-bit 整数 | `-128` 到 `127` |
| `"uint8"` | 无符号 8-bit 整数 | `0` 到 `255` |
| `"int16"` | 有符号 16-bit 整数 | `-32768` 到 `32767` |
| `"uint16"` | 无符号 16-bit 整数 | `0` 到 `65535` |
| `"int32"` | 有符号 32-bit 整数 | `-2147483648` 到 `2147483647` |
| `"uint32"` | 无符号 32-bit 整数 | `0` 到 `4294967295` |
| `"int64"` | 有符号 64-bit 整数 | `-9223372036854775808` 到 `9223372036854775807` |
| `"uint64"` | 无符号 64-bit 整数 | `0` 到 `18446744073709551615` |
| `"float32"` | 单精度浮点数 | `-3.40282347e+38` 到 `3.40282347e+38`|
| `"float64"` | 双精度浮点数 | `-1.7976931348623157e+308` 到 `1.7976931348623157e+308` |


### 复杂类型

复杂类型由 `Schema` 嵌套而成. 它们也可以包含 [集合类型](#collections-of-items) (array, map 等).

```typescript fct_label="TypeScript"
import { Schema, type } from "@colyseus/schema";

class World extends Schema {
    @type("number") width: number;
    @type("number") height: number;
    @type("number") items: number = 10;
}

class MyState extends Schema {
    @type(World) world: World = new World();
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class World extends Schema {
}
schema.defineTypes(World, {
  width: "number",
  height: "number",
  items: "number"
});

class MyState extends Schema {
    constructor () {
        super();

        this.world = new World();
    }
}
schema.defineTypes(MyState, {
  world: World
});
```

## 集合类型

### ArraySchema

`ArraySchema` 是一个可同步版本的内置 JavaScript [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 类型.

**示例: 自定义 `Schema` 类型** 数组

```typescript fct_label="TypeScript"
import { Schema, ArraySchema, type } from "@colyseus/schema";

class Block extends Schema {
    @type("number") x: number;
    @type("number") y: number;
}

class MyState extends Schema {
    @type([ Block ]) blocks = new ArraySchema<Block>();
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const ArraySchema = schema.ArraySchema;

class Block extends Schema {
}
schema.defineTypes(Block, {
  x: "number",
  y: "number"
});

class MyState extends Schema {
    constructor () {
        super();

        this.blocks = new ArraySchema();
    }
}
schema.defineTypes(MyState, {
  blocks: [ Block ],
});
```

**示例: 基本类型** 数组

数组元素必须是同一类型数据.

```typescript fct_label="TypeScript"
import { Schema, ArraySchema, type } from "@colyseus/schema";

class MyState extends Schema {
    @type([ "string" ]) animals = new ArraySchema<string>();
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const ArraySchema = schema.ArraySchema;

class MyState extends Schema {
    constructor () {
        super();

        this.animals = new ArraySchema();
    }
}
schema.defineTypes(MyState, {
  animals: [ "string" ],
});
```

---

#### `array.push()`

在一个数组后面添加一个或多个元素, 并返回该数组更新后的长度.

```typescript
const animals = new ArraySchema<string>();
animals.push("pigs", "goats");
animals.push("sheeps");
animals.push("cows");
// 输出: 4
```

---

#### `array.pop()`

移除一个数组的最后一个元素并返回该元素. 该方法会改变数组的长度.

```typescript
animals.pop();
// 输出: "cows"

animals.length
// 输出: 3
```

---

#### `array.shift()`

移除一个数组的第一个元素并返回该元素. 该方法会改变数组的长度.

```typescript
animals.shift();
// 输出: "pigs"

animals.length
// 输出: 2
```

---

#### `array.unshift()`

在一个数组的开头添加一个或多个元素, 并返回该数组更新后的长度.

```typescript
animals.unshift("pigeon");
// 输出: 3
```

---

#### `array.indexOf()`

返回数组中找到给定元素的第一个索引, 如果不存在则返回 -1

```typescript
const itemIndex = animals.indexOf("sheeps");
```

---

#### `array.splice()`

移除替换现有元素或 [在指定位置](https://en.wikipedia.org/wiki/In-place_algorithm) 添加新元素来更改一个数组的内容.

```typescript
// 找到需要移除元素的索引
const itemIndex = animals.findIndex((animal) => animal === "sheeps");

// 移除元素!
animals.splice(itemIndex, 1);
```

---

#### `array.forEach()`

迭代数组的每个元素.

```typescript fct_label="TypeScript"
this.state.array1 = new ArraySchema<string>('a', 'b', 'c');

this.state.array1.forEach(element => {
    console.log(element);
});
// 输出: "a"
// 输出: "b"
// 输出: "c"
```

```csharp fct_label="C#"
State.array1.ForEach((value) => {
    Debug.Log(value);
})
```

```lua fct_label="LUA"
state.array1:each(function(value, index)
    print(index, "=>")
    pprint(value)
end)
```

```lua fct_label="Haxe"
for (index => value in state.array1) {
    trace(index + " => " + value);
}
```

!!! Note "Array 还有更多函数可用"
    详见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/).

### MapSchema

`MapSchema` 是一个基于 JavaScript 内置 [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 的可同步版本.

推荐使用 Maps 里的 id 来追踪游戏实体, 比如玩家, 敌人等.

!!! Warning "当前仅支持字符串类型的 id"
    目前, `MapSchema` 允许您自定义值的类型, 但是键的类型必须为为 `string`.

```typescript fct_label="TypeScript"
import { Schema, MapSchema, type } from "@colyseus/schema";

class Player extends Schema {
    @type("number") x: number;
    @type("number") y: number;
}

class MyState extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

class Player extends Schema {
}
schema.defineTypes(Player, {
  x: "number",
  y: "number"
});

class MyState extends Schema {
    constructor () {
        super();

        this.players = new MapSchema();
    }
}
schema.defineTypes(MyState, {
  players: { map: Player }
});
```

---

#### `map.get()`

通过键得到 map 的值:

```typescript
const map = new MapSchema<string>();
const item = map.get("key");
```

或者

```typescript
//
// 不建议使用这种方法
//
// 保留这种方法只是为了 @colyseus/schema 的版本向下兼容
// 未来会舍弃这种方法.
//
const item = map["key"];
```

---

#### `map.set()`

通过键来设置 map 的值:

```typescript
const map = new MapSchema<string>();
map.set("key", "value");
```

或者

```typescript
//
// 不建议使用这种方法
//
// 保留这种方法只是为了 @colyseus/schema 的版本向下兼容
// 未来会舍弃这种方法.
//
map["key"] = "value";
```

---

#### `map.delete()`

通过键移除 map 的值:

```typescript
map.delete("key");
```

或者

```typescript
//
// 不建议使用这种方法
//
// 保留这种方法只是为了 @colyseus/schema 的版本向下兼容
// 未来会舍弃这种方法.
//
delete map["key"];
```

---

#### `map.size`

返回 `MapSchema` 对象中元素的数量.

```typescript
const map = new MapSchema<number>();
map.set("one", 1);
map.set("two", 2);

console.log(map.size);
// 输出: 2
```

---

#### `map.forEach()`

迭代 map 中的键值对, 以元素插入顺序.

```typescript fct_label="TypeScript"
this.state.players.forEach((value, key) => {
    console.log("key =>", key)
    console.log("value =>", value)
});
```

```csharp fct_label="C#"
State.players.ForEach((key, value) => {
    Debug.Log(key);
    Debug.Log(value);
})
```

```lua fct_label="LUA"
state.players:each(function(value, key)
    print(key, "=>")
    pprint(value)
end)
```

```lua fct_label="Haxe"
for (key => value in state.players) {
    trace(index + " => " + value);
}
```

!!! Note "Map 还有更多函数可用"
    详见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/).


### SetSchema

!!! Warning "`SetSchema` 仅支持 JavaScript"
    目前 `SetSchema` 只能在 JavaScript 中使用. 尚不支持 Haxe, C#, LUA 和 C++ 客户端.

`SetSchema` 是一个基于 JavaScript 内置 [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) 的可同步版本.

`SetSchema` 的用法和 [`CollectionSchema`] 十分类似, 最大区别在于 Set 的值具有唯一性. JS 的 Set 没有直接获取值的方法. (比如像 [collection.at()](#collectionat))

```typescript fct_label="TypeScript"
import { Schema, SetSchema, type } from "@colyseus/schema";

class Effect extends Schema {
    @type("number") radius: number;
}

class Player extends Schema {
    @type({ set: Effect }) effects = new SetSchema<Effect>();
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const SetSchema = schema.SetSchema;

class Effect extends Schema {
}
schema.defineTypes(Effect, {
  radius: "number",
});

class Player extends Schema {
    constructor () {
        super();

        this.effects = new SetSchema();
    }
}
schema.defineTypes(Player, {
  effects: { set: Effect }
});
```

---

#### `set.add()`

为 `SetSchema` 添加元素.

```typescript
const set = new CollectionSchema<number>();
set.add(1);
set.add(2);
set.add(3);
```

---

#### `set.at()`

获取 `index` 处的值.

```typescript
const set = new CollectionSchema<string>();
set.add("one");
set.add("two");
set.add("three");

set.at(1);
// 输出: "two"
```

---

#### `set.delete()`

按值删除元素.

```typescript
set.delete("three");
```

---

#### `set.has()`

检查集合中是否有该值.

```typescript
if (set.has("two")) {
    console.log("Exists!");
} else {
    console.log("Does not exist!");
}
```

---

#### `set.size`

返回 `SetSchema` 里元素的长度.

```typescript
const set = new SetSchema<number>();
set.add(10);
set.add(20);
set.add(30);

console.log(set.size);
// 输出: 3
```

!!! Note "Set 还有更多函数可用"
    详见 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/).


### CollectionSchema

!!! Note "`CollectionSchema` 仅支持 JavaScript"
    目前 `CollectionSchema` 只能在 JavaScript 中使用. 尚不支持 Haxe, C#, LUA 和 C++ 客户端.

`CollectionSchema` 的用法与 `ArraySchema` 类似, 需要注意的是, 它不具备某些数组可用的函数.

```typescript fct_label="TypeScript"
import { Schema, CollectionSchema, type } from "@colyseus/schema";

class Item extends Schema {
    @type("number") damage: number;
}

class Player extends Schema {
    @type({ collection: Item }) items = new CollectionSchema<Item>();
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const CollectionSchema = schema.CollectionSchema;

class Item extends Schema {
}
schema.defineTypes(Item, {
  damage: "number",
});

class Player extends Schema {
    constructor () {
        super();

        this.items = new CollectionSchema();
    }
}
schema.defineTypes(Player, {
  items: { collection: Item }
});
```

---

#### `collection.add()`

为 `CollectionSchema` 添加元素.

```typescript
const collection = new CollectionSchema<number>();
collection.add(1);
collection.add(2);
collection.add(3);
```

---

#### `collection.at()`

获取 `index` 处的值.

```typescript
const collection = new CollectionSchema<string>();
collection.add("one");
collection.add("two");
collection.add("three");

collection.at(1);
// 输出: "two"
```

---

#### `collection.delete()`

按值删除元素.

```typescript
collection.delete("three");
```

---

#### `collection.has()`

检查集合中是否有该值.

```typescript
if (collection.has("two")) {
    console.log("Exists!");
} else {
    console.log("Does not exist!");
}
```

---

#### `collection.size`

返回 `CollectionSchema` 里元素的长度.

```typescript
const collection = new CollectionSchema<number>();
collection.add(10);
collection.add(20);
collection.add(30);

console.log(collection.size);
// 输出: 3
```

---

#### `collection.forEach()`

迭代 `CollectionSchema` 中的键值对, 以元素插入顺序.

```typescript
collection.forEach((value, at) => {
    console.log("at =>", at)
    console.log("value =>", value)
});
```

## 每个客户端过滤数据

!!! Warning "此功能为实验性质"
    `@filter()` / `@filterChildren()` 为实验性质, 可能不适合快节奏游戏.

过滤用来为指定客户端隐藏部分状态数据, 防止作弊, 防止玩家获取全部数据.

数据过滤器回调, 可以针对 **每个客户端** 的 **每个字段** 进行触发 (如果使用了 `@filterChildren`, 还可在每个子结构触发). 如果过滤器回调返回 `true`, 则该字段数据将会发送给那个指定的客户端, 否则不发送.

请注意, 只有被过滤字段 (或其子字段) 数据更新时, 过滤器回调才能被触发. 要想手动触发请参考 [此问题](https://github.com/colyseus/schema/issues/102) 里描述的方法.

### `@filter()` 属性修饰器

`@filter()` 属性修饰器可作用于整个 Schema 字段.

下面展示了 `@filter()` 的函数签名:

```typescript fct_label="TypeScript"
class State extends Schema {
    @filter(function(client, value, root) {
        // client 参数是:
        //
        // 当前将要接受数据的客户端. 可以通过其
        // client.sessionId, 及其他信息判定是否
        // 要把数据同步给这个客户端.

        // value 参数是:
        // 被 @filter() 标记过滤的字段值

        // root 参数是:
        // 房间 Schema 实例引用. 方便在是否过滤的
        // 决策过程中
        // 访问房间状态.
    })
    @type("string") field: string;
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');
class State extends schema.Schema {}

schema.defineTypes(State, {
    field: "string"
});

schema.filter(function(client, value, root) {
    // client is:
    //
    // the current client that's going to receive this data. you may use its
    // client.sessionId, or other information to decide whether this value is
    // going to be synched or not.

    // value is:
    // the value of the field @filter() is being applied to

    // root is:
    // the root instance of your room state. you may use it to access other
    // structures in the process of decision whether this value is going to be
    // synched or not.
    return true;
})(State.prototype, "field");
```

### `@filterChildren()` 属性修饰器

`@filterChildren()` 属性修饰器可用于过滤掉数组, 地图, 集合等内的项目. 它的签名与 `@filter()` 基本相同, 但是在 `value` 之前添加了 `key` 参数 - 表示 [ArraySchema](#arrayschema), [MapSchema](#mapschema), [CollectionSchema](#collectionschema) 等中的每个项目.

```typescript fct_label="TypeScript"
class State extends Schema {
    @filterChildren(function(client, key, value, root) {
        // client 参数是:
        //
        // 当前将要接受数据的客户端. 可以通过其
        // client.sessionId, 及其他信息判定是否
        // 要把数据同步给这个客户端.

        // value 参数是:
        // 被 @filter() 标记过滤的字段值

        // root 参数是:
        // 房间 Schema 实例引用. 方便在是否过滤的
        // 决策过程中
        // 访问房间状态.
    })
    @type([Cards]) cards = new ArraySchema<Card>();
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');
class State extends schema.Schema {}

schema.defineTypes(State, {
    cards: [Card]
});

schema.filterChildren(function(client, key, value, root) {
    // client 参数是:
    //
    // 当前将要接受数据的客户端. 可以通过其
    // client.sessionId, 及其他信息判定是否
    // 要把数据同步给这个客户端.

    // key 参数是:
    // 子字段名

    // value 参数是:
    // 被 @filter() 标记过滤的字段值

    // root 参数是:
    // 房间 Schema 实例引用. 方便在是否过滤的
    // 决策过程中
    // 访问房间状态.
    return true;
})(State.prototype, "cards");
```

**示例:** 在卡牌游戏中, 应该只有卡牌的持有者知道每个卡片的数据, 或者在特定条件下才能知道这些数据 (例如摊牌)

参考 `@filter()` 回调签名:

```typescript fct_label="TypeScript"
import { Client } from "colyseus";

class Card extends Schema {
    @type("string") owner: string; // 用来保存卡牌持有者的 sessionId
    @type("boolean") discarded: boolean = false;

    /**
     * 不要在 `@filter` 函数里使用箭头函数
     * (会造成 `this` 指针丢失)
     */
    @filter(function(
        this: Card, // 定义 `@filter` 的类 (这里 this 就是 `Card` 的实例)
        client: Client, // 要被过滤的客户端 `client` 实例
        value: Card['number'], // 要被过滤的字段值. (这里是 `number` 字段的值)
        root: Schema // 房间状态 Schema 实例
    ) {
        return this.discarded || this.owner === client.sessionId;
    })
    @type("uint8") number: number;
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');

class Card extends schema.Schema {}
schema.defineTypes(Card, {
    owner: "string",
    discarded: "boolean",
    number: "uint8"
});

/**
 * 不要在 `@filter` 函数里使用箭头函数
 * (会造成 `this` 指针丢失)
 */
schema.filter(function(client, value, root) {
    return this.discarded || this.owner === client.sessionId;
})(Card.prototype, "number");
```

## 客户端

!!! Warning "C#, C++, Haxe"
    在使用强类型语言时, 需要基于 Typescript schema 定义手动生成客户端 schema 文件. [生成客户端 schema 的方法](#client-side-schema-generation).

### 回调

服务器状态变更应用到客户端时, 会根据变更的类型自动触发本地实例上的回调.

回调通过房间状态实例触发. 使用前要确保该实例上已实现回调函数.

- [onAdd (instance, key)](#onadd-instance-key)
- [onRemove (instance, key)](#onremove-instance-key)
- [onChange (changes)](#onchange-changes-datachange) (触发于 `Schema` 实例)
- [onChange (instance, key)](#onchange-instance-key) (触发于集合实例: `MapSchema`, `ArraySchema` 等等.)
- [listen()](#listenprop-callback)

#### `onAdd (instance, key)`

只有集合 (`MapSchema`, `ArraySchema` 等) 可以使用 `onAdd` 回调. 集合更新后触发 `onAdd` 回调, 外加已更新集合的键作为参数.

```javascript fct_label="JavaScript"
room.state.players.onAdd((player, key) => {
    console.log(player, "has been added at", key);

    // 在游戏中加入player!

    // 要想跟踪地图上物体的移动, 通常要这么做:
    player.onChange(function(changes) {
        changes.forEach(change => {
            console.log(change.field);
            console.log(change.value);
            console.log(change.previousValue);
        })
    });
});
```

```lua fct_label="LUA"
room.state.players:on_add(function (player, key)
    print("player has been added at", key);

    -- 在游戏中加入player!

    -- 要想跟踪地图上物体的移动, 通常要这么做:
    player:on_change(function(changes)
        for i, change in ipairs(changes) do
            print(change.field)
            print(change.value)
            print(change.previousValue)
        end
    end)
end)
```

```csharp fct_label="C#"
room.State.players.OnAdd((string key, Player player) =>
{
    Debug.Log("player has been added at " + key);

    // 在游戏中加入player!

    // 要想跟踪地图上物体的移动, 通常要这么做:
    player.OnChange += (changes) =>
    {
        changes.ForEach((obj) =>
        {
            Debug.Log(obj.Field);
            Debug.Log(obj.Value);
            Debug.Log(obj.PreviousValue);
        });
    };
});
```

---

#### `onRemove (instance, key)`

只有图 (`MapSchema`) 和数组 (`ArraySchema`) 可以使用 `onRemove` 回调. 集合更新后触发 `onRemove` 回调, 外加已更新集合的键作为参数.

```javascript fct_label="JavaScript"
room.state.players.onRemove((player, key) => {
    console.log(player, "has been removed at", key);

    // 从游戏中移除player!
});
```

```lua fct_label="LUA"
room.state.players:on_remove(function (player, key)
    print("player has been removed at " .. key);

    -- 从游戏中移除player!
end)
```

```csharp fct_label="C#"
room.State.players.OnRemove((string key, Player player) =>
{
    Debug.Log("player has been removed at " + key);

    // 从游戏中移除player!
});
```

---

#### `onChange (changes:DataChange[])`

> `Schema` 上的 `onChange` 和集合结构上的不一样. 对于 [集合结构(数组, 映射等)的 `onChange` 请参考这里](#onchange-instance-key).

可以注册 `onChange` 以跟踪 `Schema` 实例属性的变更. `onChange` 的参数数组包含已变更的属性以及变更前的值.


```javascript fct_label="JavaScript"
room.state.onChange((changes) => {
    changes.forEach(change => {
        console.log(change.field);
        console.log(change.value);
        console.log(change.previousValue);
    });
});
```

```lua fct_label="LUA"
room.state:on_change(function (changes)
    for i, change in ipairs(changes) do
        print(change.field)
        print(change.value)
        print(change.previousValue)
    end
end)
```

```csharp fct_label="C#"
room.State.OnChange((changes) =>
{
    changes.ForEach((obj) =>
    {
        Debug.Log(obj.Field);
        Debug.Log(obj.Value);
        Debug.Log(obj.PreviousValue);
    });
});
```

没有同步过的客户端不能注册 `onChange` 回调.

---

#### `onChange (instance, key)`

> `Schema` 上的 `onChange` 和集合结构上的不一样. 对于 [`Schema` 的 `onChange` 请参考这里](#onchange-changes-datachange).

当集合里的 **基本** 类型 (`string`, `number`, `boolean` 等) 值更新时, 将触发此回调.

```javascript fct_label="JavaScript"
room.state.players.onChange((player, key) => {
    console.log(player, "have changes at", key);
});
```

```lua fct_label="LUA"
room.state.players:on_change(function (player, key)
    print("player have changes at " .. key);
end)
```

```csharp fct_label="C#"
room.State.players.OnChange((string key, Player player) =>
{
    Debug.Log("player have changes at " + key);
});
```

对于 **非基本** 类型 (各种 `Schema` 集合), 请先注册 [`onAdd`](#onadd-instance-key) 再注册 [`onChange`](#onchange-changes-datachange).

!!! Warning "`onChange`, `onAdd` 和 `onRemove` 是 **互斥的**"
    `onChange` 回调在 [`onAdd`](#onadd-instance-key) 或 [`onRemove`](#onremove-instance-key) 期间不会被触发.

    如果想要跟踪的更新包括 `onAdd` 和 `onRemove`, 请注册这两个回调.

---

#### `.listen(prop, callback)`

侦听单个属性更新.

> `.listen()` 目前仅可用于 JavaScript/TypeScript.

**参数:**

- `property`: 想要侦听更新的属性名称.
- `callback`: 当 `property` 更新时触发的回调.


```typescript
state.listen("currentTurn", (currentValue, previousValue) => {
    console.log(`currentTurn is now ${currentValue}`);
    console.log(`previous value was: ${previousValue}`);
});
```

`.listen()` 返回的函数可用于移除侦听器


```typescript
const removeListener = state.listen("currentTurn", (currentValue, previousValue) => {
    // ...
});

// 之后, 如果不需要侦听器了, 可以调用 `removeListener()` 来移除对 `"currentTurn"` 的侦听.
removeListener();
```

**`listen` 和 `onChange` 有什么区别?**

`.listen()` 方法是专为监听单个属性 `onChange` 的简化版本. 下面是把 `.listen()` 写成 `onChange` 的样子:

```typescript
state.onChange(function(changes) {
    changes.forEach((change) => {
        if (change.field === "currentTurn") {
            console.log(`currentTurn is now ${change.value}`);
            console.log(`previous value was: ${change.previousValue}`);
        }
    })
})
```

---

## 生成客户端 schema 的方法

`schema-codegen` 是一个转译工具, 用于把服务器端的 schema 定义文件转换为客户端可以使用的版本:

要在客户端正确解码 state, 客户端的 schema 定义文件必须与服务器端相兼容.

!!! Warning "在使用 [JavaScript SDK](/getting-started/javascript-client/) 时不必使用此工具"
    只有在客户端使用强类型语言, 如 C#, Haxe 等时, 才需要使用 `schema-codegen`.

**使用方法**

要在终端查看使用方法, 先 `cd` 进入服务器目录, 然后运行以下命令:

```
npx schema-codegen --help
```

**输出:**

```
schema-codegen [path/to/Schema.ts]

Usage (C#/Unity)
    schema-codegen src/Schema.ts --output client-side/ --csharp --namespace MyGame.Schema

Valid options:
    --output: fhe output directory for generated client-side schema files
    --csharp: generate for C#/Unity
    --cpp: generate for C++
    --haxe: generate for Haxe
    --ts: generate for TypeScript
    --js: generate for JavaScript
    --java: generate for Java

Optional:
    --namespace: generate namespace on output code
```

### 举例: Unity / C#

下面是用 [Unity 演示项目](https://github.com/colyseus/colyseus-unity3d/blob/aa9a722a50b2958ce01785969cd8ecb8aee24fd0/Server/package.json#L12) 生成 C# schema 文件的实例.

```
npx schema-codegen src/rooms/schema/* --csharp --output ../Assets/Scripts/States/"
generated: Player.cs
generated: State.cs
```

**使用 `npm` 脚本:**

简言之, 推荐您把 `schema-codegen` 的参数保存在 `package.json` 文件中的 `npm` 脚本里:

```json
"scripts": {
    "schema-codegen": "schema-codegen src/rooms/schema/* --csharp --output ../Assets/Scripts/States/"
}
```

这样, 运行 `npm run schema-codegen`, 就可以代替完整的命令:

```
npm run schema-codegen
generated: Player.cs
generated: State.cs
```

### 版本及向下/向上兼容

通过在现有结构末尾声明新字段, 可以实现向下/向上兼容, 不应删除先前的声明, 而是应该根据需要将其标记为 `@deprecated()`. 下面是一个例子.

```typescript fct_label="Live version 1"
import { Schema, type, deprecated } from "@colyseus/schema";

class MyState extends Schema {
    @type("string") myField: string;
}
```

```typescript fct_label="Live version 2"
import { Schema, type, deprecated } from "@colyseus/schema";

class MyState extends Schema {
    // 标记此字段作废.
    @deprecated() @type("string") myField: string;

    // 保证不同客户端版本的服务器兼容.
    @type("string") newField: string;
}
```

```typescript fct_label="Live version 3"
import { Schema, type, deprecated } from "@colyseus/schema";

class MyState extends Schema {
    // 标记此字段作废.
    @deprecated() @type("string") myField: string;

    // 再次标记此字段作废.
    @deprecated() @type("string") newField: string;

    // 最新的字段总是保持在最下边
    @type("string") anotherNewField: string;
}
```

这对于本地编译类语言很有用, 如 C#, C++, Haxe 等 - 即使这些客户端编译时没有最新的 schema 定义.

---

## 限制和最佳实践

- 每个 `Schema` 结构最多可以保存 `64` 个字段. 如果需要更多字段, 可以嵌套使用 `Schema` 结构.
- `NaN` 或 `null` 数字被编码为 `0`
- `null` 字符串被编码为 `""`
- `Infinity` 数字被编码为 `Number.MAX_SAFE_INTEGER`
- 不支持多维数组. [查看如何将一维数组作为多维数组使用](https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid/212813#212813)
- `@colyseus/schema` 编码顺序按照字段定义顺序.
    - 编码器 (服务器) 和解码器 (客户端) 都必须拥有相同的 schema 定义.
    - 字段的顺序也要相同.

### 集合

集合类型 (`ArraySchema`, `MapSchema` 等) 里的元素类型必须相同, 或者基类相同.

**支持以下写法:**

```typescript
class Item extends Schema {/* 基类 Item */}
class Weapon extends Item {/* 武器类 */}
class Shield extends Item {/* 盾牌类 */}

class Inventory extends Schema {
    @type({ map: Item }) items = new MapSchema<Item>();
}

const inventory = new Inventory();
inventory.set("left", new Weapon());
inventory.set("right", new Shield());
```
