# [State Handling](/state/overview) » Schema

The `SchemaSerializer` has been introduced since Colyseus 0.10, and it's the default serialization method.

## Server-side

Your state class should extend the `Schema` class, and each property should have a `@type()` decorator to define its data type.

!!! Warning "Are you not using TypeScript?"
    Decorators [are not part of ECMAScript yet](https://github.com/tc39/proposal-decorators), so the `type` syntax on plain JavaScript is still a bit odd to use, which you can see in the "JavaScript" tab for each snippet.

```typescript fct_label="TypeScript"
import { Schema, type } from "@colyseus/schema";

class State extends Schema {
    @type("string")
    currentTurn: string;
}
```

```typescript fct_label="JavaScript"
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const type = schema.type;

class State extends Schema {
}

type("string")(State.prototype, "currentTurn");
```

### Data types

| Type | Description | Limitation |
|------|-------------|------------|
| `"string"` | utf8 strings | maximum byte size of `4294967295` |
| `"number"` | auto-detects `int` or `float` type. (extra byte on output) | `0` to `18446744073709551615` |
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
