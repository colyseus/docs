# [State Sync](/state/) &raquo; Schema Definition

## How to define synchronizable structures

- `Schema` structures are defined the server-side to be used in the room state.
- Only fields decorated with `@type()` are going to be considered for synchronization.
- _(Synchronizable schema structures should only be used for data related to your state.)_

### Defining a `Schema` structure

=== "TypeScript: `MyState.ts`"

    ``` typescript
    import { Schema, type } from "@colyseus/schema";

    export class MyState extends Schema {
        @type("string") currentTurn: string;
    }
    ```

=== "JavaScript: `MyState.js`"

    ``` typescript
    const schema = require('@colyseus/schema');
    const Schema = schema.Schema;

    class MyState extends Schema {
    }
    schema.defineTypes(MyState, {
      currentTurn: "string"
    });
    ```

!!! Tip "_"What is this `@type()` keyword? I've never seen this before!"_"
    The `@type()` you see heavily used on this page is an upcoming JavaScript feature that is yet to be formally established by TC39. `type` is actually just a function imported from `@colyseus/schema` module. By calling `type` with the `@` prefix at the property level means we're calling it as a _property decorator_. [See the decorators proposal here](https://github.com/tc39/proposal-decorators). Make sure your `tsconfig.json` includes `"experimentalDecorators": true`, and `"useDefineForClassFields": false` when using target `ES2022` or higher (see [#510](https://github.com/colyseus/colyseus/issues/510#issuecomment-1507828422) for discussion).

!!! Tip "Not using TypeScript yet?"
    It is highly recommended that you use TypeScript to have a better experience defining the state schema structures, and for your development experience in general. TypeScript supports the "experimental decorators" that is heavily used on this section.

### Using the state within your `Room`

=== "`MyRoom.ts`"

``` typescript
import { Room } from "colyseus";
import { MyState } from "./MyState";

export class MyRoom extends Room<MyState> {
    state = new MyState()
}
```

### Primitive types

Primitive types are numbers, strings and boolean.

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


### Complex types

