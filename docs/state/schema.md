# [State Handling](/state/overview) » Schema

The `SchemaSerializer` has been introduced since Colyseus 0.10, and it's the default serialization method.

The `Schema` strutures are meant to be used **only for the room's state** (synchronizeable data). You do **not** need to use `Schema` and its other structures for data that's part of your algorithms that aren't synchronizeable.

## Server-side

To use the `SchemaSerializer`, you must:

- Have a state class extending the `Schema` class
- Annotate all your synchonizable properties with the `@type()` decorator
- Instantiate the state for your room (`this.setState(new MyState())`)

!!! Warning "Are you not using TypeScript?"
    Decorators [are not part of ECMAScript yet](https://github.com/tc39/proposal-decorators), so the `type` syntax on plain JavaScript is still a bit odd to use, which you can see in the "JavaScript" tab for each snippet.

```typescript fct_label="TypeScript"
import { Schema, type } from "@colyseus/schema";

class MyState extends Schema {
    @type("string")
    currentTurn: string;
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class MyState extends Schema {
}
schema.defineTypes(MyState, {
  currentTurn: "string"
});
```

### Child schema properties

You may define more custom data types inside your "root" state definition, as a direct reference, map, or array.

```typescript fct_label="TypeScript"
import { Schema, type } from "@colyseus/schema";

class World extends Schema {
    @type("number")
    width: number;

    @type("number")
    height: number;

    @type("number")
    items: number = 10;
}

class MyState extends Schema {
    @type(World)
    world: World = new World();
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

### ArraySchema

When using arrays within `State` related schema it's important to use the `ArraySchema` type.
Do not use plain arrays inside your `State` classes (those which extend `Schema`).
Using plain arrays inside your methods is ok for game logic or otherwise; but not for syncronised state members.

`ArraySchema` is recommended for describing the world map, or any collection in your game. They have all the methods available in an [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), but it's synchronizable.

```typescript fct_label="TypeScript"
import { Schema, ArraySchema, type } from "@colyseus/schema";

class Block extends Schema {
    @type("number")
    x: number;

    @type("number")
    y: number;
}

class MyState extends Schema {
    @type([ Block ])
    blocks = new ArraySchema<Block>();
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

#### Usage examples

Removing an item from `ArraySchema`

```typescript
// having a reference to the item you want to remove
const itemToRemove = this.state.blocks[3];

// find the index of the item you'd like to remove
const itemIndex = this.state.blocks.findIndex((block) => block === itemToRemove);

// remove it!
this.state.blocks.splice(itemIndex, 1);
```

### MapSchema

When using a map, it's important to use the `MapSchema` type. Do not use a plain object or the native Map type.

`MapSchema` is recommended to track your game entities by id, such as players, enemies, etc.

```typescript fct_label="TypeScript"
import { Schema, MapSchema, type } from "@colyseus/schema";

class Player extends Schema {
    @type("number")
    x: number;

    @type("number")
    y: number;
}

class MyState extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();
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

#### Usage examples

Getting the length of the `MapSchema`

```typescript
const length = Object.keys(this.state.players).length;
console.log("Map length =>", length);
```

Looping through the items of a `MapSchema`

```typescript
for (let key in this.state.players) {
  const player: Player = this.state.players[key];
  console.log(key, player);
}
```


Removing an item from a `MapSchema`:

```typescript
const keyToRemove = "player1";
delete this.state.players[keyToRemove]
```


### Experimental: Filtering out fields for specific clients

!!! Warning "This feature is experimental"
    The `@filter()` currently only works for a limited use cases, and it's not recommended for fast-paced games as it will consume too much CPU. It's only possible to filter out schema fields, it **does not work** for items inside arrays and maps.

Field filtering is useful when you want to hide portions of your state for a particular client, to avoid cheating in case a player decides to inspect data coming from the network and seeing the unfiltered state information.

**Example:** In a card game, the relevant data of each card should be available only for the owner of the card, or on certain conditions (e.g. card has been discarded)

See `@filter()` callback signature:

```typescript
import { Client } from "colyseus";

/**
 * DO NOT USE ARROW FUNCTION INSIDE `@filter`, AS IT WILL FORCE A DIFFERENT `this` SCOPE
 */

class Card extends Schema {
  @type("string") owner: string; // contains the sessionId of Card owner
  @type("boolean") discarded: boolean = false;

  @filter(function(
    this: Card, // the instance of the class `@filter` has been defined (instance of `Card`)
    client: Client, // the Room's `client` instance which this data is going to be filtered to
    value?: Card['number'], // the value of the field to be filtered. (value of `number` field)
    root?: Schema // the root state Schema instance
  ) {
    return this.discarded || this.owner === client.sessionId;
  })
  @type("uint8") number: number;
}
```

### Primitive types

These are the types you can provide for the `@type()` decorator, and their limitations.

!!! tip
    If you know exactly the range of your `number` properties, you can optimize the serialization by providing the right primitive type for it.

    Otherwise, use `"number"`, which will adds an extra byte to identify itself during serialization.


| Type | Description | Limitation |
|------|-------------|------------|
| `"string"` | utf8 strings | maximum byte size of `4294967295` |
| `"number"` | auto-detects the `int` or `float` type to be used. (adds an extra byte on output) | `0` to `18446744073709551615` |
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

### Backwards/forwards compability

Backwards/fowards compatibility is possible by declaring new fields at the end of existing structures, and earlier declarations to not be removed, but be marked `@deprecated()` when needed.

This is particularly useful for native-compiled targets, such as C#, C++, Haxe, etc - where the client-side can potentially not have the most up-to-date version of the schema definitions.

### Limitations and best practices

- `NaN` or `null` numbers are encoded as `0`
- `null` strings are encoded as `""`
- `Infinity` numbers are encoded as `Number.MAX_SAFE_INTEGER`
- Multi-dimensional arrays are not supported. [See how to use 1D arrays as multi-dimensional](https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid/212813#212813)
- Items inside Arrays and Maps must be all instance of the same type.
- `@colyseus/schema` encodes only field values in the specified order.
  - Both encoder (server) and decoder (client) must have same schema definition.
  - The order of the fields must be the same.
- Avoid manipulating indexes of an array. This result in at least `2` extra bytes for each index change. **Example:** If you have an array of 20 items, and remove the first item (through `shift()`) this means `38` extra bytes to be serialized.
- Avoid moving keys of maps. As of arrays, it adds `2` extra bytes per key move.

## Client-side

### Callbacks

You can use the following callbacks within the schema structures in the client-side to handle changes coming from the server-side.

- [onChange (changes)](#onchange-changes-datachange)
- [onAdd (instance, key)](#onadd-instance-key)
- [onRemove (instance, key)](#onremove-instance-key)
- [onChange (instance, key)](#onchange-instance-key)

!!! Warning "C#, C++, Haxe"
    When using statically typed languages, you need to generate the client-side schema files based on your TypeScript schema definitions. [See generating schema on the client-side](#client-side-schema-generation).

#### `onChange (changes: DataChange[])`

You can register the `onChange` to track a single object's property changes. The `onChange` callback is called with an array of changed properties, along with their previous value.

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

- You cannot register a `onChange` callback for objects that haven't been synchronized to the client-side yet.
- [The `onChange` works differently if used directly in an `ArraySchema` or `MapSchema`](#onchange-instance-key)

#### `onAdd (instance, key)`

The `onAdd` callback can only be used in maps (`MapSchema`) and arrays (`ArraySchema`). The `onAdd` callback is called with the added instance and its key on holder object as argument.

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

#### `onRemove (instance, key)`

The `onRemove` callback can only be used in maps (`MapSchema`) and arrays (`ArraySchema`). The `onRemove` callback is called with the removed instance and its key on holder object as argument.

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

#### `onChange (instance, key)`

When registering a `onChange` callback on a `MapSchema` or `ArraySchema` instance, you can detect whenever a object has been changed inside that container.

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

It's not possible to know exactly which properties have changed using this method. See [`onChange (changes)`](#onchange-changes-datachange) if you need to access the list of changes

!!! Warning "Important"
    The `onChange` callback is not triggered during [`onAdd`](#onadd-instance-key) or [`onRemove`](#onremove-instance-key).

    Consider registering `onAdd` and `onRemove` if you need to detect changes during these steps too.

## Client-side schema generation

This is only applicable if you're using a statically typed language such as C#, C++, or Haxe.

From your server project, you can run `npx schema-codegen` to automatically generate the client-side schema files.

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

### C# / Unity3d

Below is a real example to generate the C# schema files from the [demo Unity3d project](https://github.com/colyseus/colyseus-unity3d/tree/master/Server).

```
npx schema-codegen DemoRoom.ts --csharp --output ../Assets/
generated: Player.cs
generated: State.cs
```
