# [State Handling](/state/overview) » Schema

The `SchemaSerializer` has been introduced since Colyseus 0.10, and it's the default serialization method.

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
const type = schema.type;

class MyState extends Schema {
}

type("string")(State.prototype, "currentTurn");
```

### Custom child data type

You may define more custom data types inside your "root" state definition, as a direct reference, map, or array.

```typescript fct_label="TypeScript"
import { Schema, type } from "@colyseus/schema";

class Map {
    @type("number")
    width: number;

    @type("number")
    height: number;

    @type("number")
    items: number = 10;
}

class MyState extends Schema {
    @type(Map)
    map: Map = new Map();
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const type = schema.type;

class Map extends Schema {
}
type("number")(Map.prototype, "width");
type("number")(Map.prototype, "height");
type("number")(Map.prototype, "items");

class MyState extends Schema {
    constructor () {
        super();

        this.map = new Map();
    }
}
type(Map)(State.prototype, "map");
```

### Array of custom data type

When using arrays, it's important to use the `ArraySchema` type. Do not use plain arrays.

`ArraySchema` is recommended for defining your maps, or any collection in your game.

```typescript fct_label="TypeScript"
import { Schema, ArraySchema, type } from "@colyseus/schema";

class Block {
    @type("x")
    width: number;

    @type("y")
    height: number;
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
const type = schema.type;

class Block extends Schema {
}
type("number")(Map.prototype, "x");
type("number")(Map.prototype, "y");

class MyState extends Schema {
    constructor () {
        super();

        this.blocks = new ArraySchema();
    }
}
type([ Block ])(State.prototype, "blocks");
```

### Map of custom data type

When using a map, it's important to use the `MapSchema` type. Do not use a plain object or type Map type.

`MapSchema` is recommended to track your game entities by id, such as players, enemies, etc.

```typescript fct_label="TypeScript"
import { Schema, MapSchema, type } from "@colyseus/schema";

class Player {
    @type("x")
    width: number;

    @type("y")
    height: number;
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
const type = schema.type;

class Player extends Schema {
}
type("number")(Map.prototype, "x");
type("number")(Map.prototype, "y");

class MyState extends Schema {
    constructor () {
        super();

        this.players = new MapSchema();
    }
}
type({ map: Player })(State.prototype, "players");
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

## Client-side
