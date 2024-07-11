# Advanced Usage

Since `@colyseus/schema` 3.0, experimental APIs are available allowing you to
customize:

- [Change tracking](#change-tracking)
- [Byte-level encoding](#byte-level-encoding)
- [Byte-level decoding](#byte-level-decoding)
- [Encoding non-`Schema` structures](#encoding-non-schema-structures)

## Change Tracking

The `$track` method is called whenever a `@type()`'d attribute gets mutated. It
is used to track which properties must be encoded.

```typescript
import { $track, Schema } from "@colyseus/schema";

class Vec3 extends Schema {
    x: number;
    y: number;
    z: number;
}

Vec3[$track] = (changeTree: ChangeTree, index: number, operation: OPERATION = OPERATION.ADD) {
    changeTree.change(index, operation);
}
```

See [`ChangeTree`](https://github.com/colyseus/schema/blob/f755b94c5e618cfd6cdf2182199ec87b68fdae47/src/encoder/ChangeTree.ts) for more information.

## Byte-level encoding

At the `$encoder` method call, you may customize how a particular structure gets
encoded into the buffer that is sent over the wire for the client.

```typescript
import { $encoder, Schema } from "@colyseus/schema";

class Vec3 extends Schema {
    x: number;
    y: number;
    z: number;
}

Vec[$encoder] = function (encoder, buffer, changeTree, index, operation, it, isEncodeAll, hasView) {
    //
    // encode x / y / z into a single byte
    // (this limits for values ranging from 0 to 7 for x, y, and z.)
    //
    buffer[it.offset++] = (x << 6) | (y << 3) | z;
}
```

See [`EncodeOperation`](https://github.com/colyseus/schema/blob/f755b94c5e618cfd6cdf2182199ec87b68fdae47/src/encoder/EncodeOperation.ts#L16-L25) method signature for full list of arguments.

## Byte-level decoding

At the `$decoder` method call, you may customize how a particular structure gets
decoded, and how to interact with the callback system.

```typescript
import { $decoder, Schema } from "@colyseus/schema";

class Vec3 extends Schema {
    x: number;
    y: number;
    z: number;
}

Vec[$decoder] = function (decoder, bytes, it, ref, allChanges) {
    //
    // decode x / y / z from a single byte
    // (values can only range from 0 to 7)
    //
    const byte = bytes[it.offset++];

    ref.x = (byte >> 6) & 0x07;
    ref.y = (byte >> 3) & 0x07;
    ref.z = byte & 0x07;

    //
    // (optional) add change to list of changes, for callback handling
    //
    allChanges.push({
        ref: ref,
        refId: decoder.root.refIds.get(ref),
        op: OPERATION.REPLACE,
        field: "x",
        value: ref.x,
        previousValue: undefined,
    });

    allChanges.push({
        ref: ref,
        refId: decoder.root.refIds.get(ref),
        op: OPERATION.REPLACE,
        field: "y",
        value: ref.y,
        previousValue: undefined,
    });

    allChanges.push({
        ref: ref,
        refId: decoder.root.refIds.get(ref),
        op: OPERATION.REPLACE,
        field: "z",
        value: ref.z,
        previousValue: undefined,
    });
}
```

See [`DecodeOperation`](https://github.com/colyseus/schema/blob/f755b94c5e618cfd6cdf2182199ec87b68fdae47/src/decoder/DecodeOperation.ts#L28-L34) method signature for full list of arguments.

## Encoding non-`Schema` structures

In order to encode 3rd party structures, there are 2 steps to take:

1. Use `Metadata.setFields()` to define the properties to be encoded.
2. Initialize each instance with `Schema.initialize()` as soon as the 3rd party
   structure has been instantiated.

!!! Warning "Experimental feature"
    This may not work as expected for every 3rd party structure, as
    `Schema.initialize()` is going to assign a property descriptor per property
    defined by `Metadata.setFields()`. If the 3rd party library also relies on
    their own property descriptors, or getters/setters, it would result in
    conflicts between them.

```typescript
import { Schema, Metadata } from "@colyseus/schema";

// the 3rd party structure...
class Vec3 {
    x: number;
    y: number;
    z: number;
}

// define how to encode the properties
Metadata.setFields(Vec3, {
    x: "number",
    y: "number",
    z: "number",
});

// initialize it!
const vec3 = new Vec3();
Schema.initialize(vec3);

```
