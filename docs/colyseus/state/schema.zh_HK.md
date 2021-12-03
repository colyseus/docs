# [狀態同步](/state/overview) &raquo; 架構

!!! Tip "還沒使用 TypeScript?"
強烈建議您使用 TypeScript 以便更好地定義 Schema 結構並提高整體開發體驗. TypeScript 支持的 "實驗性修飾器" 會在本手冊內大量使用.

## 如何定義可同步結構

- `Schema` 結構由服務器定義, 用於房間狀態同步.
- 只有以 `@type()` 修飾的字段才會被用於同步.
- _(可同步 Schema 結構僅應用於狀態相關的數據.)_

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
您看見的在本頁大量使用的 `@type()` 是一個即將推出的 JavaScript 功能, 還沒有被 TC39 正式認可. `type` 其實只是一個從 `@colyseus/schema` 模塊導入的函數. 在屬性層級調用帶有 `@` 前綴的 `type`, 意味著我們將其作為一個 _屬性修飾器_ 進行調用. [在這裏查看修飾器方案](https://github.com/tc39/proposal-decorators).

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


## 使用 Schema

- 只有服務器端有權修改 Schema 數據
- 客戶端要包含以 [`schema-codegen`](#client-side-schema-generation) 生成的與服務器端同樣的 `Schema` 定義. _(如果使用 [JavaScript SDK](/getting-started/javascript-client/) 則此條為可選項)_
- 為了從服務器獲得更新, 需要 [在客戶端把回調附加在 schema 實例上](#callbacks).
- 客戶端永遠不應主動修改 schema - 因為在收到來自服務器的下一個心跳就會把它更新覆蓋掉.

### 基本類型

基本類型為數字, 字符串和布爾型.

| 類型 | 描述 | 範圍 |
|------|-------------|------------|
| `"string"` | utf8 字符串 | 最大 `4294967295` 字節|
| `"number"` | 又稱為 "正整數". 自動定義數字類型. (編碼時可能會多用1個字節) | 取值範圍 `0` 到 `18446744073709551615` |
| `"boolean"` | `true` 或 `false` | 取值為 `0` 或 `1` |

**特定數值類型:**

| 類型 | 描述 | 範圍 |
|------|-------------|------------|
| `"int8"` | 有符號 8-bit 整數 | `-128` 到 `127` |
| `"uint8"` | 無符號 8-bit 整數 | `0` 到 `255` |
| `"int16"` | 有符號 16-bit 整數 | `-32768` 到 `32767` |
| `"uint16"` | 無符號 16-bit 整數 | `0` 到 `65535` |
| `"int32"` | 有符號 32-bit 整數 | `-2147483648` 到 `2147483647` |
| `"uint32"` | 無符號 32-bit 整數 | `0` 到 `4294967295` |
| `"int64"` | 有符號 64-bit 整數 | `-9223372036854775808` 到 `9223372036854775807` |
| `"uint64"` | 無符號 64-bit 整數 | `0` 到 `18446744073709551615` |
| `"float32"` | 單精度浮點數 | `-3.40282347e+38` 到 `3.40282347e+38`|
| `"float64"` | 雙精度浮點數 | `-1.7976931348623157e+308` 到 `1.7976931348623157e+308` |


### 復雜類型

復雜類型由 `Schema` 嵌套而成. 它們也可以包含 [集合類型](#collections-of-items) (array, map 等).

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

## 集合類型

### ArraySchema

`ArraySchema` 是一個可同步版本的內置 JavaScript [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 類型.

**示例: 自定義 `Schema` 類型** 數組

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

**示例: 基本類型** 數組

數組元素必須是同一類型數據.

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

在一個數組後面添加一個或多個元素, 並返回該數組更新後的長度.

```typescript
const animals = new ArraySchema<string>();
animals.push("pigs", "goats");
animals.push("sheeps");
animals.push("cows");
// 輸出: 4
```

---

#### `array.pop()`

移除一個數組的最後一個元素並返回該元素. 該方法會改變數組的長度.

```typescript
animals.pop();
// 輸出: "cows"

animals.length
// 輸出: 3
```

---

#### `array.shift()`

移除一個數組的第一個元素並返回該元素. 該方法會改變數組的長度.

```typescript
animals.shift();
// 輸出: "pigs"

animals.length
// 輸出: 2
```

---

#### `array.unshift()`

在一個數組的開頭添加一個或多個元素, 並返回該數組更新後的長度.

```typescript
animals.unshift("pigeon");
// 輸出: 3
```

---

#### `array.indexOf()`

返回數組中找到給定元素的第一個索引, 如果不存在則返回 -1

```typescript
const itemIndex = animals.indexOf("sheeps");
```

---

#### `array.splice()`

移除替換現有元素或 [在指定位置](https://en.wikipedia.org/wiki/In-place_algorithm) 添加新元素來更改一個數組的內容.

```typescript
// 找到需要移除元素的索引
const itemIndex = animals.findIndex((animal) => animal === "sheeps");

// 移除元素!
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
// 輸出: "a"
// 輸出: "b"
// 輸出: "c"
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

!!! Note "Array 還有更多函數可用"
詳見 [MDN 文檔](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/).

### MapSchema

`MapSchema` 是一個基於 JavaScript 內置 [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 的可同步版本.

推薦使用 Maps 裏的 id 來追蹤遊戲實體, 比如玩家, 敵人等.

!!! Warning "當前僅支持字符串類型的 id"
目前, `MapSchema` 允許您自定義值的類型, 但是鍵的類型必須為為 `string`.

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

通過鍵得到 map 的值:

```typescript
const map = new MapSchema<string>();
const item = map.get("key");
```

---

#### `map.set()`

通過鍵來設置 map 的值:

```typescript
const map = new MapSchema<string>();
map.set("key", "value");
```

---

#### `map.delete()`

通過鍵移除 map 的值:

```typescript
map.delete("key");
```

---

#### `map.size`

返回 `MapSchema` 對象中元素的數量.

```typescript
const map = new MapSchema<number>();
map.set("one", 1);
map.set("two", 2);

console.log(map.size);
// 輸出: 2
```

---

#### `map.forEach()`

叠代 map 中的鍵值對, 以元素插入順序.

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

!!! Note "Map 還有更多函數可用"
詳見 [MDN 文檔](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/).


### SetSchema

!!! Warning "`SetSchema` 僅支持 JavaScript"
目前 `SetSchema` 只能在 JavaScript 中使用. 尚不支持 Haxe, C#, LUA 和 C++ 客戶端.

`SetSchema` 是一個基於 JavaScript 內置 [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) 的可同步版本.

`SetSchema` 的用法和 [`CollectionSchema`] 十分類似, 最大區別在於 Set 的值具有唯一性. JS 的 Set 沒有直接獲取值的方法. (比如像 [collection.at()](#collectionat))

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

為 `SetSchema` 添加元素.

```typescript
const set = new SetSchema<number>();
set.add(1);
set.add(2);
set.add(3);
```

---

#### `set.at()`

獲取 `index` 處的值.

```typescript
const set = new SetSchema<string>();
set.add("one");
set.add("two");
set.add("three");

set.at(1);
// 輸出: "two"
```

---

#### `set.delete()`

按值刪除元素.

```typescript
set.delete("three");
```

---

#### `set.has()`

檢查集合中是否有該值.

```typescript
if (set.has("two")) {
    console.log("Exists!");
} else {
    console.log("Does not exist!");
}
```

---

#### `set.size`

返回 `SetSchema` 裏元素的長度.

```typescript
const set = new SetSchema<number>();
set.add(10);
set.add(20);
set.add(30);

console.log(set.size);
// 輸出: 3
```

!!! Note "Set 還有更多函數可用"
詳見 [MDN 文檔](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/).


### CollectionSchema

!!! Note "`CollectionSchema` 僅支持 JavaScript"
目前 `CollectionSchema` 只能在 JavaScript 中使用. 尚不支持 Haxe, C#, LUA 和 C++ 客戶端.

`CollectionSchema` 的用法與 `ArraySchema` 類似, 需要註意的是, 它不具備某些數組可用的函數.

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

為 `CollectionSchema` 添加元素.

```typescript
const collection = new CollectionSchema<number>();
collection.add(1);
collection.add(2);
collection.add(3);
```

---

#### `collection.at()`

獲取 `index` 處的值.

```typescript
const collection = new CollectionSchema<string>();
collection.add("one");
collection.add("two");
collection.add("three");

collection.at(1);
// 輸出: "two"
```

---

#### `collection.delete()`

按值刪除元素.

```typescript
collection.delete("three");
```

---

#### `collection.has()`

檢查集合中是否有該值.

```typescript
if (collection.has("two")) {
    console.log("Exists!");
} else {
    console.log("Does not exist!");
}
```

---

#### `collection.size`

返回 `CollectionSchema` 裏元素的長度.

```typescript
const collection = new CollectionSchema<number>();
collection.add(10);
collection.add(20);
collection.add(30);

console.log(collection.size);
// 輸出: 3
```

---

#### `collection.forEach()`

叠代 `CollectionSchema` 中的鍵值對, 以元素插入順序.

```typescript
collection.forEach((value, at) => {
    console.log("at =>", at)
    console.log("value =>", value)
});
```

## 每個客戶端過濾數據

!!! Warning "此功能為實驗性質"
`@filter()` / `@filterChildren()` 為實驗性質, 可能不適合快節奏遊戲.

過濾用來為指定客戶端隱藏部分狀態數據, 防止作弊, 防止玩家獲取全部數據.

數據過濾器回調, 可以針對 **每個客戶端** 的 **每個字段** 進行觸發 (如果使用了 `@filterChildren`, 還可在每個子結構觸發). 如果過濾器回調返回 `true`, 則該字段數據將會發送給那個指定的客戶端, 否則不發送.

請註意, 只有被過濾字段 (或其子字段) 數據更新時, 過濾器回調才能被觸發. 要想手動觸發請參考 [此問題](https://github.com/colyseus/schema/issues/102) 裏描述的方法.

### `@filter()` 屬性修飾器

`@filter()` 屬性修飾器可作用於整個 Schema 字段.

下面展示了 `@filter()` 的函數簽名:

```typescript fct_label="TypeScript"
class State extends Schema {
    @filter(function(client, value, root) {
        // client 參數是:
        //
        // 當前將要接受數據的客戶端. 可以通過其
        // client.sessionId, 及其他信息判定是否
        // 要把數據同步給這個客戶端.

        // value 參數是:
        // 被 @filter() 標記過濾的字段值

        // root 參數是:
        // 房間 Schema 實例引用. 方便在是否過濾的
        // 決策過程中
        // 訪問房間狀態.
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

`@filterChildren()` 屬性修飾器可用於過濾掉數組, 地圖, 集合等內的項目. 它的簽名與 `@filter()` 基本相同, 但是在 `value` 之前添加了 `key` 參數 - 表示 [ArraySchema](#arrayschema), [MapSchema](#mapschema), [CollectionSchema](#collectionschema) 等中的每個項目.

```typescript fct_label="TypeScript"
class State extends Schema {
    @filterChildren(function(client, key, value, root) {
        // client 參數是:
        //
        // 當前將要接受數據的客戶端. 可以通過其
        // client.sessionId, 及其他信息判定是否
        // 要把數據同步給這個客戶端.

        // value 參數是:
        // 被 @filter() 標記過濾的字段值

        // root 參數是:
        // 房間 Schema 實例引用. 方便在是否過濾的
        // 決策過程中
        // 訪問房間狀態.
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
    // client 參數是:
    //
    // 當前將要接受數據的客戶端. 可以通過其
    // client.sessionId, 及其他信息判定是否
    // 要把數據同步給這個客戶端.

    // key 參數是:
    // 子字段名

    // value 參數是:
    // 被 @filter() 標記過濾的字段值

    // root 參數是:
    // 房間 Schema 實例引用. 方便在是否過濾的
    // 決策過程中
    // 訪問房間狀態.
    return true;
})(State.prototype, "cards");
```

**示例:** 在卡牌遊戲中, 應該只有卡牌的持有者知道每個卡片的數據, 或者在特定條件下才能知道這些數據 (例如攤牌)

參考 `@filter()` 回調簽名:

```typescript fct_label="TypeScript"
import { Client } from "colyseus";

class Card extends Schema {
    @type("string") owner: string; // 用來保存卡牌持有者的 sessionId
    @type("boolean") discarded: boolean = false;

    /**
     * 不要在 `@filter` 函數裏使用箭頭函數
     * (會造成 `this` 指針丟失)
     */
    @filter(function(
        this: Card, // 定義 `@filter` 的類 (這裏 this 就是 `Card` 的實例)
        client: Client, // 要被過濾的客戶端 `client` 實例
        value: Card['number'], // 要被過濾的字段值. (這裏是 `number` 字段的值)
        root: Schema // 房間狀態 Schema 實例
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
 * 不要在 `@filter` 函數裏使用箭頭函數
 * (會造成 `this` 指針丟失)
 */
schema.filter(function(client, value, root) {
    return this.discarded || this.owner === client.sessionId;
})(Card.prototype, "number");
```

## 客戶端

!!! Warning "C#, C++, Haxe"
在使用強類型語言時, 需要基於 Typescript schema 定義手動生成客戶端 schema 文件. [生成客戶端 schema 的方法](#client-side-schema-generation).

### 回調

服務器狀態變更應用到客戶端時, 會根據變更的類型自動觸發本地實例上的回調.

回調通過房間狀態實例觸發. 使用前要確保該實例上已實現回調函數.

- [onAdd (instance, key)](#onadd-instance-key)
- [onRemove (instance, key)](#onremove-instance-key)
- [onChange (changes)](#onchange-changes-datachange) (觸發於 `Schema` 實例)
- [onChange (instance, key)](#onchange-instance-key) (觸發於集合實例: `MapSchema`, `ArraySchema` 等等.)
- [listen()](#listenprop-callback)

#### `onAdd (instance, key)`

只有集合 (`MapSchema`, `ArraySchema` 等) 可以使用 `onAdd` 回調. 集合更新後觸發 `onAdd` 回調, 外加已更新集合的鍵作為參數.

```javascript fct_label="JavaScript"
room.state.players.onAdd((player, key) => {
    console.log(player, "has been added at", key);

    // 在遊戲中加入player!

    // 要想跟蹤地圖上物體的移動, 通常要這麽做:
    player.onChange = function(changes) {
        changes.forEach(change => {
            console.log(change.field);
            console.log(change.value);
            console.log(change.previousValue);
        })
    };
});
```

```lua fct_label="LUA"
room.state.players:on_add(function (player, key)
    print("player has been added at", key);

    -- 在遊戲中加入player!

    -- 要想跟蹤地圖上物體的移動, 通常要這麽做:
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

    // 在遊戲中加入player!

    // 要想跟蹤地圖上物體的移動, 通常要這麽做:
    player.OnChange((changes) =>
    {
        changes.ForEach((obj) =>
        {
            Debug.Log(obj.Field);
            Debug.Log(obj.Value);
            Debug.Log(obj.PreviousValue);
        });
    });
});
```

---

#### `onRemove (instance, key)`

只有圖 (`MapSchema`) 和數組 (`ArraySchema`) 可以使用 `onRemove` 回調. 集合更新後觸發 `onRemove` 回調, 外加已更新集合的鍵作為參數.

```javascript fct_label="JavaScript"
room.state.players.onRemove((player, key) => {
    console.log(player, "has been removed at", key);

    // 從遊戲中移除player!
});
```

```lua fct_label="LUA"
room.state.players:on_remove(function (player, key)
    print("player has been removed at " .. key);

    -- 從遊戲中移除player!
end)
```

```csharp fct_label="C#"
room.State.players.OnRemove((string key, Player player) =>
{
    Debug.Log("player has been removed at " + key);

    // 從遊戲中移除player!
});
```

---

#### `onChange (changes:DataChange[])`

> `Schema` 上的 `onChange` 和集合結構上的不一樣. 對於 [集合結構(數組, 映射等)的 `onChange` 請參考這裏](#onchange-instance-key).

可以註冊 `onChange` 以跟蹤 `Schema` 實例屬性的變更. `onChange` 的參數數組包含已變更的屬性以及變更前的值.


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
        print(change.previous_value)
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

沒有同步過的客戶端不能註冊 `onChange` 回調.

---

#### `onChange (instance, key)`

> `Schema` 上的 `onChange` 和集合結構上的不一樣. 對於 [`Schema` 的 `onChange` 請參考這裏](#onchange-changes-datachange).

當集合裏的 **基本** 類型 (`string`, `number`, `boolean` 等) 值更新時, 將觸發此回調.

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

對於 **非基本** 類型 (各種 `Schema` 集合), 請先註冊 [`onAdd`](#onadd-instance-key) 再註冊 [`onChange`](#onchange-changes-datachange).

!!! Warning "`onChange`, `onAdd` 和 `onRemove` 是 **互斥的**"
`onChange` 回調在 [`onAdd`](#onadd-instance-key) 或 [`onRemove`](#onremove-instance-key) 期間不會被觸發.

    如果想要跟蹤的更新包括 `onAdd` 和 `onRemove`, 請註冊這兩個回調.

---

#### `.listen(prop, callback)`

偵聽單個屬性更新.

> `.listen()` 目前僅可用於 JavaScript/TypeScript.

**參數:**

- `property`: 想要偵聽更新的屬性名稱.
- `callback`: 當 `property` 更新時觸發的回調.


```typescript
state.listen("currentTurn", (currentValue, previousValue) => {
    console.log(`currentTurn is now ${currentValue}`);
    console.log(`previous value was: ${previousValue}`);
});
```

`.listen()` 返回的函數可用於移除偵聽器


```typescript
const removeListener = state.listen("currentTurn", (currentValue, previousValue) => {
    // ...
});

// 之後, 如果不需要偵聽器了, 可以調用 `removeListener()` 來移除對 `"currentTurn"` 的偵聽.
removeListener();
```

**`listen` 和 `onChange` 有什麽區別?**

`.listen()` 方法是專為監聽單個屬性 `onChange` 的簡化版本. 下面是把 `.listen()` 寫成 `onChange` 的樣子:

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

## 生成客戶端 schema 的方法

`schema-codegen` 是一個轉譯工具, 用於把服務器端的 schema 定義文件轉換為客戶端可以使用的版本:

要在客戶端正確解碼 state, 客戶端的 schema 定義文件必須與服務器端相兼容.

!!! Warning "在使用 [JavaScript SDK](/getting-started/javascript-client/) 時不必使用此工具"
只有在客戶端使用強類型語言, 如 C#, Haxe 等時, 才需要使用 `schema-codegen`.

**使用方法**

要在終端查看使用方法, 先 `cd` 進入服務器目錄, 然後運行以下命令:

```
npx schema-codegen --help
```

**輸出:**

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

### 舉例: Unity / C#

下面是用 [Unity 演示項目](https://github.com/colyseus/colyseus-unity3d/blob/aa9a722a50b2958ce01785969cd8ecb8aee24fd0/Server/package.json#L12) 生成 C# schema 文件的實例.

```
npx schema-codegen src/rooms/schema/* --csharp --output ../Assets/Scripts/States/"
generated: Player.cs
generated: State.cs
```

**使用 `npm` 腳本:**

簡言之, 推薦您把 `schema-codegen` 的參數保存在 `package.json` 文件中的 `npm` 腳本裏:

```json
"scripts": {
    "schema-codegen": "schema-codegen src/rooms/schema/* --csharp --output ../Assets/Scripts/States/"
}
```

這樣, 運行 `npm run schema-codegen`, 就可以代替完整的命令:

```
npm run schema-codegen
generated: Player.cs
generated: State.cs
```

### 版本及向下/向上兼容

通過在現有結構末尾聲明新字段, 可以實現向下/向上兼容, 不應刪除先前的聲明, 而是應該根據需要將其標記為 `@deprecated()`. 下面是一個例子.

```typescript fct_label="Live version 1"
import { Schema, type, deprecated } from "@colyseus/schema";

class MyState extends Schema {
    @type("string") myField: string;
}
```

```typescript fct_label="Live version 2"
import { Schema, type, deprecated } from "@colyseus/schema";

class MyState extends Schema {
    // 標記此字段作廢.
    @deprecated() @type("string") myField: string;

    // 保證不同客戶端版本的服務器兼容.
    @type("string") newField: string;
}
```

```typescript fct_label="Live version 3"
import { Schema, type, deprecated } from "@colyseus/schema";

class MyState extends Schema {
    // 標記此字段作廢.
    @deprecated() @type("string") myField: string;

    // 再次標記此字段作廢.
    @deprecated() @type("string") newField: string;

    // 最新的字段總是保持在最下邊
    @type("string") anotherNewField: string;
}
```

這對於本地編譯類語言很有用, 如 C#, C++, Haxe 等 - 即使這些客戶端編譯時沒有最新的 schema 定義.

---

## 限製和最佳實踐

- 每個 `Schema` 結構最多可以保存 `64` 個字段. 如果需要更多字段, 可以嵌套使用 `Schema` 結構.
- `NaN` 或 `null` 數字被編碼為 `0`
- `null` 字符串被編碼為 `""`
- `Infinity` 數字被編碼為 `Number.MAX_SAFE_INTEGER`
- 不支持多維數組. [查看如何將一維數組作為多維數組使用](https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid/212813#212813)
- `@colyseus/schema` 編碼順序按照字段定義順序.
    - 編碼器 (服務器) 和解碼器 (客戶端) 都必須擁有相同的 schema 定義.
    - 字段的順序也要相同.

### 集合

集合類型 (`ArraySchema`, `MapSchema` 等) 裏的元素類型必須相同, 或者基類相同.

**支持以下寫法:**

```typescript
class Item extends Schema {/* 基類 Item */}
class Weapon extends Item {/* 武器類 */}
class Shield extends Item {/* 盾牌類 */}

class Inventory extends Schema {
    @type({ map: Item }) items = new MapSchema<Item>();
}

const inventory = new Inventory();
inventory.set("left", new Weapon());
inventory.set("right", new Shield());
```