Complex types consist of `Schema` instances within other schema instances. They can also contain [collections of items](#collections-of-items) (array, map, etc.).

=== "TypeScript"

    ``` typescript
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

=== "JavaScript"

    ``` typescript
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

## Collections of items

Collections can hold multiple items that share the same type. Inheritance of
`Schema` instances is supported.

Collections available:

- [`ArraySchema`](#arrayschema)
- [`MapSchema`](#mapschema)
- [`SetSchema`](#setschema)
- [`CollectionSchema`](#collectionschema)

### ArraySchema

The `ArraySchema` is a synchronizeable version of the built-in JavaScript [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) type.

**Example: Array of custom `Schema` type**

=== "TypeScript"

    ``` typescript
    import { Schema, ArraySchema, type } from "@colyseus/schema";

    class Block extends Schema {
        @type("number") x: number;
        @type("number") y: number;
    }

    class MyState extends Schema {
        @type([ Block ]) blocks = new ArraySchema<Block>();
    }
    ```

=== "JavaScript"

    ``` typescript
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

**Example: Array of a primitive type**

You can't mix types inside arrays.

=== "TypeScript"

    ``` typescript
    import { Schema, ArraySchema, type } from "@colyseus/schema";

    class MyState extends Schema {
        @type([ "string" ]) animals = new ArraySchema<string>();
    }
    ```

=== "JavaScript"

    ``` typescript
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

Adds one or more elements to the end of an array and returns the new length of the array.

``` typescript
const animals = new ArraySchema<string>();
animals.push("pigs", "goats");
animals.push("sheeps");
animals.push("cows");
// output: 4
```

---

#### `array.pop()`

Removes the last element from an array and returns that element. This method changes the length of the array.

``` typescript
animals.pop();
// output: "cows"

animals.length
// output: 3
```

---

#### `array.shift()`

Removes the first element from an array and returns that removed element. This method changes the length of the array.

``` typescript
animals.shift();
// output: "pigs"

animals.length
// output: 2
```

---

#### `array.unshift()`

Adds one or more elements to the beginning of an array and returns the new length of the array.

``` typescript
animals.unshift("pigeon");
// output: 3
```

---

#### `array.indexOf()`

Returns the first index at which a given element can be found in the array, or -1 if it is not present

``` typescript
const itemIndex = animals.indexOf("sheeps");
```

---

#### `array.splice()`

Changes the contents of an array by removing or replacing existing elements and/or adding new elements [in place](https://en.wikipedia.org/wiki/In-place_algorithm).

``` typescript
// find the index of the item you'd like to remove
const itemIndex = animals.findIndex((animal) => animal === "sheeps");

// remove it!
animals.splice(itemIndex, 1);
```

---

#### `array.forEach()`

Iterates over each element of the array.

=== "TypeScript"

    ``` typescript
    this.state.array1 = new ArraySchema<string>('a', 'b', 'c');

    this.state.array1.forEach(element => {
        console.log(element);
    });
    // output: "a"
    // output: "b"
    // output: "c"
    ```

=== "C#"

    ``` csharp
    State.array1.ForEach((value) => {
        Debug.Log(value);
    })
    ```

=== "Lua"

    ``` lua
    state.array1:each(function(value, index)
        print(index, "=>")
        pprint(value)
    end)
    ```

=== "Haxe"

    ``` lua
    for (index => value in state.array1) {
        trace(index + " => " + value);
    }
    ```

!!! Note "More methods available for Array"
    Have a look at the [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/).

---

#### `array.clear()`

Empties the array. (Client-side will trigger `onRemove` for each element.)

---

### MapSchema

The `MapSchema` is a synchronizeable version of the built-in JavaScript [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) type.

Maps are recommended to track your game entities by id, such as players, enemies, etc.

!!! Warning "Only string keys are supported at the moment"
    Currently, the `MapSchema` only allows you to customize the value type. The key type is always `string`.

=== "TypeScript"

    ``` typescript
    import { Schema, MapSchema, type } from "@colyseus/schema";

    class Player extends Schema {
        @type("number") x: number;
        @type("number") y: number;
    }

    class MyState extends Schema {
        @type({ map: Player }) players = new MapSchema<Player>();
    }
    ```

=== "JavaScript"

    ``` typescript
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

Getting a map item by its key:

``` typescript
const map = new MapSchema<string>();
const item = map.get("key");
```

---

#### `map.set()`

Setting a map item by key:

``` typescript
const map = new MapSchema<string>();
map.set("key", "value");
```

---

#### `map.delete()`

Removes a map item by key:

``` typescript
map.delete("key");
```

---

#### `map.size`

Return the number of elements in a `MapSchema` object.

``` typescript
const map = new MapSchema<number>();
map.set("one", 1);
map.set("two", 2);

console.log(map.size);
// output: 2
```

---

#### `map.forEach()`

Iterates over each key/value pair of the map, in insertion order.

=== "TypeScript"

    ``` typescript
    this.state.players.forEach((value, key) => {
        console.log("key =>", key)
        console.log("value =>", value)
    });
    ```

=== "C#"

    ``` csharp
    State.players.ForEach((key, value) => {
        Debug.Log(key);
        Debug.Log(value);
    })
    ```

=== "Lua"

    ``` lua
    state.players:each(function(value, key)
        print(key, "=>")
        pprint(value)
    end)
    ```

=== "Haxe"

    ``` lua
    for (key => value in state.players) {
        trace(index + " => " + value);
    }
    ```

!!! Note "More methods available for Map"
     Have a look at the [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/).

---

#### `map.clear()`

Empties the Map. (Client-side will trigger `onRemove` for each element.)

---

### SetSchema

!!! Warning "`SetSchema` is only implemented in JavaScript"
    The `SetSchema` can only be used with JavaScript so far. Haxe, C#, Lua and C++ clients are not supported yet.

The `SetSchema` is a synchronizeable version of the built-in JavaScript [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) type.

The usage of `SetSchema` is very similar to [`CollectionSchema`], the biggest difference is that Sets hold unique values. Sets do not have a way to access a value directly. (like [collection.at()](#collectionat))

=== "TypeScript"

    ``` typescript
    import { Schema, SetSchema, type } from "@colyseus/schema";

    class Effect extends Schema {
        @type("number") radius: number;
    }

    class Player extends Schema {
        @type({ set: Effect }) effects = new SetSchema<Effect>();
    }
    ```

=== "JavaScript"

    ``` typescript
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

Appends an item to the `SetSchema` object.

``` typescript
const set = new SetSchema<number>();
set.add(1);
set.add(2);
set.add(3);
```

---

#### `set.delete()`

Delete an item by its value.

``` typescript
set.delete("three");
```

---

#### `set.has()`

Returns a boolean value wheter an item exists in the Collection or not.

``` typescript
if (set.has("two")) {
    console.log("Exists!");
} else {
    console.log("Does not exist!");
}
```

---

#### `set.size`

Return the number of elements in a `SetSchema` object.

``` typescript
const set = new SetSchema<number>();
set.add(10);
set.add(20);
set.add(30);

console.log(set.size);
// output: 3
```

!!! Note "More methods available for Set"
     Have a look at the [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/).


---

#### `set.clear()`

Empties the Set. (Client-side will trigger `onRemove` for each element.)

---

### CollectionSchema

!!! Warning "`CollectionSchema` is only implemented in JavaScript"
    The `CollectionSchema` can only be used with JavaScript so far. Haxe, C#, Lua and C++ clients are not supported yet.

The `CollectionSchema` works similarly as the `ArraySchema`, with the caveat that you don't have control over its indexes.

=== "TypeScript"

    ``` typescript
    import { Schema, CollectionSchema, type } from "@colyseus/schema";

    class Item extends Schema {
        @type("number") damage: number;
    }

    class Player extends Schema {
        @type({ collection: Item }) items = new CollectionSchema<Item>();
    }
    ```

=== "JavaScript"

    ``` typescript
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

Appends an item to the `CollectionSchema` object.

``` typescript
const collection = new CollectionSchema<number>();
collection.add(1);
collection.add(2);
collection.add(3);
```

---

#### `collection.at()`

Gets an item at the specified `index`.

``` typescript
const collection = new CollectionSchema<string>();
collection.add("one");
collection.add("two");
collection.add("three");

collection.at(1);
// output: "two"
```

---

#### `collection.delete()`

Delete an item by its value.

``` typescript
collection.delete("three");
```

---

#### `collection.has()`

Returns a boolean value wheter an item exists in the Collection or not.

``` typescript
if (collection.has("two")) {
    console.log("Exists!");
} else {
    console.log("Does not exist!");
}
```

---

#### `collection.size`

Return the number of elements in a `CollectionSchema` object.

``` typescript
const collection = new CollectionSchema<number>();
collection.add(10);
collection.add(20);
collection.add(30);

console.log(collection.size);
// output: 3
```

---

#### `collection.forEach()`

The `forEach()` method executes a provided function once per each index/value pair in the `CollectionSchema` object, in insertion order.

``` typescript
collection.forEach((value, at) => {
    console.log("at =>", at)
    console.log("value =>", value)
});
```

---

#### `collection.clear()`

Empties the Collection. (Client-side will trigger `onRemove` for each element.)

---

## `StateView`

!!! Warning "The old `@filter()` and `@filterChildren()` are now deprecated!"
    See the [migration guide](/migrating/0.16/#filter-and-filterchildren-are-now-deprecated) for more information.

The `StateView` must be assigned to the `client.view`. The room serializer is going to use the `client.view` to serialize the state before sending it to the client.

```typescript
import { StateView } from "@colyseus/schema";

// ...
    onJoin(client, options) {
        const player = new Player();

        client.view = new StateView();
        client.view.add(player);

        this.state.players.set(client.sessionId, player);
    }
```

Each `StateView` instance is going to add a new encoding step for state serialization. You may re-use the same `StateView` instance for multiple clients, or create a new one for each client.

### `@view()` tagged fields

The `@view()` decorator is used to mark a field as only visible to a `StateView` that has added this `Schema` instance.

```typescript
class Player extends Schema {
    // this property is visible to all
    @type("string") name: string;

    // this property is only visible a `StateView` that has added this Player instance.
    @view() @type("number") position: number;
}
```

You may also add a tag number, to allow multiple views to access different fields:

```typescript
class Player extends Schema {
    // this property is visible to all
    @type("string") name: string;

    // any `.add(player)` will see this field
    @view() @type("number") position: number;

    // only `.add(player, 1)` will see this field
    @view(1) @type({ map: "string" }) attributes: MapSchema<string>;
}
```


---


### Versioning and backwards/forwards compability

Backwards/fowards compatibility is possible by declaring new fields at the end of existing structures, and earlier declarations to not be removed, but be marked `@deprecated()` when needed. See a versioning example below.

=== "Live version 1"

    ``` typescript
    import { Schema, type, deprecated } from "@colyseus/schema";

    class MyState extends Schema {
        @type("string") myField: string;
    }
    ```

=== "Live version 2"

    ``` typescript
    import { Schema, type, deprecated } from "@colyseus/schema";

    class MyState extends Schema {
        // Flag field as deprecated.
        @deprecated() @type("string") myField: string;

        // To allow your server to play nicely with multiple client-side versions.
        @type("string") newField: string;
    }
    ```

=== "Live version 3"

    ``` typescript
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

This is particularly useful for native-compiled targets, such as C#, C++, Haxe, etc - where the client-side can potentially not have the most up-to-date version of the schema definitions.

---

## Inheritance support

The collection types (`ArraySchema`, `MapSchema`, etc) must hold items of the same type. They support inherited types from the same base instance.

**The following example is supported:**

``` typescript
class Item extends Schema {/* base Item fields */}
class Weapon extends Item {/* specialized Weapon fields */}
class Shield extends Item {/* specialized Shield fields */}

class Inventory extends Schema {
    @type({ map: Item }) items = new MapSchema<Item>();
}

const inventory = new Inventory();
inventory.items.set("left", new Weapon());
inventory.items.set("right", new Shield());
```

---

## Limitations and best practices

- Each `Schema` structure can hold up to `64` fields. If you need more fields, use nested `Schema` structures.
- `NaN` or `null` numbers are encoded as `0`
- `null` strings are encoded as `""`
- `Infinity` numbers are encoded as `Number.MAX_SAFE_INTEGER`
- Multi-dimensional arrays are not supported. [See how to use 1D arrays as multi-dimensional](https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid/212813#212813)
- `@colyseus/schema` encoding order is based on field definition order.
    - Both encoder (server) and decoder (client) must have same schema definition.
    - The order of the fields must be the same.

