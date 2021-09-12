# [状态同步](/state/overview) &raquo; 架构

!!! Tip "还没使用 TypeScript?"
    强烈建议您使用 TypeScript 以便更好地定义架构结构并提高整体开发体验. TypeScript 支持的 "实验性修饰器" 会在本手册内大量使用.

## 如何定义可同步结构

- `Schema` 结构由服务器定义, 用于房间状态.
- 只有以 `@type()` 修饰的字段才被考虑用于同步.
- _(可同步架构结构应当仅用于与您的状态相关的数据.)_

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
    您看见的在本页大量使用的 `@type()` 是一个即将推出的 JavaScript 功能, 还没有被 TC39 正式认可. `type` 其实只是一个从 `@colyseus/schema` 模块导入的功能. 在属性层级调用带有 `@` 前缀的 `类型`, 意味着我们将其作为一个 _属性修饰器_ 进行调用. [在这里查看修饰器方案](https://github.com/tc39/proposal-decorators).

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


## 处理架构

- 只有服务器端负责处理变异架构结构
- 客户端必须拥有通过 `[schema-codegen`` 生成的相同的 Schema` 定义. _(如果您在使用 [JavaScript SDK](/getting-started/javascript-client/) 则为可选)_
- 为了从服务器获得更新,您需要 [将架构的回调附加在客户端内](#callbacks).
- 客户端永远不该在架构上执行变异 - 因为在收到下一个来自服务器的更改时, 它们就会被立刻替换.

### 原始类型

原始类型为数字, 字符串和布尔值.

| Type | Description | Limitation |
|------|-------------|------------|
| `"string"` | utf8 strings | maximum byte size of `4294967295` |
| `"number"` | also known as "varint". Auto-detects the number type to use. (may use one extra byte when encoding) | `0` to `18446744073709551615` |
| `"boolean"` | `true` or `false` | `0` or `1` |

**Specialized number types:**

| Type | Description | Limitation |
|------|-------------|------------|
| `"int8"` | signed 8-bit integer | `-128` to `127` |
| `"uint8"` | unsigned 8-bit integer | `0` to `255` |
| `"int16"` | signed 16-bit integer | `-32768` to `32767` |
| `"uint16"` | unsigned 16-bit integer | `0` to `65535` |
| `"int32"` | signed 32-bit integer | `-2147483648` to `2147483647` |
| `"uint32"` | unsigned 32-bit integer | `0` to `4294967295` |
| `"int64"` | signed 64-bit integer | `-9223372036854775808` to `9223372036854775807` |
| `"uint64"` | unsigned 64-bit integer | `0` to `18446744073709551615` |
| `"float32"` | single-precision floating-point number | `-3.40282347e+38` to `3.40282347e+38`|
| `"float64"` | double-precision floating-point number | `-1.7976931348623157e+308` to `1.7976931348623157e+308` |


### 复杂类型

复杂类型由其他架构实例中的 `Schema` 实例组成. 它们也可以包含 [项目集合](#collections-of-items) (数组, 地图等).

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

## 项目集合

### ArraySchema

`ArraySchema` 是一个可同步版本的内置 JavaScript [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 类型.

**示例:自定义 `Schema` 类型** 的数组

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

**示例:原始类型** 的数组

您无法将类型混合进数组中.

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

在一个数组后面添加一个或多个元素, 并返回该数组的新长度.

```typescript
const animals = new ArraySchema<string>();
animals.push("pigs", "goats");
animals.push("sheeps");
animals.push("cows");
// output: 4
```

---

#### `array.pop()`

移除一个数组的最后一个元素并返回该元素. 该方法可以更改数组的长度.

```typescript
animals.pop();
// output: "cows"

animals.length
// output: 3
```

---

#### `array.shift()`

移除一个数组的第一个元素并返回被移除的元素. 该方法可以更改数组的长度.

```typescript
animals.shift();
// output: "pigs"

animals.length
// output: 2
```

---

#### `array.unshift()`

在一个数组的开头添加一个或更多元素并返回该数组的新长度.

```typescript
animals.unshift("pigeon");
// output: 3
```

---

#### `array.indexOf()`

返回数组中可以找到的一个给定元素的第一个索引, 如果不存在则为 -1

```typescript
const itemIndex = animals.indexOf("sheeps");
```

---

#### `array.splice()`

通过移除或替换现有元素并/或 [在适当的位置](https://en.wikipedia.org/wiki/In-place_algorithm) 添加新元素的方式来更改一个数组的内容.

```typescript
// find the index of the item you'd like to remove
const itemIndex = animals.findIndex((animal) => animal === "sheeps");

// remove it!
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
// output: "a"
// output: "b"
// output: "c"
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

!!! Note "Array有更多方法可用"
    查看 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/).

### MapSchema

`MapSchema` 是一个可同步版本的内置 JavaScript [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 类型.

推荐使用 Maps 来通过 id 追踪您的游戏实体, 比如玩家, 敌人等.

!!! Warning "当前仅支持字符串键"
    目前,`MapSchema` 仅允许您自定义值的类型. 秘钥类型始终为 `字符串`.

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

通过秘钥来获取地图项:

```typescript
const map = new MapSchema<string>();
const item = map.get("key");
```

或

```typescript
//
// NOT RECOMMENDED
//
// This is a compatibility layer with previous versions of @colyseus/schema
// This is going to be deprecated in the future.
//
const item = map["key"];
```

---

#### `map.set()`

通过秘钥来设置一个地图项:

```typescript
const map = new MapSchema<string>();
map.set("key", "value");
```

或

```typescript
//
// NOT RECOMMENDED
//
// This is a compatibility layer with previous versions of @colyseus/schema
// This is going to be deprecated in the future.
//
map["key"] = "value";
```

---

#### `map.delete()`

通过秘钥来移除一个地图项:

```typescript
map.delete("key");
```

或

```typescript
//
// NOT RECOMMENDED
//
// This is a compatibility layer with previous versions of @colyseus/schema
// This is going to be deprecated in the future.
//
delete map["key"];
```

---

#### `map.size`

在一个 `MapSchema` 对象中返回元素的数量.

```typescript
const map = new MapSchema<number>();
map.set("one", 1);
map.set("two", 2);

console.log(map.size);
// output: 2
```

---

#### `map.forEach()`

迭代地图的每对秘钥/值, 按照插入顺序.

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

!!! Note "Map 有更多方法可用"
    查看 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/).


### SetSchema

!!! Warning "`SetSchema` 仅在 JavaScript 中实现"
    目前 `SetSchema` 只能与 JavaScript 一同使用. 尚不支持 Haxe, C#, LUA 和 C++ 客户端.

`SetSchema` 是一个可同步版本的内置 JavaScript [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) 类型.

`SetSchema` 的用法和 [`CollectionSchema`] 十分类似, 最大区别在于 Sets 拥有独特的值. Sets 没有直接访问值的方法. (如 [collection.at()](#collectionat))

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

将一个项附加至 `SetSchema` 对象.
item to the `SetSchema` object.

```typescript
const set = new CollectionSchema<number>();
set.add(1);
set.add(2);
set.add(3);
```

---

#### `set.at()`

在特定 `index` 中获取一个项.

```typescript
const set = new CollectionSchema<string>();
set.add("one");
set.add("two");
set.add("three");

set.at(1);
// output: "two"
```

---

#### `set.delete()`

按项的值删除项.

```typescript
set.delete("three");
```

---

#### `set.has()`

返回一个布尔值, 无论该项是否存在于 Collection 中.

```typescript
if (set.has("two")) {
    console.log("Exists!");
} else {
    console.log("Does not exist!");
}
```

---

#### `set.size`

在一个 `SetSchema` 对象中返回元素的数量.

```typescript
const set = new SetSchema<number>();
set.add(10);
set.add(20);
set.add(30);

console.log(set.size);
// output: 3
```

!!! Note "Set 有更多方法可用"
    查看 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/).


### CollectionSchema

!!! Note "`CollectionSchema` 仅在 JavaScript 中实现"
    目前 `CollectionSchema` 只能与 JavaScript 一同使用. 尚不支持 Haxe, C#, LUA 和 C++ 客户端.

`CollectionSchema` 的运作方式与 `ArraySchema` 类似, 需要注意的是, 您无法控制它的索引.

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

将一个项附加至 `CollectionSchema` 对象.

```typescript
const collection = new CollectionSchema<number>();
collection.add(1);
collection.add(2);
collection.add(3);
```

---

#### `collection.at()`

在特定 `索引` 中获取一个项.

```typescript
const collection = new CollectionSchema<string>();
collection.add("one");
collection.add("two");
collection.add("three");

collection.at(1);
// output: "two"
```

---

#### `collection.delete()`

按项的值删除项.

```typescript
collection.delete("three");
```

---

#### `collection.has()`

返回一个布尔值, 无论该项是否存在于 Collection 中.

```typescript
if (collection.has("two")) {
    console.log("Exists!");
} else {
    console.log("Does not exist!");
}
```

---

#### `collection.size`

在一个 `CollectionSchema` 对象中返回元素的数量.

```typescript
const collection = new CollectionSchema<number>();
collection.add(10);
collection.add(20);
collection.add(30);

console.log(collection.size);
// output: 3
```

---

#### `collection.forEach()`

`forEach()` 方法会为 `CollectionSchema` 对象中每对索引/值执行一次给定功能, 按插入顺序.

```typescript
collection.forEach((value, at) => {
    console.log("at =>", at)
    console.log("value =>", value)
});
```

## 每个客户端过滤数据

!!! Warning "此功能为实验性质"
    `@filter()`/`@filterChildren()` 为实验性质, 可能不适合快节奏游戏.

过滤意味着对一个特定客户端隐藏您的部分状态, 避免作弊, 防止一名玩家因决定检查来自网络的数据而看到未过滤的状态信息.

数据过滤器为回调, 会在 **per client** 和 **per field** 触发 (如果 `@filterChildren`, 则为每个子结构). 如果过滤器回调返回 `true`, 该字段数据将会发送给那个特定客户端, 否则, 该数据将不会发送给该客户端.

请注意, 如果过滤器功能的依赖项发生改变, 将无法自动重新运行, 但仅限于过滤字段(或其子字段)被更新时. 查看 [此问题](https://github.com/colyseus/schema/issues/102) 的替代方法.

### `@filter()` 属性修饰器

`@filter()` 属性修饰器可用于过滤掉整个 Schema 字段.

看看 `@filter()` 签名是什么样子的:

```typescript fct_label="TypeScript"
class State extends Schema {
    @filter(function(client, value, root) {
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
        // client is:
        //
        // the current client that's going to receive this data. you may use its
        // client.sessionId, or other information to decide whether this value is
        // going to be synched or not.

        // key is:
        // the key of the current value inside the structure

        // value is:
        // the current value inside the structure

        // root is:
        // the root instance of your room state. you may use it to access other
        // structures in the process of decision whether this value is going to be
        // synched or not.
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
    // client is:
    //
    // the current client that's going to receive this data. you may use its
    // client.sessionId, or other information to decide whether this value is
    // going to be synched or not.

    // key is:
    // the key of the current value inside the structure

    // value is:
    // the current value inside the structure

    // root is:
    // the root instance of your room state. you may use it to access other
    // structures in the process of decision whether this value is going to be
    // synched or not.
    return true;
})(State.prototype, "cards");
```

**示例:** 在卡片游戏中, 应该仅有卡片的持有者知道每个卡片的相关数据, 或者在特定条件下知道这些数据 (例如, 卡片被丢弃)

查看 `@filter()` 回调签名:

```typescript fct_label="TypeScript"
import { Client } from "colyseus";

class Card extends Schema {
    @type("string") owner: string; // contains the sessionId of Card owner
    @type("boolean") discarded: boolean = false;

    /**
     * DO NOT USE ARROW FUNCTION INSIDE `@filter`
     * (IT WILL FORCE A DIFFERENT `this` SCOPE)
     */
    @filter(function(
        this: Card, // the instance of the class `@filter` has been defined (instance of `Card`)
        client: Client, // the Room's `client` instance which this data is going to be filtered to
        value: Card['number'], // the value of the field to be filtered. (value of `number` field)
        root: Schema // the root state Schema instance
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
 * DO NOT USE ARROW FUNCTION INSIDE `@filter`
 * (IT WILL FORCE A DIFFERENT `this` SCOPE)
 */
schema.filter(function(client, value, root) {
    return this.discarded || this.owner === client.sessionId;
})(Card.prototype, "number");
```

## 客户端

!!! Warning "C#, C++, Haxe"
    在使用静入语言时, 需要在您的 Typescript 架构定义基础上生成客户端架构文件. [查看在客户端生成架构](#client-side-schema-generation).

### 回调

当应用来自服务器的状态更改时, 客户端将根据正在应用的更改触发本地实例上的回调.

将根据实例引用触发回调. 应确保在服务器上实际发生变化的实例上附加回调.

- [onAdd (instance, key)](#onadd-instance-key)
- [onRemove (instance, key)](#onremove-instance-key)
- [onChange (changes)](#onchange-changes-datachange) (on `Schema` instance)
- [onChange (instance, key)](#onchange-instance-key) (on collections:`MapSchema`, `ArraySchema`, etc.)
- [listen()](#listenprop-callback)

#### `onAdd (instance, key)`

只能在 (`MapSchema`, `MapSchema` 等) 项目集合中使用 `onAdd` 回调. 使用新实例调用 `onAdd` 回调, 并且使用持有者对象中的秘钥作为参数.

```javascript fct_label="JavaScript"
room.state.players.onAdd = (player, key) => {
    console.log(player, "has been added at", key);

    // add your player entity to the game world!

    // If you want to track changes on a child object inside a map, this is a common pattern:
    player.onChange = function(changes) {
        changes.forEach(change => {
            console.log(change.field);
            console.log(change.value);
            console.log(change.previousValue);
        })
    };

    // force "onChange" to be called immediatelly
    player.triggerAll();
};
```

```lua fct_label="LUA"
room.state.players['on_add'] = function (player, key)
    print("player has been added at", key);

    -- add your player entity to the game world!

    -- If you want to track changes on a child object inside a map, this is a common pattern:
    player['on_change'] = function(changes)
        for i, change in ipairs(changes) do
            print(change.field)
            print(change.value)
            print(change.previousValue)
        end
    end

    -- force "on_change" to be called immediatelly
    player.trigger_all()
end
```

```csharp fct_label="C#"
room.State.players.OnAdd += (Player player, string key) =>
{
    Debug.Log("player has been added at " + key);

    // add your player entity to the game world!

    // If you want to track changes on a child object inside a map, this is a common pattern:
    player.OnChange += (changes) =>
    {
        changes.ForEach((obj) =>
        {
            Debug.Log(obj.Field);
            Debug.Log(obj.Value);
            Debug.Log(obj.PreviousValue);
        });
    };

    // force "OnChange" to be called immediatelly
    e.Value.TriggerAll();
};
```

---

#### `onRemove (instance, key)`

只能在  (`MapSchema`) 映射和 (`ArraySchema`) 数组中使用 `onRemove` 回调. 使用已移除实例调用 `onAdd` 回调, 并且使用持有者对象中的秘钥作为参数.

```javascript fct_label="JavaScript"
room.state.players.onRemove = (player, key) => {
    console.log(player, "has been removed at", key);

    // remove your player entity from the game world!
};
```

```lua fct_label="LUA"
room.state.players['on_remove'] = function (player, key)
    print("player has been removed at " .. key);

    -- remove your player entity from the game world!
end
```

```csharp fct_label="C#"
room.State.players.OnRemove += (Player player, string key) =>
{
    Debug.Log("player has been removed at " + key);

    // remove your player entity from the game world!
};
```

---

#### `onChange (changes:DataChange\[])`

> 对于直接 `Schema` 引用和集合结构, `onChange` 的工作方式各不相同. 对于 [`onChange` 集合结构(数组,映射等)的, 请查看这里](#onchange-instance-key).

可以注册 `onChange`, 以跟踪 `Schema` 实例的属性变更. 使用已变更的属性及其以先前值触发 `onChange` 回调.


```javascript fct_label="JavaScript"
room.state.onChange = (changes) => {
    changes.forEach(change => {
        console.log(change.field);
        console.log(change.value);
        console.log(change.previousValue);
    });
};
```

```lua fct_label="LUA"
room.state['on_change'] = function (changes)
    for i, change in ipairs(changes) do
        print(change.field)
        print(change.value)
        print(change.previousValue)
    end
end
```

```csharp fct_label="C#"
room.State.OnChange += (changes) =>
{
    changes.ForEach((obj) =>
    {
        Debug.Log(obj.Field);
        Debug.Log(obj.Value);
        Debug.Log(obj.PreviousValue);
    });
};
```

不能为还没有与客户端同步的对象注册 `onChange` 回调.

---

#### `onChange (instance, key)`

> `onChange` works differently for direct `Schema` references and collection structures. For [`onChange` on `Schema` structures, check here](#onchange-changes-datachange).

当 **primitive** 集合类型 (`string`, `number`, `boolean` 等) 更新其部分值时, 将触发此回调.

```javascript fct_label="JavaScript"
room.state.players.onChange = (player, key) => {
    console.log(player, "have changes at", key);
};
```

```lua fct_label="LUA"
room.state.players['on_change'] = function (player, key)
    print("player have changes at " .. key);
end
```

```csharp fct_label="C#"
room.State.players.OnChange += (Player player, string key) =>
{
    Debug.Log("player have changes at " + key);
};
```

如果想要检测 **non-primitive** 集合类型(保留 `Schema` 实例), 请使用 [`onAdd`](#onadd-instance-key) 并且为它们注册 [`onChange`](#onchange-changes-datachange).

!!! Warning "`onChange`, `onAdd` 和 `onRemove` 是 **互斥的**"
    `onChange` 回调在 [`onAdd`](#onadd-instance-key) 或 [`onRemove`](#onremove-instance-key) 期间不会触发.

    Consider registering `onAdd` and `onRemove` if you need to detect changes during these steps too.

---

#### `.listen(prop, callback)`

侦听单个属性变更.

> `.listen()` 目前仅可用于 JavaScript/TypeScript.

**Parameters:**

- `property`: 想要侦听其变化的属性名称.
- `callback`: 当 `property` 变更时将会触发的回调.


```typescript
state.listen("currentTurn", (currentValue, previousValue) => {
    console.log(`currentTurn is now ${currentValue}`);
    console.log(`previous value was: ${previousValue}`);
});
```

`.listen()` 返回一个函数, 用于取消注册侦听器


```typescript
const removeListener = state.listen("currentTurn", (currentValue, previousValue) => {
    // ...
});

// later on, if you don't need the listener anymore, you can call `removeListener()` to stop listening for `"currentTurn"` changes.
removeListener();
```

**What's the difference between `listen` and `onChange`?**

`.listen()` 方法是单个属性 `onChange` 的简化形式. 下面是

```typescript
state.onChange = function(changes) {
    changes.forEach((change) => {
        if (change.field === "currentTurn") {
            console.log(`currentTurn is now ${change.value}`);
            console.log(`previous value was: ${change.previousValue}`);
        }
    })
}
```

---

## 客户端架构生成

`schema-codegen` 是一个工具, 它转换服务器端架构定义文件, 以便在客户使用.

要在客户端解码状态, 客户端的本地架构定义必须兼容服务器端的架构定义.

!!! Warning "在使用 [JavaScript SDK](/getting-started/javascript-client/) 时不需要"
    只有在客户端使用静态类型语言, 例如  C#, Haxe 等, 才需要使用 `schema-codegen`.

**用法**

要在终端上查看用法, 请 `cd` 进入服务器目录, 运行以下命令:

```
npx schema-codegen --help
```

**Output:**

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

### 示例Unity / C#

下面是一个利用 [demo Unity project](https://github.com/colyseus/colyseus-unity3d/blob/aa9a722a50b2958ce01785969cd8ecb8aee24fd0/Server/package.json#L12) 生成 C# 架构文件的真实示例.

```
npx schema-codegen src/rooms/schema/* --csharp --output ../Assets/Scripts/States/"
generated: Player.cs
generated: State.cs
```

**Using `npm` scripts:**

简而言之, 建议在 `package.json` 中的 `npm`  中配置 `schema-codegen` 参数:

```json
"scripts": {
    "schema-codegen": "schema-codegen src/rooms/schema/* --csharp --output ../Assets/Scripts/States/"
}
```

这样, 就可以运行 `npm run schema-codegen`, 而不必运行完整的命令

```
npm run schema-codegen
generated: Player.cs
generated: State.cs
```

### 版本及向后/向前兼容

通过在现有结构的末尾声明新字段, 可以实现向后/向前兼容, 不应删除先前的声明, 而是应该根据需要将其标记为 `@deprecated()` 下面是一个版本示例.

```typescript fct_label="Live version 1"
import { Schema, type, deprecated } from "@colyseus/schema";

class MyState extends Schema {
    @type("string") myField: string;
}
```

```typescript fct_label="Live version 2"
import { Schema, type, deprecated } from "@colyseus/schema";

class MyState extends Schema {
    // Flag field as deprecated.
    @deprecated() @type("string") myField: string;

    // To allow your server to play nicely with multiple client-side versions.
    @type("string") newField: string;
}
```

```typescript fct_label="Live version 3"
import { Schema, type, deprecated } from "@colyseus/schema";

class MyState extends Schema {
    // Flag field as deprecated.
    @deprecated() @type("string") myField: string;

    // Flag field as deprecated again.
    @deprecated() @type("string") newField: string;

    // New fields always at the end of the structure
    @type("string") anotherNewField: string;
}
```

这对于本地编译目标语言特别有用, 包括 C#, C++, Haxe 等, 在这些语言中, 客户端可能没有最新的架构定义版本.

---

## 限制和最佳实践

- 每个 `Schema` 结构最多可以保存 `64` 个字段.如果需要更多字段,可以使用嵌套式 `Schema` 结构.
- `NaN` 或 `null` 数字被编码为 `0`
- `null` 字符串被编码为 `""`
- `Infinity` 数字被编码为 `Number.MAX_SAFE_INTEGER`
- 不支持多维数组. [查看如何将一维数组作为多维数组使用](https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid/212813#212813)
- `@colyseus/schema` 编码顺序基于字段定义顺义.
    - 编码器(服务器)和解码器(客户端)必须具有相同的架构定义.
    - 字段的顺序必须相同.

### 集合

集合类型 (`ArraySchema`, `MapSchema` 等) 必须包含相同类型的项目, 或共享相同的基础类型.

**支持以下示例:**

```typescript
class Item extends Schema {/* base Item fields */}
class Weapon extends Item {/* specialized Weapon fields */}
class Shield extends Item {/* specialized Shield fields */}

class Inventory extends Schema {
    @type({ map: Item }) items = new MapSchema<Item>();
}

const inventory = new Inventory();
inventory.set("left", new Weapon());
inventory.set("right", new Shield());
```

### 原始类型

| Type | Description | Limitation |
|------|-------------|------------|
| `"string"` | utf8 strings | maximum byte size of `4294967295` |
| `"number"` | also known as "varint". Auto-detects the number type to use. (may use one extra byte when encoding) | `0` to `18446744073709551615` |
| `"boolean"` | `true` or `false` | `0` or `1` |
| `"int8"` | signed 8-bit integer | `-128` to `127` |
| `"uint8"` | unsigned 8-bit integer | `0` to `255` |
| `"int16"` | signed 16-bit integer | `-32768` to `32767` |
| `"uint16"` | unsigned 16-bit integer | `0` to `65535` |
| `"int32"` | signed 32-bit integer | `-2147483648` to `2147483647` |
| `"uint32"` | unsigned 32-bit integer | `0` to `4294967295` |
| `"int64"` | signed 64-bit integer | `-9223372036854775808` to `9223372036854775807` |
| `"uint64"` | unsigned 64-bit integer | `0` to `18446744073709551615` |
| `"float32"` | single-precision floating-point number | `-3.40282347e+38` to `3.40282347e+38`|
| `"float64"` | double-precision floating-point number | `-1.7976931348623157e+308` to `1.7976931348623157e+308` |
