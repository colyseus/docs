# {1>状态同步<1} »架构

!!!提示：“还没使用 TypeScript 吗？” 强烈建议您使用 TypeScript 以便更好地定义架构结构并提高整体开发体验。TypeScript 支持在此部分中大量使用的“实验性修饰器”。

## 如何定义可同步结构

- {1>Schema<1} 结构由服务器定义，用于房间状态。 
- 只有以 {1>@type()<1} 修饰的字段才被考虑用于同步。 
- {1>(可同步架构结构应当仅用于与您的状态相关的数据。)<1}

### 定义 {1>Schema<1} 结构

\`\`\`typescript fct\_label="TypeScript" // MyState.ts import { Schema, type } from "@colyseus/schema";

export class MyState extends Schema { @type("string") currentTurn: string; } \`\`\`

\`\`\`typescript fct\_label="JavaScript" // MyState.ts const schema = require('@colyseus/schema'); const Schema = schema.Schema;

class MyState extends Schema { } schema.defineTypes(MyState, { currentTurn: "string" }); \`\`\`

!!!提示："{1}"这个 {2>@type()<2} 关键字是什么？我之前从未见过！"{3}"您看见的在本页大量使用的 {4>@type()<4} 是一个即将推出的 JavaScript 功能，还没有被 TC39 正式认可。{5>type<5} 其实只是一个从 {6>@colyseus/schema<6} 模块导入的功能。在属性层级调用带有 {8>@<8} 前缀的 {7>类型<7}，意味着我们将其作为一个{9>属性修饰器<9}进行调用。{10>在这里查看修饰器方案<10}。 

### 在您的 {1>Room<1} 内使用状态

\`\`\`typescript // MyRoom.ts import { Room } from "colyseus"; import { MyState } from "./MyState";

export class MyRoom extends Room{1} { onCreate() { this.setState(new MyState()); } } \`\`\`


## 处理架构

- 只有服务器端负责处理变异架构结构
- 客户端必须拥有通过 {2>{3>schema-codegen<3}<2} 生成的相同的 {1>Schema<1} 定义。{4>(如果您在使用 {5>JavaScript SDK<5} 则为可选)<4}
- 为了从服务器获得更新，您需要{1>将架构的回调附加在客户端内<1}。
- 客户端永远不该在架构上执行变异 - 因为在收到下一个来自服务器的更改时，它们就会被立刻替换。

### 原始类型

原始类型为数字、字符串和布尔值。 

| Type | Description | Limitation | |------|-------------|------------| | {1>"string"<1} | utf8 strings | maximum byte size of {2>4294967295<2} | | {3>"number"<3} | 也称为“变体”。自动检测使用的数字类型（编码时可能使用一个额外的字节） | {4>0<4} to {5>18446744073709551615<5} | | {6>"boolean"<6} | {7>true<7} or {8>false<8} | {9>0<9} or {10>1<10} |

{1>Specialized number types:<1}

| Type | Description | Limitation | |------|-------------|------------| | {1>"int8"<1} | signed 8-bit integer | {2>-128<2} to {3>127<3} | | {4>"uint8"<4} | unsigned 8-bit integer | {5>0<5} to {6>255<6} | | {7>"int16"<7} | signed 16-bit integer | {8>-32768<8} to {9>32767<9} | | {10>"uint16"<10} | unsigned 16-bit integer | {11>0<11} to {12>65535<12} | | {13>"int32"<13} | signed 32-bit integer | {14>-2147483648<14} to {15>2147483647<15} | | {16>"uint32"<16} | unsigned 32-bit integer | {17>0<17} to {18>4294967295<18} | | {19>"int64"<19} | signed 64-bit integer | {20>-9223372036854775808<20} to {21>9223372036854775807<21} | | {22>"uint64"<22} | unsigned 64-bit integer | {23>0<23} to {24>18446744073709551615<24} | | {25>"float32"<25} | single-precision floating-point number | {26>-3.40282347e+38<26} to {27>3.40282347e+38<27}| | {28>"float64"<28} | double-precision floating-point number | {29>-1.7976931348623157e+308<29} to {30>1.7976931348623157e+308<30} |


### 复杂类型

复杂类型由其他架构实例中的 {1>Schema<1} 实例组成。它们也可以包含 {2>项目集合<2}(数组、地图等)。

\`\`\`typescript fct\_label="TypeScript" import { Schema, type } from "@colyseus/schema";

class World extends Schema { @type("number") width: number; @type("number") height: number; @type("number") items: number = 10; }

class MyState extends Schema { @type(World) world:World = new World(); } \`\`\`

\`\`\`typescript fct\_label="JavaScript" const schema = require('@colyseus/schema'); const Schema = schema.Schema;

class World extends Schema { } schema.defineTypes(World, { width: "number", height: "number", items: "number" });

class MyState extends Schema { constructor () { super();

        this.world = new World();
    }
} schema.defineTypes(MyState, { world:World }); \`\`\`

## 项目集合

### ArraySchema

{1>ArraySchema<1} 是一个可同步版本的内置 JavaScript {2>Array<2} 类型。

示例自定义 {2>Schema<2} 类型{3}的数组

\`\`\`typescript fct\_label="TypeScript" import { Schema, ArraySchema, type } from "@colyseus/schema";

class Block extends Schema { @type("number") x: number; @type("number") y: number; }

class MyState extends Schema { @type(\[ Block ]) blocks = new ArraySchema{1}(); } \`\`\`

\`\`\`typescript fct\_label="JavaScript" const schema = require('@colyseus/schema'); const Schema = schema.Schema; const ArraySchema = schema.ArraySchema;

class Block extends Schema { } schema.defineTypes(Block, { x: "number", y: "number" });

class MyState extends Schema { constructor () { super();

        this.blocks = new ArraySchema();
    }
} schema.defineTypes(MyState, { blocks: \[ Block ], }); \`\`\`

示例原始类型{2}的数组

您无法将类型混合进数组中。

\`\`\`typescript fct\_label="TypeScript" import { Schema, ArraySchema, type } from "@colyseus/schema";

class MyState extends Schema { @type(\[ "string" ]) animals = new ArraySchema{1}(); } \`\`\`

\`\`\`typescript fct\_label="JavaScript" const schema = require('@colyseus/schema'); const Schema = schema.Schema; const ArraySchema = schema.ArraySchema;

class MyState extends Schema { constructor () { super();

        this.animals = new ArraySchema();
    }
} schema.defineTypes(MyState, { animals: \[ "string" ], }); \`\`\`

---

#### {1>array.push()<1}

在一个数组后面添加一个或多个元素，并返回该数组的新长度。

{1}typescript const animals = new ArraySchema<string>(); animals.push("pigs", "goats"); animals.push("sheeps"); animals.push("cows"); // output:{1}

---

#### {1>array.pop()<1}

移除一个数组的最后一个元素并返回该元素。该方法可以更改数组的长度。

\`\`\`typescript animals.pop(); // output: "cows"

animals.length // output:3 \`\`\`

---

#### {1>array.shift()<1}

移除一个数组的第一个元素并返回被移除的元素。该方法可以更改数组的长度。

\`\`\`typescript animals.shift(); // output: "pigs"

animals.length // output:2 \`\`\`

---

#### {1>array.unshift()<1}

在一个数组的开头添加一个或更多元素并返回该数组的新长度。

{1}typescript animals.unshift("pigeon"); // output:{1}

---

#### {1>array.indexOf()<1}

返回数组中可以找到的一个给定元素的第一个索引，如果不存在则为 -1

{1>typescript const itemIndex = animals.indexOf("sheeps"); <1}

---

#### {1>array.splice()<1}

通过移除或替换现有元素并/或{1>在适当的位置<1}添加新元素的方式来更改一个数组的内容。

\`\`\`typescript // find the index of the item you'd like to remove const itemIndex = animals.findIndex((animal) => animal === "sheeps");

// remove it! animals.splice(itemIndex, 1); \`\`\`

---

#### {1>array.forEach()<1}

迭代数组的每个元素。

\`\`\`typescript fct\_label="TypeScript" this.state.array1 = new ArraySchema{1}('a', 'b', 'c');

this.state.array1.forEach(element => { console.log(element); }); // output: "a" // output: "b" // output: "c" \`\`\`

{1>csharp fct\_label="C#" State.array1.ForEach((value) => { Debug.Log(value); }) <1}

{1>lua fct\_label="LUA" state.array1:each(function(value, index) print(index, "=>") pprint(value) end) <1}

{1>lua fct\_label="Haxe" for (index => value in state.array1) { trace(index + " => " + value); } <1}

!!!备注：“Array有更多方法可用” 查看{1>MDN 文档<1}。

### MapSchema

{1>MapSchema<1} 是一个可同步版本的内置 JavaScript {2>Array<2} 类型。

推荐使用 Maps 来通过 id 追踪您的游戏实体，比如玩家、敌人等。

!!!警告：“当前仅支持字符串键” 目前，{1>MapSchema<1} 仅允许您自定义值的类型。秘钥类型始终为 {2>字符串<2}。

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

通过秘钥来获取地图项：

{1>typescript const map = new MapSchema<string>(); const item = map.get("key"); <1}

或

{1>typescript // // NOT RECOMMENDED // // This is a compatibility layer with previous versions of @colyseus/schema // This is going to be deprecated in the future. // const item = map\["key"]; <1}

---

#### {1>map.set()<1}

通过秘钥来设置一个地图项：

{1>typescript const map = new MapSchema<string>(); map.set("key", "value"); <1}

或

{1>typescript // // NOT RECOMMENDED // // This is a compatibility layer with previous versions of @colyseus/schema // This is going to be deprecated in the future. // map\["key"] = "value"; <1}

---

#### {1>map.delete()<1}

通过秘钥来移除一个地图项：

{1>typescript map.delete("key"); <1}

或

{1>typescript // // NOT RECOMMENDED // // This is a compatibility layer with previous versions of @colyseus/schema // This is going to be deprecated in the future. // delete map\["key"]; <1}

---

#### {1>map.size<1}

在一个 {1>MapSchema<1} 对象中返回元素的数量。

\`\`\`typescript const map = new MapSchema{1}(); map.set("one", 1); map.set("two", 2);

console.log(map.size); // output:2 \`\`\`

---

#### {1>map.forEach()<1}

迭代地图的每对秘钥/值，按照插入顺序。

{1>typescript fct\_label="TypeScript" this.state.players.forEach((value, key) => { console.log("key =>", key) console.log("value =>", value) }); <1}

{1>csharp fct\_label="C#" State.players.ForEach((key, value) => { Debug.Log(key); Debug.Log(value); }) <1}

{1>lua fct\_label="LUA" state.players:each(function(value, key) print(key, "=>") pprint(value) end) <1}

{1>lua fct\_label="Haxe" for (key => value in state.players) { trace(index + " => " + value); } <1}

!!!备注：“Map 有更多方法可用”  查看{1>MDN 文档<1}。


### SetSchema

!!!警告：“{1>SetSchema<1} 仅在 JavaScript 中实现”目前 {2>SetSchema<2} 只能与 JavaScript 一同使用。尚不支持 Haxe、C#、LUA 和 C++ 客户端。

{1>SetSchema<1} 是一个可同步版本的内置 JavaScript {2>Set<2} 类型。

{1>SetSchema<1} 的用法和 \[\`CollectionSchema\`] 十分类似，最大区别在于 Sets 拥有独特的值。Sets 没有直接访问值的方法。（如{2>collection.at()<2}）

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

将一个项附加至 {1>SetSchema<1} 对象。

{1>typescript const set = new CollectionSchema<number>(); set.add(1); set.add(2); set.add(3); <1}

---

#### {1>set.at()<1}

在特定{1>索引<1}中获取一个项。

\`\`\`typescript const set = new CollectionSchema{1}(); set.add("one"); set.add("two"); set.add("three");

set.at(1); // output: "two" \`\`\`

---

#### {1>set.delete()<1}

按项的值删除项。

{1>typescript set.delete("three"); <1}

---

#### `set.has()`

返回一个布尔值，无论该项是否存在于 Collection 中。

{1>typescript if (set.has("two")) { console.log("Exists!"); } else { console.log("Does not exist!"); } <1}

---

#### {1>set.size<1}

在一个 {1>SetSchema<1} 对象中返回元素的数量。

\`\`\`typescript const set = new SetSchema{1}(); set.add(10); set.add(20); set.add(30);

console.log(set.size); // output:3 \`\`\`

!!!备注：“Set 有更多方法可用”  查看 {1>MDN 文档<1}。


### CollectionSchema

!!!警告：“{1>CollectionSchema<1} 仅在 JavaScript 中实现”目前 {2>CollectionSchema<2} 只能与 JavaScript 一同使用。尚不支持 Haxe、C#、LUA 和 C++ 客户端。

{1>CollectionSchema<1} 的运作方式与 {2>ArraySchema<2} 类似，需要注意的是，您无法控制它的索引。

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

将一个项附加至 {1>CollectionSchema<1} 对象。

{1>typescript const collection = new CollectionSchema<number>(); collection.add(1); collection.add(2); collection.add(3); <1}

---

#### {1>collection.at()<1}

在特定{1>索引<1}中获取一个项。

\`\`\`typescript const collection = new CollectionSchema{1}(); collection.add("one"); collection.add("two"); collection.add("three");

collection.at(1); // output: "two" \`\`\`

---

#### {1>collection.has()<1}

按项的值删除项。

{1>typescript collection.delete("three"); <1}

---

#### {1>collection.has()<1}

返回一个布尔值，无论该项是否存在于 Collection 中。

{1>typescript if (collection.has("two")) { console.log("Exists!"); } else { console.log("Does not exist!"); } <1}

---

#### {1>collection.size<1}

在一个 {1>CollectionSchema<1} 对象中返回元素的数量。

\`\`\`typescript const collection = new CollectionSchema{1}(); collection.add(10); collection.add(20); collection.add(30);

console.log(collection.size); // output:3 \`\`\`

---

#### {1>collection.forEach()<1}

{1>forEach()<1} 方法会为 {2>CollectionSchema<2} 对象中每对索引/值执行一次给定功能，按插入顺序。

{1>typescript collection.forEach((value, at) => { console.log("at =>", at) console.log("value =>", value) }); <1}

## 每个客户端过滤数据

!!!警告：“此功能为实验性质”{1>@filter()<1}/{2>@filterChildren()<2} 为实验性质，可能不适合快节奏游戏。

过滤意味着对一个特定客户端隐藏您的部分状态，避免作弊，防止一名玩家因决定检查来自网络的数据而看到未过滤的状态信息。

数据过滤器为回调，会在 {1>per client<1} 和 {2>per field<2} 触发（如果 {3>@filterChildren<3}，则为每个子结构）。如果过滤器回调返回 {4>true<4}，该字段数据将会发送给那个特定客户端，否则，该数据将不会发送给该客户端。

请注意，如果过滤器功能的依赖项发生改变，将无法自动重新运行，但仅限于过滤字段（或其子字段）被更新时。查看{1>此问题<1}的替代方法。

### {1>@filter()<1} 属性修饰器

{1>@filter()<1} 属性修饰器可用于过滤掉整个 Schema 字段。

看看 {1>@filter()<1} 签名是什么样子的：

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

### {1>@filterChildren()<1} 属性修饰器

{1>@filterChildren()<1} 属性修饰器可用于过滤掉数组、地图、集合等内的项目。它的签名与 {2>@filter()<2} 基本相同，但是在 {4>value<4} 之前添加了 {3>key<3} 参数 - 表示 {5>ArraySchema<5}、{6>MapSchema<6}、{7>CollectionSchema<7} 等中的每个项目。

\`\`\`typescript fct\_label="TypeScript" class State extends Schema { @filterChildren(function(client, key, value, root) { // client is: // // the current client that's going to receive this data. you may use its // client.sessionId, or other information to decide whether this value is // going to be synched or not.

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

schema.filterChildren(function(client, key, value, root) { // client is: // // the current client that's going to receive this data. you may use its // client.sessionId, or other information to decide whether this value is // going to be synched or not.

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

**示例**在卡片游戏中，应该仅有卡片的持有者知道每个卡片的相关数据，或者在特定条件下知道这些数据（例如，卡片被丢弃）

查看 {1>@filter()<1} 回调签名：

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

/\** * DO NOT USE ARROW FUNCTION INSIDE {1>@filter<1} * (IT WILL FORCE A DIFFERENT {2>this<2} SCOPE) \*/ schema.filter(function(client, value, root) { return this.discarded || this.owner === client.sessionId; })(Card.prototype, "number"); \`\`\`

## 客户端

!!!警告："C#, C++, Haxe" 在使用静入语言时，需要在您的 Typescript 架构定义基础上 生成客户端架构文件。{1>查看在客户端生成架构<1}。

### 回调

当应用来自服务器的状态更改时，客户端将根据正在应用的更改触发本地实例上的回调。

将根据实例引用触发回调。应确保在服务器上实际发生变化的实例上附加回调。

- {1>onAdd (instance, key)<1}
- {1>onRemove (instance, key)<1}
- {1>onChange (changes)<1} (on {2>Schema<2} instance)
- {1>onChange (instance, key)<1} (on collections:{2>MapSchema<2}, {3>ArraySchema<3}, etc.)
- {1>listen()<1}

#### {1>onAdd (instance, key)<1}

只能在 ({2>MapSchema<2}、{3>MapSchema<3} 等)项目集合中使用 {1>onAdd<1} 回调。使用新实例调用 {4>onAdd<4} 回调，并且使用持有者对象中的秘钥作为参数。

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

只能在  ({2>MapSchema<2}) 映射和 ({3>ArraySchema<3}) 数组中使用 {1>onRemove<1} 回调。使用已移除实例调用 {4>onAdd<4} 回调，并且使用持有者对象中的秘钥作为参数。

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

> {1>onChange<1} works differently for direct {2>Schema<2} references and 对于直接 {2>Schema<2} 引用和集合结构，{1>onChange<1} 的工作方式各不相同。对于 {3>{4>onChange<4} 集合结构（数组，映射等）的 {3>{4>onChange<4}，请查看这里<3}。

可以注册 {1>onChange<1}，以跟踪 {2>Schema<2} 实例的属性变更。使用已变更的属性及其以先前值触发 {3>onChange<3} 回调。

{1>javascript fct\_label="JavaScript" room.state.onChange = (changes) => { changes.forEach(change => { console.log(change.field); console.log(change.value); console.log(change.previousValue); }); }; <1}

{1>lua fct\_label="LUA" room.state\['on\_change'] = function (changes) for i, change in ipairs(changes) do print(change.field) print(change.value) print(change.previousValue) end end <1}

{1>csharp fct\_label="C#" room.State.OnChange += (changes) => { changes.ForEach((obj) => { Debug.Log(obj.Field); Debug.Log(obj.Value); Debug.Log(obj.PreviousValue); }); }; <1}

不能为还没有与客户端同步的对象注册 {1>onChange<1} 回调。

---

#### {1>onChange (instance, key)<1}

> {1>onChange<1} works differently for direct {2>Schema<2} references and 对于直接 {2>Schema<2} 引用和集合结构，{1>onChange<1} 的工作方式各不相同。对于 {5>Schema<5} 结构的 {3>{4>onChange<4}，请查看这里<3}。

当 {1>primitive<1} 集合类型 ({2>string<2}, {3>number<3}, {4>boolean<4}, 等) 更新其部分值时，将触发此回调。

{1>javascript fct\_label="JavaScript" room.state.players.onChange = (player, key) => { console.log(player, "have changes at", key); }; <1}

{1>lua fct\_label="LUA" room.state.players\['on\_change'] = function (player, key) print("player have changes at " .. key); end <1}

{1>csharp fct\_label="C#" room.State.players.OnChange += (Player player, string key) => { Debug.Log("player have changes at " + key); }; <1}

如果想要检测 {1>non-primitive<1} 集合类型（保留 {2>Schema<2} 实例），请使用 {3>{4>onAdd<4}<3} 并且为它们注册 {5>{6>onChange<6}<5}。

!!!警告："`onChange`、`onAdd` 和 `onRemove` 是**互斥的**"  `onChange` 回调在 [`onAdd`](#onadd-instance-key) 或 [`onRemove`](#onremove-instance-key) 期间不会触发。

    Consider registering `onAdd` and `onRemove` if you need to detect changes during these steps too.

---

#### {1>.listen(prop, callback)<1}

侦听单个属性变更。 

> {1>.listen()<1} 目前仅可用于 JavaScript/TypeScript。

{1>Parameters:<1}

- {1>property<1}:  想要侦听其变化的属性名称。
- {1>callback<1}: 当 {2>property<2} 变更时将会触发的回调。


{1>typescript state.listen("currentTurn", (currentValue, previousValue) => { console.log(\`currentTurn is now ${currentValue}\`); console.log(\`previous value was: ${previousValue}\`); }); <1}

{1>.listen()<1} 返回一个函数， 用于取消注册侦听器


\`\`\`typescript const removeListener = state.listen("currentTurn", (currentValue, previousValue) => { // ... });

// later on, if you don't need the listener anymore, you can call {1>removeListener()<1} to stop listening for {2>"currentTurn"<2} changes. removeListener(); \`\`\`

{1>What's the difference between {2>listen<2} and {3>onChange<3}?<1}

{1>.listen()<1} 方法是单个属性 {2>onChange<2} 的简化形式。下面是 

{1>typescript state.onChange = function(changes) { changes.forEach((change) => { if (change.field === "currentTurn") { console.log(\`currentTurn is now ${change.value}\`); console.log(\`previous value was: ${change.previousValue}\`); } }) } <1}

---

## 客户端架构生成

{1>schema-codegen<1} 是一个工具，它转换服务器端架构定义文件，以便在客户使用。

要在客户端解码状态，客户端的本地架构定义必须兼容服务器端的架构定义。

!!!警告："在使用 {1>JavaScript SDK<1} 时不需要" 只有在客户端使用静态类型语言，例如  C#, Haxe 等，才需要使用 {2>schema-codegen<2}。

用法

要在终端上查看用法，请 {1>cd<1} 进入服务器目录，运行以下命令：

{1> npx schema-codegen --help <1}

{1>Output:<1}

\`\`\` schema-codegen \[path/to/Schema.ts]

Usage (C#/Unity) schema-codegen src/Schema.ts --output client-side/ --csharp --namespace MyGame.Schema

有效选项 --output: 生成的客户端架构文件的输出目录 --csharp: 用于 C#/Unity --cpp: 用于 C++ --haxe: 用于 Haxe --ts: 用于 TypeScript --js: 用于 JavaScript --java: 用于 Java

可选: --namespace: 为输出代码生成命名空间\`\`

### 示例Unity / C# 

下面是一个利用 {1>demo Unity project<1} 生成 C# 架构文件的真实示例。

{1} npx schema-codegen src/rooms/schema/* --csharp --output ../Assets/Scripts/States/" generated:生成的 Player.cs：State.cs {2}

**Using `npm` scripts:**

简而言之，建议在 {3>package.json<3} 中的 {2>npm<2}  中配置 {1>schema-codegen<1} 参数：
    
{1>json "scripts": { "schema-codegen": "schema-codegen src/rooms/schema/* --csharp --output ../Assets/Scripts/States/" } <1}

这样，就可以运行 {1>npm run schema-codegen<1}，而不必运行完整的命令

{1} npm run schema-codegen generated:生成的 Player.cs：State.cs {2}

### 版本及向后/向前兼容

通过在现有结构的末尾声明新字段，可以实现向后/向前兼容，不应删除先前的声明，而是应该根据需要将其标记为 {1>@deprecated()<1}下面是一个版本示例。

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

这对于本地编译目标语言特别有用，包括 C#、C++、Haxe 等，在这些语言中，客户端可能没有最新的架构定义版本。

---

## 限制和最佳实践

- 每个 {1>Schema<1} 结构最多可以保存 {2>64<2} 个字段。如果需要更多字段，可以使用嵌套式 {3>Schema<3} 结构。
- {1>NaN<1} 或 {2>null<2} 数字被编码为 {3>0<3}
- {1>null<1} 字符串被编码为 {2>""<2}
- {1>Infinity<1} 数字被编码为 {2>Number.MAX\_SAFE\_INTEGER<2}
- 不支持多维数组。{1>查看如何将一维数组作为多维数组使用<1}
- {1>@colyseus/schema<1} 编码顺序基于字段定义顺义。
    - 编码器（服务器）和解码器（客户端）必须具有相同的架构定义。
    - 字段的顺序必须相同。

### 集合

集合类型（{1>ArraySchema<1}、{2>MapSchema<2} 等）必须包含相同类型的项目，或共享相同的基础类型。

{1>支持以下示例：<1}

\`\`\`typescript class Item extends Schema {/* base Item fields {1>/} class Weapon extends Item {/<1} specialized Weapon fields {2>/} class Shield extends Item {/<2} specialized Shield fields \*/}

class Inventory extends Schema { @type({ map:Item }) items = new MapSchema{1}(); }

const inventory = new Inventory(); inventory.set("left", new Weapon()); inventory.set("right", new Shield()); \`\`\`

### 原始类型

| Type | Description | Limitation | |------|-------------|------------| | {1>"string"<1} | utf8 strings | maximum byte size of {2>4294967295<2} | | {3>"number"<3} | 也称为“变体”。Auto-detects the number type to use. (may use one extra byte when encoding) | {4>0<4} to {5>18446744073709551615<5} | | {6>"boolean"<6} | {7>true<7} or {8>false<8} | {9>0<9} or {10>1<10} | | {11>"int8"<11} | signed 8-bit integer | {12>-128<12} to {13>127<13} | | {14>"uint8"<14} | unsigned 8-bit integer | {15>0<15} to {16>255<16} | | {17>"int16"<17} | signed 16-bit integer | {18>-32768<18} to {19>32767<19} | | {20>"uint16"<20} | unsigned 16-bit integer | {21>0<21} to {22>65535<22} | | {23>"int32"<23} | signed 32-bit integer | {24>-2147483648<24} to {25>2147483647<25} | | {26>"uint32"<26} | unsigned 32-bit integer | {27>0<27} to {28>4294967295<28} | | {29>"int64"<29} | signed 64-bit integer | {30>-9223372036854775808<30} to {31>9223372036854775807<31} | | {32>"uint64"<32} | unsigned 64-bit integer | {33>0<33} to {34>18446744073709551615<34} | | {35>"float32"<35} | single-precision floating-point number | {36>-3.40282347e+38<36} to {37>3.40282347e+38<37}| | {38>"float64"<38} | double-precision floating-point number | {39>-1.7976931348623157e+308<39} to {40>1.7976931348623157e+308<40} |