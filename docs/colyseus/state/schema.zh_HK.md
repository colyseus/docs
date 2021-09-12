# [狀態同步](/state/overview) &raquo; 架構

!!! Tip "還沒使用 TypeScript?"
    強烈建議您使用 TypeScript 以便更好地定義架構結構並提高整體開發體驗. TypeScript 支持的 "實驗性修飾器" 會在本手冊內大量使用.

## 如何定義可同步結構

- `Schema` 結構由伺服器定義,用於房間狀態.
- 只有以 `@type()` 修飾的字段才被考慮用於同步.
- _(可同步架構結構應當僅用於與您的狀態相關的數據.)_

### 定義 `Schema` 結構

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

!!! Tip "_"這個 `@type()` 關鍵字是什麽? 我之前從未見過!"_"
    您看見的在本頁大量使用的 `@type()` 是一個即將推出的 JavaScript 功能, 還沒有被 TC39 正式認可. `type` 其實只是一個從 `@colyseus/schema` 模組匯入的功能. 在屬性層級調用帶有 `@` 前綴的 `類型`, 意味著我們將其作為一個 _屬性修飾器_ 進行調用. [在這裏查看修飾器方案](https://github.com/tc39/proposal-decorators).

### 在您的 `Room` 內使用狀態

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


## 處理架構

- 只有伺服器端負責處理變異架構結構
- 客戶端必須擁有通過 `[schema-codegen`` 生成的相同的 Schema` 定義. _(如果您在使用 [JavaScript SDK](/getting-started/javascript-client/) 則為可選)_
- 為了從伺服器獲得更新, 您需要 [將架構的回呼附加在客戶端內](#callbacks).
- 客戶端永遠不該在架構上執行變異 - 因為在收到下一個來自伺服器的更改時, 它們就會被立刻替換.

### 原始類型

原始類型為數字, 字符串和布爾值.

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


### 復雜類型

復雜類型由其他架構實例中的 `Schema` 實例組成. 它們也可以包含 [專案集合](#collections-of-items) (數組, 地圖等).

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

## 專案集合

### ArraySchema

`ArraySchema` 是一個可同步版本的內置 JavaScript [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 類型.

**示例:自定義 `Schema` 類型** 的數組

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

**示例:原始類型** 的數組

您無法將類型混合進數組中.

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

在一個數組後面添加一個或多個元素, 並返回該數組的新長度.

```typescript
const animals = new ArraySchema<string>();
animals.push("pigs", "goats");
animals.push("sheeps");
animals.push("cows");
// output: 4
```

---

#### `array.pop()`

移除一個數組的最後一個元素並返回該元素. 該方法可以更改數組的長度.

```typescript
animals.pop();
// output: "cows"

animals.length
// output: 3
```

---

#### `array.shift()`

移除一個數組的第一個元素並返回被移除的元素. 該方法可以更改數組的長度.

```typescript
animals.shift();
// output: "pigs"

animals.length
// output: 2
```

---

#### `array.unshift()`

在一個數組的開頭添加一個或更多元素並返回該數組的新長度.

```typescript
animals.unshift("pigeon");
// output: 3
```

---

#### `array.indexOf()`

返回數組中可以找到的一個給定元素的第一個索引, 如果不存在則為 -1

```typescript
const itemIndex = animals.indexOf("sheeps");
```

---

#### `array.splice()`

通過移除或替換現有元素並/或 [在適當的位置](https://en.wikipedia.org/wiki/In-place_algorithm) 添加新元素的方式來更改一個數組的內容.

```typescript
// find the index of the item you'd like to remove
const itemIndex = animals.findIndex((animal) => animal === "sheeps");

// remove it!
animals.splice(itemIndex, 1);
```

---

#### `array.forEach()`

叠代數組的每個元素.

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
    查看 [MDN 文檔](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/).

### MapSchema

`MapSchema` 是一個可同步版本的內置 JavaScript [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 類型.

推薦使用 Maps 來通過 id 追蹤您的遊戲實體,比如玩家, 敵人等.

!!! Warning "當前僅支持字符串鍵"
    目前, `MapSchema` 僅允許您自定義值的類型. 秘鑰類型始終為 `字符串`.

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

通過秘鑰來獲取地圖項:

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

通過秘鑰來設置一個地圖項:

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

通過秘鑰來移除一個地圖項:

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

在一個 `MapSchema` 對象中返回元素的數量.

```typescript
const map = new MapSchema<number>();
map.set("one", 1);
map.set("two", 2);

console.log(map.size);
// output: 2
```

---

#### `map.forEach()`

叠代地圖的每對秘鑰/值, 按照插入順序.

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
    查看 [MDN 文檔](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/).


### SetSchema

!!! Warning "`SetSchema` 僅在 JavaScript 中實現"
    目前 `SetSchema` 只能與 JavaScript 一同使用. 尚不支持 Haxe, C#, LUA 和 C++ 客戶端.

`SetSchema` 是一個可同步版本的內置 JavaScript [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) 類型.

`SetSchema` 的用法和 [`CollectionSchema`] 十分類似, 最大區別在於 Sets 擁有獨特的值. Sets 沒有直接訪問值的方法. (如[collection.at()](#collectionat))

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

將一個項附加至 `SetSchema` 對象.
item to the `SetSchema` object.

```typescript
const set = new CollectionSchema<number>();
set.add(1);
set.add(2);
set.add(3);
```

---

#### `set.at()`

在特定 `index` 中獲取一個項.

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

按項的值刪除項.

```typescript
set.delete("three");
```

---

#### `set.has()`

返回一個布爾值, 無論該項是否存在於 Collection 中.

```typescript
if (set.has("two")) {
    console.log("Exists!");
} else {
    console.log("Does not exist!");
}
```

---

#### `set.size`

在一個 `SetSchema` 對象中返回元素的數量.

```typescript
const set = new SetSchema<number>();
set.add(10);
set.add(20);
set.add(30);

console.log(set.size);
// output: 3
```

!!! Note "Set 有更多方法可用"
    查看 [MDN 文檔](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/).


### CollectionSchema

!!! Note "`CollectionSchema` 僅在 JavaScript 中實現"
    目前 `CollectionSchema` 只能與 JavaScript 一同使用. 尚不支持 Haxe, C#, LUA 和 C++ 客戶端.

`CollectionSchema` 的運作方式與 `ArraySchema` 類似, 需要註意的是, 您無法控製它的索引.

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

將一個項附加至 `CollectionSchema` 對象.

```typescript
const collection = new CollectionSchema<number>();
collection.add(1);
collection.add(2);
collection.add(3);
```

---

#### `collection.at()`

在特定 `索引` 中獲取一個項.

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

按項的值刪除項.

```typescript
collection.delete("three");
```

---

#### `collection.has()`

返回一個布爾值, 無論該項是否存在於 Collection 中.

```typescript
if (collection.has("two")) {
    console.log("Exists!");
} else {
    console.log("Does not exist!");
}
```

---

#### `collection.size`

在一個 `CollectionSchema` 對象中返回元素的數量.

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

`forEach()` 方法會為 `CollectionSchema` 對象中每對索引/值執行一次給定功能, 按插入順序.

```typescript
collection.forEach((value, at) => {
    console.log("at =>", at)
    console.log("value =>", value)
});
```

## 每個客戶端過濾數據

!!! Warning "此功能為實驗性質"
    `@filter()`/`@filterChildren()` 為實驗性質, 可能不適合快節奏遊戲.

過濾意味著對一個特定客戶端隱藏您的部分狀態, 避免作弊, 防止一名玩家因決定檢查來自網路的數據而看到未過濾的狀態資訊.

數據過濾器為回呼, 會在 **per client** 和 **per field** 觸發 (如果 `@filterChildren`, 則為每個子結構). 如果過濾器回呼返回 `true`, 該字段數據將會發送給那個特定客戶端, 否則, 該數據將不會發送給該客戶端.

請註意, 如果過濾器功能的依賴項發生改變, 將無法自動重新執行, 但僅限於過濾字段(或其子字段)被更新時. 查看 [此問題](https://github.com/colyseus/schema/issues/102) 的替代方法.

### `@filter()` 屬性修飾器

`@filter()` 屬性修飾器可用於過濾掉整個 Schema 字段.

看看 `@filter()` 簽名是什麽樣子的:

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

### `@filterChildren()` 屬性修飾器

`@filterChildren()` 屬性修飾器可用於過濾掉數組, 地圖, 集合等內的專案. 它的簽名與 `@filter()` 基本相同, 但是在 `value` 之前添加了 `key` 參數 - 表示 [ArraySchema](#arrayschema), [MapSchema](#mapschema), [CollectionSchema](#collectionschema) 等中的每個專案.

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

**示例:** 在卡片遊戲中, 應該僅有卡片的持有者知道每個卡片的相關數據, 或者在特定條件下知道這些數據 (例如, 卡片被丟棄)

查看 `@filter()` 回呼簽名:

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

## 客戶端

!!! Warning "C#, C++, Haxe"
    在使用靜入語言時, 需要在您的 Typescript 架構定義基礎上生成客戶端架構文件. [查看在客戶端生成架構](#client-side-schema-generation).

### 回呼

當應用來自伺服器的狀態更改時, 客戶端將根據正在應用的更改觸發本地實例上的回呼.

將根據實例引用觸發回呼. 應確保在伺服器上實際發生變化的實例上附加回呼.

- [onAdd (instance, key)](#onadd-instance-key)
- [onRemove (instance, key)](#onremove-instance-key)
- [onChange (changes)](#onchange-changes-datachange) (on `Schema` instance)
- [onChange (instance, key)](#onchange-instance-key) (on collections:`MapSchema`, `ArraySchema`, etc.)
- [listen()](#listenprop-callback)

#### `onAdd (instance, key)`

只能在 (`MapSchema`, `MapSchema` 等) 專案集合中使用 `onAdd` 回呼. 使用新實例調用 `onAdd` 回呼, 並且使用持有者對象中的秘鑰作為參數.

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

只能在  (`MapSchema`) 映射和 (`ArraySchema`) 數組中使用 `onRemove` 回呼. 使用已移除實例調用 `onAdd` 回呼, 並且使用持有者對象中的秘鑰作為參數.

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

> 對於直接 `Schema` 引用和集合結構, `onChange` 的工作方式各不相同. 對於 [`onChange` 集合結構(數組,映射等)的, 請查看這裏](#onchange-instance-key).

可以註冊 `onChange`, 以跟蹤 `Schema` 實例的屬性變更. 使用已變更的屬性及其以先前值觸發 `onChange` 回呼.


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

不能為還沒有與客戶端同步的對象註冊 `onChange` 回呼.

---

#### `onChange (instance, key)`

> `onChange` works differently for direct `Schema` references and collection structures. For [`onChange` on `Schema` structures, check here](#onchange-changes-datachange).

當 **primitive** 集合類型 (`string`, `number`, `boolean` 等) 更新其部分值時, 將觸發此回呼.

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

如果想要檢測 **non-primitive** 集合類型(保留 `Schema` 實例), 請使用 [`onAdd`](#onadd-instance-key) 並且為它們註冊 [`onChange`](#onchange-changes-datachange).

!!! Warning "`onChange`, `onAdd` 和 `onRemove` 是 **互斥的**"
    `onChange` 回呼在 [`onAdd`](#onadd-instance-key) 或 [`onRemove`](#onremove-instance-key) 期間不會觸發.

    Consider registering `onAdd` and `onRemove` if you need to detect changes during these steps too.

---

#### `.listen(prop, callback)`

偵聽單個屬性變更.

> `.listen()` 目前僅可用於 JavaScript/TypeScript.

**Parameters:**

- `property`: 想要偵聽其變化的屬性名稱.
- `callback`: 當 `property` 變更時將會觸發的回呼.


```typescript
state.listen("currentTurn", (currentValue, previousValue) => {
    console.log(`currentTurn is now ${currentValue}`);
    console.log(`previous value was: ${previousValue}`);
});
```

`.listen()` 返回一個函數, 用於取消註冊偵聽器


```typescript
const removeListener = state.listen("currentTurn", (currentValue, previousValue) => {
    // ...
});

// later on, if you don't need the listener anymore, you can call `removeListener()` to stop listening for `"currentTurn"` changes.
removeListener();
```

**What's the difference between `listen` and `onChange`?**

`.listen()` 方法是單個屬性 `onChange` 的簡化形式. 下面是

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

## 客戶端架構生成

`schema-codegen` 是一個工具, 它轉換伺服器端架構定義文件, 以便在客戶使用.

要在客戶端解碼狀態, 客戶端的本地架構定義必須兼容伺服器端的架構定義.

!!! Warning "在使用 [JavaScript SDK](/getting-started/javascript-client/) 時不需要"
    只有在客戶端使用靜態類型語言, 例如  C#, Haxe 等,才需要使用 `schema-codegen`.

**用法**

要在終端上查看用法, 請 `cd` 進入伺服器目錄, 執行以下指令:

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

下面是一個利用 [demo Unity project](https://github.com/colyseus/colyseus-unity3d/blob/aa9a722a50b2958ce01785969cd8ecb8aee24fd0/Server/package.json#L12) 生成 C# 架構文件的真實示例.

```
npx schema-codegen src/rooms/schema/* --csharp --output ../Assets/Scripts/States/"
generated: Player.cs
generated: State.cs
```

**Using `npm` scripts:**

簡而言之, 建議在 `package.json` 中的 `npm`  中配置 `schema-codegen` 參數:

```json
"scripts": {
    "schema-codegen": "schema-codegen src/rooms/schema/* --csharp --output ../Assets/Scripts/States/"
}
```

這樣, 就可以執行 `npm run schema-codegen`, 而不必執行完整的指令

```
npm run schema-codegen
generated: Player.cs
generated: State.cs
```

### 版本及向後/向前兼容

通過在現有結構的末尾聲明新字段, 可以實現向後/向前兼容, 不應刪除先前的聲明, 而是應該根據需要將其標記為 `@deprecated()` 下面是一個版本示例.

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

這對於本地編譯目標語言特別有用, 包括 C#, C++, Haxe 等, 在這些語言中, 客戶端可能沒有最新的架構定義版本.

---

## 限製和最佳實踐

- 每個 `Schema` 結構最多可以保存 `64` 個字段. 如果需要更多字段, 可以使用嵌套式 `Schema` 結構.
- `NaN` 或 `null` 數字被編碼為 `0`
- `null` 字符串被編碼為 `""`
- `Infinity` 數字被編碼為 `Number.MAX_SAFE_INTEGER`
- 不支持多維數組. [查看如何將一維數組作為多維數組使用](https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid/212813#212813)
- `@colyseus/schema` 編碼順序基於字段定義順義.
    - 編碼器(伺服器)和解碼器(客戶端)必須具有相同的架構定義.
    - 字段的順序必須相同.

### 集合

集合類型 (`ArraySchema`, `MapSchema` 等) 必須包含相同類型的專案, 或共享相同的基礎類型.

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

### 原始類型

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
