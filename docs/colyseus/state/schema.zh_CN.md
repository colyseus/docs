# {1>狀態同步<1} » 結構描述

!!!提示「還沒使用 TypeScript 嗎？」 強烈建議您使用 TypeScript 來取得定義結構描述結構的更佳體驗，以及更好的整體開發體驗。TypeScript 支援在此章節中大量使用的「實驗性裝飾項目」。

## 如何定義可同步結構

- {1>結構描述<1}結構定義了要用在房間狀態的伺服器端。 
- 只有使用 {1>@type()<1} 裝飾的欄位會受考量進行同步。 
- {1>（可同步結構描述結構應只用於與您狀態相關的資料。）<1}

### 正在定義{1>結構描述<1}結構

\`\`\`typescript fct\_label="TypeScript" // MyState.ts import { Schema, type } from "@colyseus/schema";

export class MyState extends Schema { @type("string") currentTurn: string; } \`\`\`

\`\`\`typescript fct\_label="JavaScript" // MyState.ts const schema = require('@colyseus/schema'); const Schema = schema.Schema;

class MyState extends Schema { } schema.defineTypes(MyState, { currentTurn: "string" }); \`\`\`

!!!提示「{1}」{2>@type()<2} 關鍵字是什麼？我從沒看過這種東西！「{3}」 您在此頁看到大量使用的 {4>@type()<4}，是即將推出 的JavaScript 功能，其尚未由 TC39 正式建立。{5>type<5} 其實只是個從 {6>@colyseus/schema<6} 模組匯入的函式。透過使用在屬性層級的 {8>@<8} 前置詞來調用 {7>type<7}，表示我們正在將其調用作為{9>屬性裝飾項目<9}。{10>在這裡查看裝飾項目提案<10}。 

### 使用您{1>房間<1}內的狀態

\`\`\`typescript // MyRoom.ts import { Room } from "colyseus"; import { MyState } from "./MyState";

export class MyRoom extends Room{1} { onCreate() { this.setState(new MyState()); } } \`\`\`


## 使用結構描述

- 只有伺服器端負責變動結構描述結構
- 用戶端必須具有透過 {2>{3>schema-codegen<3}<2} 感生的相同 {1>結構描述<1}定義。{4>（如果您是使用 {5>JavaScript SDK<5}，則為選擇性）<4}
- 如需自伺服器取得更新，您必須{1>在用戶端將調用附加至結構描述執行個體<1}。
- 用戶端應永不在結構描述上執行變動，因其將在下次伺服器更新時受取代。

### 基本類型

基本類型是數字、字串和布林值。 

| 類型 | 說明 | 限制 | |------|-------------|------------| | {1>「字串」<1} | utf8 字串 | {2>4294967295<2} 的位元組上限 | | {3>「數字」<3} | 也稱為「變數」。自動偵測要使用的數字類型。（可能會在編碼時使用一額外位元組）| {4>0<4} 到 {5>18446744073709551615<5} | | {6>「布林值」<6} | {7>true<7} 或 {8>false<8} | {9>0<9} 或 {10>1<10} |

{1>特定數字類型：<1}

| 類型 | 說明 | 限制 | |------|-------------|------------| | {1>"int8"<1} | 帶正負號的 8 位元整數 | {2>-128<2} 到 {3>127<3} | | {4>"uint8"<4} | 無正負號的 8 位元整數 | {5>0<5} 到 {6>255<6} | | {7>"int16"<7} | 帶正負號的 16 位元整數 | {8>-32768<8} 到 {9>32767<9} | | {10>"uint16"<10} | 無正負號的 16 位元整數 | {11>0<11} 到 {12>65535<12} | | {13>"int32"<13} | 帶正負號的 32 位元整數 | {14>-2147483648<14} 到 {15>2147483647<15} | | {16>"uint32"<16} | 無正負號的 32 位元整數 | {17>0<17} 到 {18>4294967295<18} | | {19>"int64"<19} | 帶正負號的 64 位元整數 | {20>-9223372036854775808<20} 到 {21>9223372036854775807<21} | | {22>"uint64"<22} | 無正負號的 64 位元整數 | {23>0<23} 到 {24>18446744073709551615<24} | | {25>"float32"<25} | 單精確度浮點數 | {26>-3.40282347e+38<26} 到 {27>3.40282347e+38<27}| | {28>"float64"<28} | 雙精確度浮點數 | {29>-1.7976931348623157e+308<29} 到 {30>1.7976931348623157e+308<30} |


### 複雜類型

複雜類型由其他結構描述執行個體內的{1>結構描述<1}執行個體所組成。其也包含{2>項目集合<2}（陣列、對應等等）

\`\`\`typescript fct\_label="TypeScript" import { Schema, type } from "@colyseus/schema";

class World extends Schema { @type("number") width: number; @type("number") height: number; @type("number") items: number = 10; }

class MyState extends Schema { @type(World) world:World = new World(); } \`\`\`

\`\`\`typescript fct\_label="JavaScript" const schema = require('@colyseus/schema'); const Schema = schema.Schema;

class World extends Schema { } schema.defineTypes(World, { width: "number", height: "number", items: "number" });

class MyState extends Schema { constructor () { super();

        this.world = new World();
    }
} schema.defineTypes(MyState, { world:World }); \`\`\`

## 項目集合

### ArraySchema

{1>ArraySchema<1} 是內建 JavaScript {2>陣列<2}類型的可同步版本。

範例自訂{2>結構描述<2}類型的陣列{3}

\`\`\`typescript fct\_label="TypeScript" import { Schema, ArraySchema, type } from "@colyseus/schema";

class Block extends Schema { @type("number") x: number; @type("number") y: number; }

class MyState extends Schema { @type(\[ Block ]) blocks = new ArraySchema{1}(); } \`\`\`

\`\`\`typescript fct\_label="JavaScript" const schema = require('@colyseus/schema'); const Schema = schema.Schema; const ArraySchema = schema.ArraySchema;

class Block extends Schema { } schema.defineTypes(Block, { x: "number", y: "number" });

class MyState extends Schema { constructor () { super();

        this.blocks = new ArraySchema();
    }
} schema.defineTypes(MyState, { blocks: \[ Block ], }); \`\`\`

範例基本類型的陣列{2}

您無法在陣列內混合類型。

\`\`\`typescript fct\_label="TypeScript" import { Schema, ArraySchema, type } from "@colyseus/schema";

class MyState extends Schema { @type(\[ "string" ]) animals = new ArraySchema{1}(); } \`\`\`

\`\`\`typescript fct\_label="JavaScript" const schema = require('@colyseus/schema'); const Schema = schema.Schema; const ArraySchema = schema.ArraySchema;

class MyState extends Schema { constructor () { super();

        this.animals = new ArraySchema();
    }
} schema.defineTypes(MyState, { animals: \[ "string" ], }); \`\`\`

---

#### {1>array.push()<1}

新增一或多個元素至陣列末端，並傳回陣列的新長度。

{1}typescript const animals = new ArraySchema<string>(); animals.push("pigs", "goats"); animals.push("sheeps"); animals.push("cows"); // output:{1}

---

#### {1>array.pop()<1}

自陣列移除最後的元素，並傳回該元素。此方法會變更陣列的長度。

\`\`\`typescript animals.pop(); // output: "cows"

animals.length // output:3 \`\`\`

---

#### {1>array.shift()<1}

自陣列移除首個元素，並傳回該移除的元素。此方法會變更陣列的長度。

\`\`\`typescript animals.shift(); // output: "pigs"

animals.length // output:2 \`\`\`

---

#### {1>array.unshift()<1}

新增一或多個元素至陣列起始處，並傳回陣列的新長度。

{1}typescript animals.unshift("pigeon"); // output:{1}

---

#### {1>array.indexOf()<1}

傳回能在陣列中找到指定元素的第一個索引項目，如果其不存在，則為 -1。

{1>typescript const itemIndex = animals.indexOf("sheeps"); <1}

---

#### {1>array.splice()<1}

透過移除或取代現有元素和/或{1>就地<1}新增元素，變更陣列的內容。

\`\`\`typescript // find the index of the item you'd like to remove const itemIndex = animals.findIndex((animal) => animal === "sheeps");

// remove it! animals.splice(itemIndex, 1); \`\`\`

---

#### {1>array.forEach()<1}

逐一查看陣列的各個元素。

\`\`\`typescript fct\_label="TypeScript" this.state.array1 = new ArraySchema{1}('a', 'b', 'c');

this.state.array1.forEach(element => { console.log(element); }); // output: "a" // output: "b" // output: "c" \`\`\`

{1>csharp fct\_label="C#" State.array1.ForEach((value) => { Debug.Log(value); }) <1}

{1>lua fct\_label="LUA" state.array1:each(function(value, index) print(index, "=>") pprint(value) end) <1}

{1>lua fct\_label="Haxe" for (index => value in state.array1) { trace(index + " => " + value); } <1}

!!!注意「可用於陣列的更多方法」請查看 {1>MDN 文件<1}。

### MapSchema

{1>MapSchema<1} 是內建 JavaScript {2>地圖<2}類型的可同步版本。

推薦可透過 ID 使用地圖來追蹤您的遊戲實體，例如玩家、敵人等等。

!!!警告「目前僅支援字串索引鍵」目前 {1>MapSchema<1} 只允許您自訂值類型。索引鍵類型一律為{2>字串<2}。

\`\`\`typescript fct\_label="TypeScript" import { Schema, MapSchema, type } from "@colyseus/schema";

class Player extends Schema { @type("number") x: number; @type("number") y: number; }

class MyState extends Schema { @type({ map:Player }) players = new MapSchema{1}(); } \`\`\`

\`\`\`typescript fct\_label="JavaScript" const schema = require('@colyseus/schema'); const Schema = schema.Schema; const MapSchema = schema.MapSchema;

class Player extends Schema { } schema.defineTypes(Player, { x: "number", y: "number" });

class MyState extends Schema { constructor () { super();

        this.players = new MapSchema();
    }
} schema.defineTypes(MyState, { players: { map:Player } }); \`\`\`

---

#### {1>map.get()<1}

透過地圖索引鍵取得其項目：

{1>typescript const map = new MapSchema<string>(); const item = map.get("key"); <1}

OR

{1>typescript // // NOT RECOMMENDED // // This is a compatibility layer with previous versions of @colyseus/schema // This is going to be deprecated in the future. // const item = map\["key"]; <1}

---

#### {1>map.set()<1}

透過索引鍵設定地圖項目：

{1>typescript const map = new MapSchema<string>(); map.set("key", "value"); <1}

OR

{1>typescript // // NOT RECOMMENDED // // This is a compatibility layer with previous versions of @colyseus/schema // This is going to be deprecated in the future. // map\["key"] = "value"; <1}

---

#### {1>map.delete()<1}

透過索引鍵移除地圖項目：

{1>typescript map.delete("key"); <1}

OR

{1>typescript // // NOT RECOMMENDED // // This is a compatibility layer with previous versions of @colyseus/schema // This is going to be deprecated in the future. // delete map\["key"]; <1}

---

#### {1>map.size<1}

傳回 {1>MapSchema<1} 物件中的元素數。

\`\`\`typescript const map = new MapSchema{1}(); map.set("one", 1); map.set("two", 2);

console.log(map.size); // output:2 \`\`\`

---

#### {1>map.forEach()<1}

以插入順序逐一查看地圖的每個索引鍵/值對。

{1>typescript fct\_label="TypeScript" this.state.players.forEach((value, key) => { console.log("key =>", key) console.log("value =>", value) }); <1}

{1>csharp fct\_label="C#" State.players.ForEach((key, value) => { Debug.Log(key); Debug.Log(value); }) <1}

{1>lua fct\_label="LUA" state.players:each(function(value, key) print(key, "=>") pprint(value) end) <1}

{1>lua fct\_label="Haxe" for (key => value in state.players) { trace(index + " => " + value); } <1}

!!!注意「可用於地圖的更多方法」請查看 {1>MDN 文件<1}。


### SetSchema

!!!警告「{1>SetSchema<1} 只會在 JavaScript 內實作」目前為止 {2>SetSchema<2} 只能用在 JavaScript。尚未支援 Haxe、C#、LUA 和 C++ 用戶端。

{1>SetSchema<1} 是內建 JavaScript {2>集合<2}類型的可同步版本。

{1>SetSchema<1} 的使用方式與 \[\`CollectionSchema\`] 非常相似，最大的差異在於集合保留唯一的值。集合並沒有直接存取值的方式。（如 {2>collection.at()<2}）

\`\`\`typescript fct\_label="TypeScript" import { Schema, SetSchema, type } from "@colyseus/schema";

class Effect extends Schema { @type("number") radius: number; }

class Player extends Schema { @type({ set:Effect }) effects = new SetSchema{1}(); } \`\`\`

\`\`\`typescript fct\_label="JavaScript" const schema = require('@colyseus/schema'); const Schema = schema.Schema; const SetSchema = schema.SetSchema;

class Effect extends Schema { } schema.defineTypes(Effect, { radius: "number", });

class Player extends Schema { constructor () { super();

        this.effects = new SetSchema();
    }
} schema.defineTypes(Player, { effects: { set:Effect } }); \`\`\`

---

#### {1>set.add()<1}

附加項目至 {1>SetSchema<1} 物件。

{1>typescript const set = new CollectionSchema<number>(); set.add(1); set.add(2); set.add(3); <1}

---

#### {1>set.at()<1}

在指定的{1>索引<1}取得項目。

\`\`\`typescript const set = new CollectionSchema{1}(); set.add("one"); set.add("two"); set.add("three");

set.at(1); // output: "two" \`\`\`

---

#### {1>set.delete()<1}

依項目的值將其刪除。

{1>typescript set.delete("three"); <1}

---

#### {1>set.has()<1}

不論項目是否存在集合中，傳回布林值。

{1>typescript if (set.has("two")) { console.log("Exists!"); } else { console.log("Does not exist!"); } <1}

---

#### {1>set.size<1}

傳回 {1>SetSchema<1} 物件中的元素數。

\`\`\`typescript const set = new SetSchema{1}(); set.add(10); set.add(20); set.add(30);

console.log(set.size); // output:3 \`\`\`

!!!注意「集合的更多可用方法」請查看 {1>MDN 文件<1}。


### CollectionSchema

!!!警告「{1>CollectionSchema<1} 只能在 JavaScript 內實作」目前為止　{2>CollectionSchema<2} 只能用於 JavaScript。尚未支援 Haxe、C#、LUA 和 C++ 用戶端。

{1>CollectionSchema<1} 的運作方式與 {2>ArraySchema<2} 相似，請警惕，你無法控制其索引。

\`\`\`typescript fct\_label="TypeScript" import { Schema, CollectionSchema, type } from "@colyseus/schema";

class Item extends Schema { @type("number") damage: number; }

class Player extends Schema { @type({ collection:Item }) items = new CollectionSchema{1}(); } \`\`\`

\`\`\`typescript fct\_label="JavaScript" const schema = require('@colyseus/schema'); const Schema = schema.Schema; const CollectionSchema = schema.CollectionSchema;

class Item extends Schema { } schema.defineTypes(Item, { damage: "number", });

class Player extends Schema { constructor () { super();

        this.items = new CollectionSchema();
    }
} schema.defineTypes(Player, { items: { collection:Item } }); \`\`\`

---

#### {1>collection.add()<1}

附加項目至 {1>CollectionSchema<1} 物件。

{1>typescript const collection = new CollectionSchema<number>(); collection.add(1); collection.add(2); collection.add(3); <1}

---

#### {1>collection.at()<1}

在指定的{1>索引<1}取得項目。

\`\`\`typescript const collection = new CollectionSchema{1}(); collection.add("one"); collection.add("two"); collection.add("three");

collection.at(1); // output: "two" \`\`\`

---

#### {1>collection.delete()<1}

依項目的值將其刪除。

{1>typescript collection.delete("three"); <1}

---

#### {1>collection.has()<1}

不論項目是否存在集合中，傳回布林值。

{1>typescript if (collection.has("two")) { console.log("Exists!"); } else { console.log("Does not exist!"); } <1}

---

#### {1>collection.size<1}

在 {1>CollectionSchema<1} 物件內傳回元素數。

\`\`\`typescript const collection = new CollectionSchema{1}(); collection.add(10); collection.add(20); collection.add(30);

console.log(collection.size); // output:3 \`\`\`

---

#### {1>collection.forEach()<1}

{1>forEach()<1} 方法依插入順序對 {2>CollectionSchema<2} 物件中的每個索引/值對執行一次提供的函式。

{1>typescript collection.forEach((value, at) => { console.log("at =>", at) console.log("value =>", value) }); <1}

## Filtering data per client

!!!警告「此功能為實驗性」{1>@filter()<1}/{2>@filterChildren()<2} 為實驗性功能，且可能未對快節奏的遊戲進行最佳化。

篩選代表對特定用戶端隱藏您的部分狀態以避免作弊情況，該情況為玩家決定檢查來自網路的資料和查看未篩選的狀態資訊。

資料篩選是會受{1>每個用戶端<1}和{2>每個欄位<2}觸發的回調。（在 {3>@filterChildren<3} 得情況下，是每個子結構）。如果篩選回調傳回 {4>true<4}，則會未該特定用戶端傳送欄位資料，否則則不會為其傳送資料。

請注意，如果篩選函式相依性變更，則篩選函式不會自動重新執行，但只在篩選的欄位或其子項目已更新的情況下。查看{1>這個問題<1}以瞭解因應措施。

### {1>@filter()<1} 屬性裝飾項目

{1>@filter()<1} 屬性裝飾項目可用於篩選整個結構描述欄位。

以下為 {1>@filter()<1} 簽署的形式：

\`\`\`typescript fct\_label="TypeScript" class State extends Schema { @filter(function(client, value, root) { // client is: // // the current client that's going to receive this data. you may use its // client.sessionId, or other information to decide whether this value is // going to be synched or not.

        // value is:
        // the value of the field @filter() is being applied to

        // root is:
        // the root instance of your room state. you may use it to access other
        // structures in the process of decision whether this value is going to be
        // synched or not.
    })
    @type("string") field: string;
} \`\`\`

\`\`\`typescript fct\_label="JavaScript" const schema = require('@colyseus/schema'); class State extends schema.Schema {}

schema.defineTypes(State, { field: "string" });

schema.filter(function(client, value, root) { // client is: // // the current client that's going to receive this data. you may use its // client.sessionId, or other information to decide whether this value is // going to be synched or not.

    // value is:
    // the value of the field @filter() is being applied to

    // root is:
    // the root instance of your room state. you may use it to access other
    // structures in the process of decision whether this value is going to be
    // synched or not.
    return true;
})(State.prototype, "field"); \`\`\`

### {1>@filterChildren()<1} property decorator

{1>@filterChildren()<1} 屬性裝飾項目可用於篩選陣列、地圖、集合等內的項目。其簽署與 {2>@filter()<2} 非常相似，只是在代表 {5>ArraySchema<5}、{6>MapSchema<6}、{7>CollectionSchema<7} 等內每個項目的{4>值<4}前多了{3>索引鍵<3}參數。

\`\`\`typescript fct\_label="TypeScript" class State extends Schema { @filterChildren(function(client, key, value, root) { // 用戶端為：// // 要接收此資料的目前用戶端。你可以使用其 // client.sessionId 或其他資訊以決定此值是否 // 要進行同步。

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
} \`\`\`

\`\`\`typescript fct\_label="JavaScript" const schema = require('@colyseus/schema'); class State extends schema.Schema {}

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
})(State.prototype, "cards"); \`\`\`

**範例：**在卡牌遊戲中，每張牌的相關資料應僅供該卡片所有人存取，或在特定情況存取（例如：卡牌已丟棄）

查看 {1>@filter()<1} 回呼簽署：

\`\`\`typescript fct\_label="TypeScript" import { Client } from "colyseus";

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
} \`\`\`

\`\`\`typescript fct\_label="JavaScript" const schema = require('@colyseus/schema');

class Card extends schema.Schema {} schema.defineTypes(Card, { owner: "string", discarded: "boolean", number: "uint8" });

/\** * 請勿在 {1>@filter<1} 內使用箭號函式 * （這會強制產生{2>這種<2}的不同範圍） \*/ schema.filter(function(client, value, root) { return this.discarded || this.owner === client.sessionId; })(Card.prototype, "number"); \`\`\`

## 用戶端

!!!警告「C#、C++、Haxe」 在使用靜態類型語言時，您必須根據自己的 TypeScript 結構描述定義來敢生用戶端結構描述檔案。{1>查看在用戶端產生結構描述<1}。

### 回呼

當在套用來自伺服器的狀態變更時，用戶端會根據套用的變更在本機執行個體上觸發回呼。

回呼會根據執行個體參考來觸發。確保將回呼附加至實際在伺服器上變更的執行個體。

- {1>onAdd (instance, key)<1}
- {1>onRemove (instance, key)<1}
- {1>onChange (changes)<1}（在{2>結構描述<2}執行個體）
- {1>onChange (instance, key)<1}（在集合：{2>MapSchema<2}、{3>ArraySchema<3} 等等）
- {1>listen()<1}

#### {1>onAdd (instance, key)<1}

{1>onAdd<1} 回呼只能用於項目集合（{2>MapSchema<2}、{3>MapSchema<3} 等等）。{4>onAdd<4} 回呼會使用新執行個體以及其在預留位置物件作為引數的索引鍵進行呼叫。

\`\`\`javascript fct\_label="JavaScript" room.state.players.onAdd = (player, key) => { console.log(player, "has been added at", key);

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
}; \`\`\`

\`\`\`lua fct\_label="LUA" room.state.players\['on\_add'] = function (player, key) print("player has been added at", key);

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
end \`\`\`

\`\`\`csharp fct\_label="C#" room.State.players.OnAdd += (Player player, string key) => { Debug.Log("player has been added at " + key);

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
}; \`\`\`

---

#### {1>onRemove (instance, key)<1}

{1>onRemove<1} 回呼只能用於 ({2>MapSchema<2}) 和陣列 ({3>ArraySchema<3})。{4>onRemove<4} 回呼會使用移除的執行個體以及其在預留位置物件作為引數的索引鍵進行呼叫。

\`\`\`javascript fct\_label="JavaScript" room.state.players.onRemove = (player, key) => { console.log(player, "has been removed at", key);

    // remove your player entity from the game world!
}; \`\`\`

\`\`\`lua fct\_label="LUA" room.state.players\['on\_remove'] = function (player, key) print("player has been removed at " .. key);

    -- remove your player entity from the game world!
end \`\`\`

\`\`\`csharp fct\_label="C#" room.State.players.OnRemove += (Player player, string key) => { Debug.Log("player has been removed at " + key);

    // remove your player entity from the game world!
}; \`\`\`

---

#### {1}onChange (changes:DataChange\[]){2}

> {1>onChange<1} 對於直接{2>結構描述<2}參考和集合結構的運作方式並不相同。對於{3>在集合結構（陣列、地圖等等）的 {4>onChange<4} 資訊，請查看這裡<3}。

您可以登錄 {1>onChange<1} 以追蹤{2>結構描述<2}執行個體的屬性變更。{3>onChange<3} 回呼使用變更的屬性以及其先前的值來進行觸發。

{1>javascript fct\_label="JavaScript" room.state.onChange = (changes) => { changes.forEach(change => { console.log(change.field); console.log(change.value); console.log(change.previousValue); }); }; <1}

{1>lua fct\_label="LUA" room.state\['on\_change'] = function (changes) for i, change in ipairs(changes) do print(change.field) print(change.value) print(change.previousValue) end end <1}

{1>csharp fct\_label="C#" room.State.OnChange += (changes) => { changes.ForEach((obj) => { Debug.Log(obj.Field); Debug.Log(obj.Value); Debug.Log(obj.PreviousValue); }); }; <1}

您無法在尚未與用戶端同步的物件上登錄 {1>onChange<1} 回呼。

---

#### {1>onChange (instance, key)<1}

> {1>onChange<1} 對於直接{2>結構描述<2}參考和集合結構的運作方式並不相同。對於 {3>{4>onChange<4} 在{5>結構描述<5}結構的資訊，請查看這裡<3}。

此回呼會在{1>基本<1}集合類型（{2>字串<2}、{3>數字<3}、{4>布林值<4}等等）更新其部分值時觸發。

{1>javascript fct\_label="JavaScript" room.state.players.onChange = (player, key) => { console.log(player, "have changes at", key); }; <1}

{1>lua fct\_label="LUA" room.state.players\['on\_change'] = function (player, key) print("player have changes at " .. key); end <1}

{1>csharp fct\_label="C#" room.State.players.OnChange += (Player player, string key) => { Debug.Log("player have changes at " + key); }; <1}

如果您要偵測{1>非基本<1}類型（保留{2>結構描述<2}執行個體）集合內的變更，請使用 {3>{4>onAdd<4}<3} 並在其中登錄 {5>{6>onChange<6}<5}。

!!!警告「`onChange`、`onAdd` 和 `onRemove` 為**專屬**」`onChange` 回呼不會在 [`onAdd`](#onadd-instance-key) 或 [`onRemove`](#onremove-instance-key)　時觸發。

    Consider registering `onAdd` and `onRemove` if you need to detect changes during these steps too.

---

#### {1>.listen(prop, callback)<1}

接聽單一屬性變更。 

> {1>.listen()<1} 目前只能用於 JavaScript/TypeScript。

{1>參數：<1}

- {1>屬性<1}：您要接聽變更的屬性名稱。
- {1>回呼<1}：在{2>屬性<2}變更時會觸發的呼叫。


{1>typescript state.listen("currentTurn", (currentValue, previousValue) => { console.log(\`currentTurn is now ${currentValue}\`); console.log(\`previous value was: ${previousValue}\`); }); <1}

{1>.listen()<1} 方法傳回代表取消登錄接聽程式的函式。


\`\`\`typescript const removeListener = state.listen("currentTurn", (currentValue, previousValue) => { // ... });

// 如果您稍後不再需要接聽程式，您可以呼叫 {1>removeListener()<1} 以停止接聽 {2>"currentTurn"<2} 變更。removeListener(); \`\`\`

{1>{2>接聽<2}和 {3>onChange<3} 間有甚麼差異？<1}

{1>.listen()<1} 方法是{2>onChange<2} 在單一屬性上的速記。以下為 

{1>typescript state.onChange = function(changes) { changes.forEach((change) => { if (change.field === "currentTurn") { console.log(\`currentTurn is now ${change.value}\`); console.log(\`previous value was: ${change.previousValue}\`); } }) } <1}

---

## 用戶端結構描述產生

{1>schema-codegen<1} 是轉換您要用於用戶端的伺服器端結構描述定義檔案的工具：

如需解碼用戶端內的狀態，其本機結構描述定義必須與伺服器內的結構描述定義相符。

!!!警告「使用 {1>JavaScript SDK<1} 時不需要」只有在用戶端使用靜態類型語言（例如 C#、Haxe 等等）時，才需要使用 {2>schema-codegen<2}。

使用方式

如需查看使用方式，請自您的終端 {1>cd<1} 進入伺服器目錄並執行以下命令：

{1> npx schema-codegen --help <1}

{1>Output:<1}

\`\`\` schema-codegen \[path/to/Schema.ts]

Usage (C#/Unity) schema-codegen src/Schema.ts --output client-side/ --csharp --namespace MyGame.Schema

Valid options: --output: fhe output directory for generated client-side schema files --csharp: generate for C#/Unity --cpp: generate for C++ --haxe: generate for Haxe --ts: generate for TypeScript --js: generate for JavaScript --java: generate for Java

Optional: --namespace: generate namespace on output code \`\`\`

### 範例：Unity / C# 

以下是自{1>示範 Unity 專案<1}產生 C# 結構描述檔案的真實範例。

{1} npx schema-codegen src/rooms/schema/* --csharp --output ../Assets/Scripts/States/" generated:Player.cs generated:State.cs {2}

**使用 `npm` 指令碼：**

簡而言之，建議讓您的 {1>schema-codegen<1} 引數在{3>package.json<3} 內的 {2>npm<2} 指令碼下進行設定：
    
{1>json "scripts": { "schema-codegen": "schema-codegen src/rooms/schema/* --csharp --output ../Assets/Scripts/States/" } <1}

這樣您就能執行 {1>npm run schema-codegen<1} 而不是整個命令：

{1} npm run schema-codegen generated:Player.cs generated:State.cs {2}

### 版本管理和向前/向後傳遞相容性

透過在現有結構末端宣告新欄位，可能實現向前/向後傳遞相容性，且不會移除早期宣告，但在有需要時會標記 {1>@deprecated()<1}。查看以下的版本管理範例。

\`\`\`typescript fct\_label="Live version 1" import { Schema, type, deprecated } from "@colyseus/schema";

class MyState extends Schema { @type("string") myField: string; } \`\`\`

\`\`\`typescript fct\_label="Live version 2" import { Schema, type, deprecated } from "@colyseus/schema";

class MyState extends Schema { // Flag field as deprecated. @deprecated() @type("string") myField: string;

    // To allow your server to play nicely with multiple client-side versions.
    @type("string") newField: string; 
} \`\`\`

\`\`\`typescript fct\_label="Live version 3" import { Schema, type, deprecated } from "@colyseus/schema";

class MyState extends Schema { // Flag field as deprecated. @deprecated() @type("string") myField: string;

    // Flag field as deprecated again.
    @deprecated() @type("string") newField: string; 

    // New fields always at the end of the structure
    @type("string") anotherNewField: string;
} \`\`\`

這對原生編譯目標特別實用，像是用戶端可能沒有結構描述定義最新版本的 C#、C++、Haxe 等等。

---

## 限制和最佳做法

- 每個{1>結構描述<1}結構能保留最多 {2>64<2} 個欄位。如果您需要更多欄位，請使用巢狀{3>結構描述<3}結構。
- {1>NaN<1} 或 {2>null<2} 數字編碼為 {3>0<3}
- {1>null<1} 字串編碼為 {2>""<2}
- {1>無限<1}數字編碼為 {2>Number.MAX\_SAFE\_INTEGER<2}
- 不支援多維陣列。{1>查看如何使用 1D 陣列作為多維<1}
- {1>@colyseus/schema<1} 編碼順序是根據欄位定義順序。
    - 編碼器（伺服器）和解碼器（用戶端）都必須具有相同結構描述定義。
    - 欄位的順序必須相同。

### 集合

集合類型（{1>ArraySchema<1}、{2>MapSchema<2} 等等）必須保留相同類型的項目，或共享相同的基底類型。

{1>以下範例受支援：<1}

\`\`\`typescript class Item extends Schema {/* base Item fields {1>/} class Weapon extends Item {/<1} specialized Weapon fields {2>/} class Shield extends Item {/<2} specialized Shield fields \*/}

class Inventory extends Schema { @type({ map:Item }) items = new MapSchema{1}(); }

const inventory = new Inventory(); inventory.set("left", new Weapon()); inventory.set("right", new Shield()); \`\`\`

### 基本類型

| 類型 | 說明 | 限制 | |------|-------------|------------| | {1>「字串」<1} | utf8 字串 | {2>4294967295<2} 的位元組上限 | | {3>「數字」<3} | 也稱為「變數」。自動偵測要使用的數字類型。（在編碼時可能會使用一額外位元組）| {4>0<4} 到 {5>18446744073709551615<5} | | {6>"boolean"<6} | {7>true<7} 或 {8>false<8} | {9>0<9} 或 {10>1<10} | | {11>"int8"<11} | 帶正負號的 8 位元整數 | {12>-128<12} 到 {13>127<13} | | {14>"uint8"<14} | 無正負號的 8 位元整數 | {15>0<15} 到 {16>255<16} | | {17>"int16"<17} | 帶正負號的 16 位元整數 | {18>-32768<18} 到 {19>32767<19} | | {20>"uint16"<20} | 無正負號的 16 位元整數 | {21>0<21} 到 {22>65535<22} | | {23>"int32"<23} | 帶正負號的 32 位元整數 | {24>-2147483648<24} 到 {25>2147483647<25} | | {26>"uint32"<26} | 無正負號的 32 位元整數 | {27>0<27} 到 {28>4294967295<28} | | {29>"int64"<29} | 帶正負號的 64 位元整數 | {30>-9223372036854775808<30} 到 {31>9223372036854775807<31} | | {32>"uint64"<32} | 無正負號的 64 位元整數 | {33>0<33} 到 {34>18446744073709551615<34} | | {35>"float32"<35} | 單精確度浮點數 | {36>-3.40282347e+38<36} 到 {37>3.40282347e+38<37}| | {38>"float64"<38} | 雙精確度浮點數 | {39>-1.7976931348623157e+308<39} 到 {40>1.7976931348623157e+308<40} |