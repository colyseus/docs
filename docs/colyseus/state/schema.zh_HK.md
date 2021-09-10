# [狀態同步](/state/overview) » 結構描述

!!!提示「還沒使用 TypeScript 嗎？」 強烈建議您使用 TypeScript 來取得定義結構描述結構的更佳體驗，以及更好的整體開發體驗。TypeScript 支援在此章節中大量使用的「實驗性裝飾項目」。

## 如何定義可同步結構

- `結構描述`結構定義了要用在房間狀態的伺服器端。
- 只有使用 `@type()` 裝飾的欄位會受考量進行同步。
- _（可同步結構描述結構應只用於與您狀態相關的資料。）_

### 正在定義`結構描述`結構

```typescript fct\_label="TypeScript" // MyState.ts import { Schema, type } from "@colyseus/schema";

export class MyState extends Schema { @type("string") currentTurn: string; } ```

```typescript fct\_label="JavaScript" // MyState.ts const schema = require('@colyseus/schema'); const Schema = schema.Schema;

class MyState extends Schema { } schema.defineTypes(MyState, { currentTurn: "string" }); ```

!!!提示「_」`@type()` 關鍵字是什麼？我從沒看過這種東西！「_」 您在此頁看到大量使用的 `@type()`，是即將推出 的JavaScript 功能，其尚未由 TC39 正式建立。`type` 其實只是個從 `@colyseus/schema` 模組匯入的函式。透過使用在屬性層級的 `@` 前置詞來調用 `type`，表示我們正在將其調用作為_屬性裝飾項目_。[在這裡查看裝飾項目提案](https://github.com/tc39/proposal-decorators)。

### 使用您`房間`內的狀態

```typescript // MyRoom.ts import { Room } from "colyseus"; import { MyState } from "./MyState";

export class MyRoom extends Room<MyState> { onCreate() { this.setState(new MyState()); } } ```


## 使用結構描述

- 只有伺服器端負責變動結構描述結構
- 用戶端必須具有透過 [`schema-codegen`](#client-side-schema-generation) 感生的相同 `結構描述`定義。_（如果您是使用 [JavaScript SDK](/getting-started/javascript-client/)，則為選擇性）_
- 如需自伺服器取得更新，您必須[在用戶端將調用附加至結構描述執行個體](#callbacks)。
- 用戶端應永不在結構描述上執行變動，因其將在下次伺服器更新時受取代。

### 基本類型

基本類型是數字、字串和布林值。

| 類型 | 說明 | 限制 | |------|-------------|------------| | `「字串」` | utf8 字串 | `4294967295` 的位元組上限 | | `「數字」` | 也稱為「變數」。自動偵測要使用的數字類型。（可能會在編碼時使用一額外位元組）| 0` to `18446744073709551615` | | `"boolean"` | `true` or `false` | `0` or `1` |

**特定數字類型：**

| 類型 | 說明 | 限制 | |------|-------------|------------| | `"int8"` | 帶正負號的 8 位元整數 | `-128` 到 `127` | | `"uint8"` | 無正負號的 8 位元整數 | `0` to `255` | | `"int16"` | 帶正負號的 16 位元整數 | `-32768` 到 `32767` | | `"uint16"` | 無正負號的 16 位元整數 | `0` 到`65535` | | `"int32"` | 帶正負號的 32 位元整數 | `-2147483648``2147483647` | | `"uint32"` | 無正負號的 32 位元整數 | `0` 到 `4294967295` | | `"int64"` | 帶正負號的 64 位元整數 | `-9223372036854775808` 到 `9223372036854775807` | | `"uint64"` | 無正負號的 64 位元整數 | `0` 到 `18446744073709551615` | | `"float32"` | 單精確度浮點數 | `-3.40282347e+38` 到 `3.40282347e+38`| | `"float64"` | 雙精確度浮點數 | `-1.7976931348623157e+308` 到 `1.7976931348623157e+308` |


### 複雜類型

複雜類型由其他結構描述執行個體內的`結構描述`執行個體所組成。其也包含[項目集合](#collections-of-items)（陣列、對應等等）

```typescript fct\_label="TypeScript" import { Schema, type } from "@colyseus/schema";

class World extends Schema { @type("number") width: number; @type("number") height: number; @type("number") items: number = 10; }

class MyState extends Schema { @type(World) world:World = new World(); } ```

```typescript fct\_label="JavaScript" const schema = require('@colyseus/schema'); const Schema = schema.Schema;

class World extends Schema { } schema.defineTypes(World, { width: "number", height: "number", items: "number" });

class MyState extends Schema { constructor () { super();

        this.world = new World();
    }
} schema.defineTypes(MyState, { world:World }); ```

## 項目集合

### ArraySchema

`ArraySchema` 是內建 JavaScript [陣列](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)類型的可同步版本。

**範例自訂`結構描述`類型的陣列**

```typescript fct\_label="TypeScript" import { Schema, ArraySchema, type } from "@colyseus/schema";

class Block extends Schema { @type("number") x: number; @type("number") y: number; }

class MyState extends Schema { @type(\[ Block ]) blocks = new ArraySchema<Block>(); } ```

```typescript fct\_label="JavaScript" const schema = require('@colyseus/schema'); const Schema = schema.Schema; const ArraySchema = schema.ArraySchema;

class Block extends Schema { } schema.defineTypes(Block, { x: "number", y: "number" });

class MyState extends Schema { constructor () { super();

        this.blocks = new ArraySchema();
    }
} schema.defineTypes(MyState, { blocks: \[ Block ], }); ```

**範例基本類型的陣列**

您無法在陣列內混合類型。

```typescript fct\_label="TypeScript" import { Schema, ArraySchema, type } from "@colyseus/schema";

class MyState extends Schema { @type(\[ "string" ]) animals = new ArraySchema<string>(); } ```

```typescript fct\_label="JavaScript" const schema = require('@colyseus/schema'); const Schema = schema.Schema; const ArraySchema = schema.ArraySchema;

class MyState extends Schema { constructor () { super();

        this.animals = new ArraySchema();
    }
} schema.defineTypes(MyState, { animals: \[ "string" ], }); ```

---

#### `array.push()`

新增一或多個元素至陣列末端，並傳回陣列的新長度。

```typescript const animals = new ArraySchema<string>(); animals.push("pigs", "goats"); animals.push("sheeps"); animals.push("cows"); // output:4 ```

---

#### `array.pop()`

自陣列移除最後的元素，並傳回該元素。此方法會變更陣列的長度。

```typescript animals.pop(); // output: "cows"

animals.length // output:3 ```

---

#### `array.shift()`

自陣列移除首個元素，並傳回該移除的元素。此方法會變更陣列的長度。

```typescript animals.shift(); // output: "pigs"

animals.length // output:2 ```

---

#### `array.unshift()`

新增一或多個元素至陣列起始處，並傳回陣列的新長度。

```typescript animals.unshift("pigeon"); // output:3 ```

---

#### `array.indexOf()`

傳回能在陣列中找到指定元素的第一個索引項目，如果其不存在，則為 -1。

```typescript const itemIndex = animals.indexOf("sheeps"); ```

---

#### `array.splice()`

透過移除或取代現有元素和/或[就地](https://en.wikipedia.org/wiki/In-place_algorithm)新增元素，變更陣列的內容。

```typescript // find the index of the item you'd like to remove const itemIndex = animals.findIndex((animal) => animal === "sheeps");

// remove it! animals.splice(itemIndex, 1); ```

---

#### `array.forEach()`

逐一查看陣列的各個元素。

```typescript fct\_label="TypeScript" this.state.array1 = new ArraySchema<string>('a', 'b', 'c');

this.state.array1.forEach(element => { console.log(element); }); // output: "a" // output: "b" // output: "c" ```

```csharp fct_label="C#" State.array1.ForEach((value) => { Debug.Log(value); }) ```

```lua fct_label="LUA" state.array1:each(function(value, index) print(index, "=>") pprint(value) end) ```

```lua fct_label="Haxe" for (index => value in state.array1) { trace(index + " => " + value); } ```

!!!注意「可用於陣列的更多方法」請查看 [MDN 文件](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/)。

### MapSchema

`MapSchema` 是內建 JavaScript [地圖](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)類型的可同步版本。

推薦可透過 ID 使用地圖來追蹤您的遊戲實體，例如玩家、敵人等等。

!!!警告「目前僅支援字串索引鍵」目前 `MapSchema` 只允許您自訂值類型。索引鍵類型一律為`字串`。

```typescript fct\_label="TypeScript" import { Schema, MapSchema, type } from "@colyseus/schema";

class Player extends Schema { @type("number") x: number; @type("number") y: number; }

class MyState extends Schema { @type({ map:Player }) players = new MapSchema<Player>(); } ```

```typescript fct\_label="JavaScript" const schema = require('@colyseus/schema'); const Schema = schema.Schema; const MapSchema = schema.MapSchema;

class Player extends Schema { } schema.defineTypes(Player, { x: "number", y: "number" });

class MyState extends Schema { constructor () { super();

        this.players = new MapSchema();
    }
} schema.defineTypes(MyState, { players: { map:Player } }); ```

---

#### `map.get()`

透過地圖索引鍵取得其項目：

```typescript const map = new MapSchema<string>(); const item = map.get("key"); ```

OR

```typescript // // NOT RECOMMENDED // // This is a compatibility layer with previous versions of @colyseus/schema // This is going to be deprecated in the future. // const item = map["key"]; ```

---

#### `map.set()`

透過索引鍵設定地圖項目：

```typescript const map = new MapSchema<string>(); map.set("key", "value"); ```

OR

```typescript // // NOT RECOMMENDED // // This is a compatibility layer with previous versions of @colyseus/schema // This is going to be deprecated in the future. // map["key"] = "value"; ```

---

#### `map.delete()`

透過索引鍵移除地圖項目：

```typescript map.delete("key"); ```

OR

```typescript // // NOT RECOMMENDED // // This is a compatibility layer with previous versions of @colyseus/schema // This is going to be deprecated in the future. // delete map["key"]; ```

---

#### `map.size`

傳回 `MapSchema` 物件中的元素數。

```typescript const map = new MapSchema<number>(); map.set("one", 1); map.set("two", 2);

console.log(map.size); // output:2 ```

---

#### `map.forEach()`

以插入順序逐一查看地圖的每個索引鍵/值對。

```typescript fct_label="TypeScript" this.state.players.forEach((value, key) => { console.log("key =>", key) console.log("value =>", value) }); ```

```csharp fct_label="C#" State.players.ForEach((key, value) => { Debug.Log(key); Debug.Log(value); }) ```

```lua fct_label="LUA" state.players:each(function(value, key) print(key, "=>") pprint(value) end) ```

```lua fct_label="Haxe" for (key => value in state.players) { trace(index + " => " + value); } ```

!!!注意「可用於地圖的更多方法」請查看 [MDN 文件](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/)。


### SetSchema

!!!警告「`SetSchema` 只會在 JavaScript 內實作」目前為止 `SetSchema` 只能用在 JavaScript。尚未支援 Haxe、C#、LUA 和 C++ 用戶端。

`SetSchema` 是內建 JavaScript [集合](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)類型的可同步版本。

`SetSchema` 的使用方式與 \[`CollectionSchema`] 非常相似，最大的差異在於集合保留唯一的值。集合並沒有直接存取值的方式。（如 [collection.at()](#collectionat)）

```typescript fct\_label="TypeScript" import { Schema, SetSchema, type } from "@colyseus/schema";

class Effect extends Schema { @type("number") radius: number; }

class Player extends Schema { @type({ set:Effect }) effects = new SetSchema<Effect>(); } ```

```typescript fct\_label="JavaScript" const schema = require('@colyseus/schema'); const Schema = schema.Schema; const SetSchema = schema.SetSchema;

class Effect extends Schema { } schema.defineTypes(Effect, { radius: "number", });

class Player extends Schema { constructor () { super();

        this.effects = new SetSchema();
    }
} schema.defineTypes(Player, { effects: { set:Effect } }); ```

---

#### `set.add()`

附加項目至 `SetSchema` 物件。

```typescript const set = new CollectionSchema<number>(); set.add(1); set.add(2); set.add(3); ```

---

#### `set.at()`

在指定的`索引`取得項目。

```typescript const set = new CollectionSchema<string>(); set.add("one"); set.add("two"); set.add("three");

set.at(1); // output: "two" ```

---

#### `set.delete()`

依項目的值將其刪除。

```typescript set.delete("three"); ```

---

#### `set.has()`

不論項目是否存在集合中，傳回布林值。

```typescript if (set.has("two")) { console.log("Exists!"); } else { console.log("Does not exist!"); } ```

---

#### `set.size`

傳回 `SetSchema` 物件中的元素數。

```typescript const set = new SetSchema<number>(); set.add(10); set.add(20); set.add(30);

console.log(set.size); // output:3 ```

!!!注意「集合的更多可用方法」請查看 [MDN 文件](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/)。


### CollectionSchema

!!!警告「`CollectionSchema` 只能在 JavaScript 內實作」目前為止　`CollectionSchema` 只能用於 JavaScript。尚未支援 Haxe、C#、LUA 和 C++ 用戶端。

`CollectionSchema` 的運作方式與 `ArraySchema` 相似，請警惕，你無法控制其索引。

```typescript fct\_label="TypeScript" import { Schema, CollectionSchema, type } from "@colyseus/schema";

class Item extends Schema { @type("number") damage: number; }

class Player extends Schema { @type({ collection:Item }) items = new CollectionSchema<Item>(); } ```

```typescript fct\_label="JavaScript" const schema = require('@colyseus/schema'); const Schema = schema.Schema; const CollectionSchema = schema.CollectionSchema;

class Item extends Schema { } schema.defineTypes(Item, { damage: "number", });

class Player extends Schema { constructor () { super();

        this.items = new CollectionSchema();
    }
} schema.defineTypes(Player, { items: { collection:Item } }); ```

---

#### `collection.add()`

附加項目至 `CollectionSchema` 物件。

```typescript const collection = new CollectionSchema<number>(); collection.add(1); collection.add(2); collection.add(3); ```

---

#### `collection.at()`

在指定的`索引`取得項目。

```typescript const collection = new CollectionSchema<string>(); collection.add("one"); collection.add("two"); collection.add("three");

collection.at(1); // output: "two" ```

---

#### `collection.delete()`

依項目的值將其刪除。

```typescript collection.delete("three"); ```

---

#### `collection.has()`

不論項目是否存在集合中，傳回布林值。

```typescript if (collection.has("two")) { console.log("Exists!"); } else { console.log("Does not exist!"); } ```

---

#### `collection.size`

在 `CollectionSchema` 物件內傳回元素數。

```typescript const collection = new CollectionSchema<number>(); collection.add(10); collection.add(20); collection.add(30);

console.log(collection.size); // output:3 ```

---

#### `collection.forEach()`

`forEach()` 方法依插入順序對 `CollectionSchema` 物件中的每個索引/值對執行一次提供的函式。

```typescript collection.forEach((value, at) => { console.log("at =>", at) console.log("value =>", value) }); ```

## Filtering data per client

!!!警告「此功能為實驗性」`@filter()`/`@filterChildren()` 為實驗性功能，且可能未對快節奏的遊戲進行最佳化。

篩選代表對特定用戶端隱藏您的部分狀態以避免作弊情況，該情況為玩家決定檢查來自網路的資料和查看未篩選的狀態資訊。

資料篩選是會受**每個用戶端**和**每個欄位**觸發的回調。（在 `@filterChildren` 得情況下，是每個子結構）。如果篩選回調傳回 `true`，則會未該特定用戶端傳送欄位資料，否則則不會為其傳送資料。

請注意，如果篩選函式相依性變更，則篩選函式不會自動重新執行，但只在篩選的欄位或其子項目已更新的情況下。查看[這個問題](https://github.com/colyseus/schema/issues/102)以瞭解因應措施。

### `@filter()` 屬性裝飾項目

`@filter()` 屬性裝飾項目可用於篩選整個結構描述欄位。

以下為 `@filter()` 簽署的形式：

```typescript fct\_label="TypeScript" class State extends Schema { @filter(function(client, value, root) { // client is: // // the current client that's going to receive this data. you may use its // client.sessionId, or other information to decide whether this value is // going to be synched or not.

        // value is:
        // the value of the field @filter() is being applied to

        // root is:
        // the root instance of your room state. you may use it to access other
        // structures in the process of decision whether this value is going to be
        // synched or not.
    })
    @type("string") field: string;
} ```

```typescript fct\_label="JavaScript" const schema = require('@colyseus/schema'); class State extends schema.Schema {}

schema.defineTypes(State, { field: "string" });

schema.filter(function(client, value, root) { // client is: // // the current client that's going to receive this data. you may use its // client.sessionId, or other information to decide whether this value is // going to be synched or not.

    // value is:
    // the value of the field @filter() is being applied to

    // root is:
    // the root instance of your room state. you may use it to access other
    // structures in the process of decision whether this value is going to be
    // synched or not.
    return true;
})(State.prototype, "field"); ```

### `@filterChildren()` property decorator

`@filterChildren()` 屬性裝飾項目可用於篩選陣列、地圖、集合等內的項目。其簽署與 `@filter()` 非常相似，只是在代表 [ArraySchema](#arrayschema)、[MapSchema](#mapschema)、{7>CollectionSchema<7} 等內每個項目的`值`前多了`索引鍵`參數。

```typescript fct\_label="TypeScript" class State extends Schema { @filterChildren(function(client, key, value, root) { // 用戶端為：// // 要接收此資料的目前用戶端。你可以使用其 // client.sessionId 或其他資訊以決定此值是否 // 要進行同步。

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
} ```

```typescript fct\_label="JavaScript" const schema = require('@colyseus/schema'); class State extends schema.Schema {}

schema.defineTypes(State, { cards: \[Card] });

schema.filterChildren(function(client, key, value, root) { // 用戶端為：// // 要接收此資料的目前用戶端。你可以使用其 // client.sessionId 或其他資訊以決定此值是否 // 要進行同步。

    // key is:
    // the key of the current value inside the structure

    // value is:
    // the current value inside the structure

    // root is:
    // the root instance of your room state. you may use it to access other
    // structures in the process of decision whether this value is going to be
    // synched or not.
    return true;
})(State.prototype, "cards"); ```

**範例：**在卡牌遊戲中，每張牌的相關資料應僅供該卡片所有人存取，或在特定情況存取（例如：卡牌已丟棄）

查看 `@filter()` 回呼簽署：

```typescript fct\_label="TypeScript" import { Client } from "colyseus";

class Card extends Schema { @type("string") owner: string; // contains the sessionId of Card owner @type("boolean") discarded: boolean = false;

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
} ```

```typescript fct\_label="JavaScript" const schema = require('@colyseus/schema');

class Card extends schema.Schema {} schema.defineTypes(Card, { owner: "string", discarded: "boolean", number: "uint8" });

/\** * 請勿在 `@filter` 內使用箭號函式 * （這會強制產生`這種`的不同範圍） \*/ schema.filter(function(client, value, root) { return this.discarded || this.owner === client.sessionId; })(Card.prototype, "number"); ```

## 用戶端

!!!警告「C#、C++、Haxe」 在使用靜態類型語言時，您必須根據自己的 TypeScript 結構描述定義來敢生用戶端結構描述檔案。[查看在用戶端產生結構描述](#client-side-schema-generation)。

### 回呼

當在套用來自伺服器的狀態變更時，用戶端會根據套用的變更在本機執行個體上觸發回呼。

回呼會根據執行個體參考來觸發。確保將回呼附加至實際在伺服器上變更的執行個體。

- [onAdd (instance, key)](#onadd-instance-key)
- [onRemove (instance, key)](#onremove-instance-key)
- [onChange (changes)](#onchange-changes-datachange)（在`結構描述`執行個體）
- [onChange (instance, key)](#onchange-instance-key)（在集合：`MapSchema`、`ArraySchema` 等等）
- [listen()](#listenprop-callback)

#### `onAdd (instance, key)`

`onAdd` 回呼只能用於項目集合（`MapSchema`、`MapSchema` 等等）。`onAdd` 回呼會使用新執行個體以及其在預留位置物件作為引數的索引鍵進行呼叫。

```javascript fct\_label="JavaScript" room.state.players.onAdd = (player, key) => { console.log(player, "has been added at", key);

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
}; ```

```lua fct\_label="LUA" room.state.players\['on\_add'] = function (player, key) print("player has been added at", key);

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
end ```

```csharp fct\_label="C#" room.State.players.OnAdd += (Player player, string key) => { Debug.Log("player has been added at " + key);

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
}; ```

---

#### `onRemove (instance, key)`

`onRemove` 回呼只能用於 (`MapSchema`) 和陣列 (`ArraySchema`)。`onRemove` 回呼會使用移除的執行個體以及其在預留位置物件作為引數的索引鍵進行呼叫。

```javascript fct\_label="JavaScript" room.state.players.onRemove = (player, key) => { console.log(player, "has been removed at", key);

    // remove your player entity from the game world!
}; ```

```lua fct\_label="LUA" room.state.players\['on\_remove'] = function (player, key) print("player has been removed at " .. key);

    -- remove your player entity from the game world!
end ```

```csharp fct\_label="C#" room.State.players.OnRemove += (Player player, string key) => { Debug.Log("player has been removed at " + key);

    // remove your player entity from the game world!
}; ```

---

#### `onChange (changes:DataChange\[])`

> `onChange` 對於直接{2>結構描述<2}參考和集合結構的運作方式並不相同。對於[在集合結構（陣列、地圖等等）的 `onChange` 資訊，請查看這裡](#onchange-instance-key)。

您可以登錄 `onChange` 以追蹤`結構描述`執行個體的屬性變更。`onChange` 回呼使用變更的屬性以及其先前的值來進行觸發。

```javascript fct_label="JavaScript" room.state.onChange = (changes) => { changes.forEach(change => { console.log(change.field); console.log(change.value); console.log(change.previousValue); }); }; ```

```lua fct_label="LUA" room.state['on_change'] = function (changes) for i, change in ipairs(changes) do print(change.field) print(change.value) print(change.previousValue) end end ```

```csharp fct_label="C#" room.State.OnChange += (changes) => { changes.ForEach((obj) => { Debug.Log(obj.Field); Debug.Log(obj.Value); Debug.Log(obj.PreviousValue); }); }; ```

您無法在尚未與用戶端同步的物件上登錄 `onChange` 回呼。

---

#### `onChange (instance, key)`

> `onChange` 對於直接{2>結構描述<2}參考和集合結構的運作方式並不相同。對於 [`onChange` 在`結構描述`結構的資訊，請查看這裡](#onchange-changes-datachange)。

此回呼會在**基本**集合類型（`字串`、`數字`、`布林值`等等）更新其部分值時觸發。

```javascript fct_label="JavaScript" room.state.players.onChange = (player, key) => { console.log(player, "have changes at", key); }; ```

```lua fct_label="LUA" room.state.players['on_change'] = function (player, key) print("player have changes at " .. key); end ```

```csharp fct_label="C#" room.State.players.OnChange += (Player player, string key) => { Debug.Log("player have changes at " + key); }; ```

如果您要偵測**非基本**類型（保留`結構描述`執行個體）集合內的變更，請使用 [`onAdd`](#onadd-instance-key) 並在其中登錄 [`onChange`](#onchange-changes-datachange)。

!!!警告「`onChange`、`onAdd` 和 `onRemove` 為**專屬**」`onChange` 回呼不會在 [`onAdd`](#onadd-instance-key) 或 [`onRemove`](#onremove-instance-key)　時觸發。

    Consider registering `onAdd` and `onRemove` if you need to detect changes during these steps too.

---

#### `.listen(prop, callback)`

接聽單一屬性變更。

> `.listen()` 目前只能用於 JavaScript/TypeScript。

**參數：**

- `屬性`：您要接聽變更的屬性名稱。
- `回呼`：在`屬性`變更時會觸發的呼叫。


```typescript state.listen("currentTurn", (currentValue, previousValue) => { console.log(`currentTurn is now ${currentValue}`); console.log(`previous value was: ${previousValue}`); }); ```

`.listen()` 方法傳回代表取消登錄接聽程式的函式。


```typescript const removeListener = state.listen("currentTurn", (currentValue, previousValue) => { // ... });

// 如果您稍後不再需要接聽程式，您可以呼叫 `removeListener()` 以停止接聽 `"currentTurn"` 變更。removeListener(); ```

**`接聽`和 `onChange` 間有甚麼差異？**

`.listen()` 方法是`onChange` 在單一屬性上的速記。以下為

```typescript state.onChange = function(changes) { changes.forEach((change) => { if (change.field === "currentTurn") { console.log(`currentTurn is now ${change.value}`); console.log(`previous value was: ${change.previousValue}`); } }) } ```

---

## 用戶端結構描述產生

`schema-codegen` 是轉換您要用於用戶端的伺服器端結構描述定義檔案的工具：

如需解碼用戶端內的狀態，其本機結構描述定義必須與伺服器內的結構描述定義相符。

!!!警告「使用 [JavaScript SDK](/getting-started/javascript-client/) 時不需要」只有在用戶端使用靜態類型語言（例如 C#、Haxe 等等）時，才需要使用 `schema-codegen`。

**使用方式**

如需查看使用方式，請自您的終端 `cd` 進入伺服器目錄並執行以下命令：

``` npx schema-codegen --help ```

**Output:**

``` schema-codegen \[path/to/Schema.ts]

Usage (C#/Unity) schema-codegen src/Schema.ts --output client-side/ --csharp --namespace MyGame.Schema

Valid options: --output: fhe output directory for generated client-side schema files --csharp: generate for C#/Unity --cpp: generate for C++ --haxe: generate for Haxe --ts: generate for TypeScript --js: generate for JavaScript --java: generate for Java

Optional: --namespace: generate namespace on output code ```

### 範例：Unity / C#

以下是自[示範 Unity 專案](https://github.com/colyseus/colyseus-unity3d/blob/aa9a722a50b2958ce01785969cd8ecb8aee24fd0/Server/package.json#L12)產生 C# 結構描述檔案的真實範例。

``` npx schema-codegen src/rooms/schema/* --csharp --output ../Assets/Scripts/States/" generated:Player.cs generated:State.cs ```

**使用 `npm` 指令碼：**

簡而言之，建議讓您的 `schema-codegen` 引數在`package.json` 內的 `npm` 指令碼下進行設定：

```json "scripts": { "schema-codegen": "schema-codegen src/rooms/schema/* --csharp --output ../Assets/Scripts/States/" } ```

這樣您就能執行 `npm run schema-codegen` 而不是整個命令：

``` npm run schema-codegen generated:Player.cs generated:State.cs ```

### 版本管理和向前/向後傳遞相容性

透過在現有結構末端宣告新欄位，可能實現向前/向後傳遞相容性，且不會移除早期宣告，但在有需要時會標記 `@deprecated()`。查看以下的版本管理範例。

```typescript fct\_label="Live version 1" import { Schema, type, deprecated } from "@colyseus/schema";

class MyState extends Schema { @type("string") myField: string; } ```

```typescript fct\_label="Live version 2" import { Schema, type, deprecated } from "@colyseus/schema";

class MyState extends Schema { // Flag field as deprecated. @deprecated() @type("string") myField: string;

    // To allow your server to play nicely with multiple client-side versions.
    @type("string") newField: string;
} ```

```typescript fct\_label="Live version 3" import { Schema, type, deprecated } from "@colyseus/schema";

class MyState extends Schema { // Flag field as deprecated. @deprecated() @type("string") myField: string;

    // Flag field as deprecated again.
    @deprecated() @type("string") newField: string;

    // New fields always at the end of the structure
    @type("string") anotherNewField: string;
} ```

這對原生編譯目標特別實用，像是用戶端可能沒有結構描述定義最新版本的 C#、C++、Haxe 等等。

---

## 限制和最佳做法

- 每個`結構描述`結構能保留最多 `64` 個欄位。如果您需要更多欄位，請使用巢狀`結構描述`結構。
- `NaN` 或 `null` 數字編碼為 `0`
- `null` 字串編碼為 `""`
- `無限`數字編碼為 `Number.MAX_SAFE_INTEGER`
- 不支援多維陣列。[查看如何使用 1D 陣列作為多維](https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid/212813#212813)
- `@colyseus/schema` 編碼順序是根據欄位定義順序。
    - 編碼器（伺服器）和解碼器（用戶端）都必須具有相同結構描述定義。
    - 欄位的順序必須相同。

### 集合

集合類型（`ArraySchema`、`MapSchema` 等等）必須保留相同類型的項目，或共享相同的基底類型。

**以下範例受支援：**

```typescript class Item extends Schema {/* base Item fields */} class Weapon extends Item {/* specialized Weapon fields */} class Shield extends Item {/* specialized Shield fields \*/}

class Inventory extends Schema { @type({ map:Item }) items = new MapSchema<Item>(); }

const inventory = new Inventory(); inventory.set("left", new Weapon()); inventory.set("right", new Shield()); ```

### 基本類型

| 類型 | 說明 | 限制 | |------|-------------|------------| | `「字串」` | utf8 字串 | `4294967295` 的位元組上限 | | `「數字」` | 也稱為「變數」。自動偵測要使用的數字類型。（在編碼時可能會使用一額外位元組）| `0` |  到 `18446744073709551615` | | `"boolean"` | `true` 或 `false` | `0` 或 `1` | | `"int8"` | 帶正負號的 8 位元整數 | `-128` 到 `127` | | `"uint8"` | 無正負號的 8 位元整數 | `0` 到 `255` | | `"int16"` | 帶正負號的 16 位元整數 | `-32768` 到 `32767` | | `"uint16"` | 無正負號的 16 位元整數 | `0` 到 `65535` | | `"int32"` | 帶正負號的 32 位元整數 | `-2147483648` 到 `2147483647` | | `"uint32"` | 無正負號的 32 位元整數 | `0` 到 `4294967295` | | `"int64"` | 帶正負號的 64 位元整數 | `-9223372036854775808` 到 `9223372036854775807` | | `"uint64"` | 無正負號的 64 位元整數 | `0` 到 `18446744073709551615` | | `"float32"` | 單精確度浮點數 | `-3.40282347e+38` 到 `3.40282347e+38`| | `"float64"` | 雙精確度浮點數 | `-1.7976931348623157e+308` 到 `1.7976931348623157e+308` |
