# Client-side Schema Callbacks

When applying state changes coming from the server, the client-side is going to trigger callbacks on local instances according to the changes being applied.

In order to register callbacks to Schema instances, you must access the instances through a "proxy":

=== "TypeScript"

    ``` typescript
    import { getStateCallbacks } from "colyseus.js";

    const room = await client.joinOrCreate("my_room");
    const $ = getStateCallbacks(room);

    $(room.state).listen("currentTurn", (currentValue, previousValue) => {
        // ...
    });

    // when an entity was added (ArraySchema or MapSchema)
    $(room.state).entities.onAdd((entity, sessionId) => {
        // ...
        console.log("entity added", entity);

        $(entity).listen("hp", (currentHp, previousHp) => {
            console.log("entity", sessionId, "changed hp to", currentHp);
        })
    });

    // when an entity was removed (ArraySchema or MapSchema)
    $(room.state).entities.onRemove((entity, sessionId) => {
        // ...
        console.log("entity removed", entity);
    });
    ```

=== "C#"

    ``` csharp
    // TODO: NOT IMPLEMENTED / NOT FINAL
    $(room.state).OnCurrentTurnChange((currentValue, previousValue) => {
        Debug.Log(currentValue);
        Debug.Log(previousValue);
    })
    ```

=== "Lua"

    ``` lua
    -- TODO: NOT IMPLEMENTED / NOT FINAL
    $(room.state):listen("currentTurn", function (current_value, previous_value)
        pprint(current_value);
        pprint(previous_value);
    end)
    ```

=== "Haxe"

    ``` haxe
    // TODO: NOT IMPLEMENTED / NOT FINAL
    $(room.state).listen("currentTurn", (currentValue, previousValue) => {
        trace(currentValue);
        trace(previousValue);
    });
    ```

!!! Warning "C#, C++, Haxe"
    When using statically typed languages, you need to generate the client-side schema files based on your TypeScript schema definitions. [See generating schema on the client-side](#client-side-schema-generation).

### Methods

**On `Schema` instances**

- [listen()](#listenprop-callback) for properties
- [bindTo()](#bindto-callback) for properties
- [onChange ()](#onchange)

**On collections of items**

- [onAdd (item, key)](#onadd-fn-item-key-triggerall-true)
- [onRemove (item, key)](#onremove-item-key)
- [onChange (item, key)](#onchange-item-key)

!!! Note "What are collections?"
    Collections are `MapSchema`, `ArraySchema`, etc. See how to [define collections of items](/state/schema/#collections-of-items).

---

### On `Schema` instances

!!! Warning "TypeScript"
    When your `tsconfig.json` targets `ES2022` or higher (e.g. `ESNext`), the `@type()` schema decorators may fail to work because TS moves property declarations to the constructor. Set `"useDefineForClassFields": false` in your `tsconfig.json` to fix this. See [#510](https://github.com/colyseus/colyseus/issues/510#issuecomment-1507828422) for the discussion.

#### `.listen(prop, callback)`

Listens for a single property change.

**Parameters:**

- `property`: the property name you'd like to listen for changes.
- `callback`: the callback that is going to be triggered when `property` changes.

=== "TypeScript"

    ``` typescript
    $(room.state).listen("currentTurn", (currentValue, previousValue) => {
        console.log(`currentTurn is now ${currentValue}`);
        console.log(`previous value was: ${previousValue}`);
    });
    ```

=== "C#"

    ``` csharp
    $(room.state).OnCurrentTurnChange((currentValue, previousValue) => {
        Debug.Log(currentValue);
        Debug.Log(previousValue);
    })
    ```

=== "Lua"

    ``` lua
    $(room.state):listen("currentTurn", function (current_value, previous_value)
        pprint(current_value);
        pprint(previous_value);
    end)
    ```

=== "Haxe"

    ``` haxe
    $(room.state).listen("currentTurn", (currentValue, previousValue) => {
        trace(currentValue);
        trace(previousValue);
    });
    ```

The `.listen()` method returns a function that, when called, removes the attached callback:

``` typescript
const unbindCallback = $(room.state).listen("currentTurn", (currentValue, previousValue) => {
    // ...
});

// later on, if you don't need the listener anymore, you can call `unbindCallback()` to stop listening for `"currentTurn"` changes.
unbindCallback();
```

---

#### `.bindTo(targetObject, properties?)`

Bind properties directly to `targetObject`, whenever the server send updates.

**Parameters:**

- `targetObject`: the object that will receive updates
- `properties`: (optional) list of properties that will be assigned to
  `targetObject`. By default, every `@type()`'d property will be used.

=== "TypeScript"

    ``` typescript
    $(room.state).players.onAdd((player, sessionId) => {
        const playerVisual = PIXI.Sprite.from('player');
        $(player).bindTo(playerVisual);
    });
    ```


---

#### `onChange ()`

You can register the `onChange` to track whenever a `Schema` had its properties changed. When the callback is triggered, changes have already been applied.

=== "JavaScript"

    ``` typescript
    $(room.state).onChange(() => {
        // something changed on .state
        console.log(room.state.xxx)
    });
    ```

=== "Lua"

    ``` lua
    $(room.state):on_change(function ()
        -- something changed on .state
        print(room.state.xxx)
    end)

    ```

=== "C#"

    ``` csharp
    $(room.State).OnChange(() =>
    {
        // something changed on .state
        Debug.Log(room.State.xxx)
    });
    ```

!!! Note "Use `.listen()` to detect changes on particular properties"
    Since version 0.15, the `.onChange()` does not provide the full list of
    properties changed. See [`.listen()`](#listenprop-callback)

---

### On collections of items

#### `onAdd (fn (item, key), triggerAll = true)`

Register the `onAdd` callback is called whenever a new instance is added to a collection.

By default, the callback is called immediately for existing items in the collection.

=== "JavaScript"

    ``` typescript
    $(room.state).players.onAdd((player, key) => {
        console.log(player, "has been added at", key);

        // add your player entity to the game world!

        // detecting changes on object properties
        $(player).listen("field_name", (value, previousValue) => {
            console.log(value);
            console.log(previousValue);
        });
    });
    ```

=== "C#"

    ``` csharp
    $(room.State).players.OnAdd((string key, Player player) =>
    {
        Debug.Log("player has been added at " + key);

        // add your player entity to the game world!

        // detecting changes on object properties
        player.OnFieldNameChange += (value, previousValue) => {
            // property "fieldName" has changed!
        };
    });
    ```

=== "Lua"

    ``` lua
    $(room.state).players:on_add(function (player, key)
        print("player has been added at", key);

        -- add your player entity to the game world!

        -- detecting changes on object properties
        player:listen("field_name", function(value, previous_value)
            print(value)
            print(previousValue)
        end)
    end)
    ```

!!! Note "Avoiding doubled-up callbacks"
    You may notice that `onAdd` is called multiple times when an entry is inserted. This is because the "add" callback is called immediately by default for existing items in the collection. When the collection is nested within another schema instance, this can cause doubling. To fix this, set the second argument of `onAdd` to false (e.g. `.onAdd(callback, false)`). See [#147](https://github.com/colyseus/schema/issues/147#issuecomment-1538684941).

---

#### `onRemove (item, key)`

The `onRemove` callback is called with the removed item and its key on holder object as argument.

=== "JavaScript"

    ``` javascript
    $(room.state).players.onRemove((player, key) => {
        console.log(player, "has been removed at", key);

        // remove your player entity from the game world!
    });
    ```

=== "C#"

    ``` csharp
    $(room.State).players.OnRemove((string key, Player player) =>
    {
        Debug.Log("player has been removed at " + key);

        // remove your player entity from the game world!
    });
    ```

=== "Lua"

    ``` lua
    $(room.state).players:on_remove(function (player, key)
        print("player has been removed at " .. key);

        -- remove your player entity from the game world!
    end)
    ```

---

#### `onChange (item, key)`

This callback is triggered whenever a collection of **primitive** types (`string`, `number`, `boolean`, etc.) updates its values at the same key.

=== "JavaScript"

    ``` javascript
    $(room.state).mapOfStrings.onChange((value, key) => {
        console.log(key, "changed to", value);
    });
    ```

=== "Lua"

    ``` lua
    $(room.state).mapOfStrings:on_change(function (value, key)
        print(key .. " changed to " .. value);
    end)
    ```

=== "C#"

    ``` csharp
    $(room.State).mapOfStrings.OnChange((string key, string value) =>
    {
        Debug.Log(key + " changed to" + value);
    });
    ```

!!! Warning "Collection of `Schema` instances?"
    If you'd like to get the changes of a child `Schema` instance inside a
    collection, you need to attach either `.listen()` or `.onChange()` callbacks
    to the child instance directly during `.onAdd()`

---

## Client-side schema generation

The `schema-codegen` is a tool that transpiles your server-side schema definition files to be used in the client-side:

To be able to decode the state in the client-side, its local schema definitions must be compatible with the schema definitions in the server.

!!! Warning "Not required when using [JavaScript SDK](/getting-started/javascript-client/)"
    Using `schema-codegen` is only required when using statically typed languages in the client-side, such as C#, Haxe, etc.

**Usage:**

To see the usage, From your terminal, `cd` into your server's directory and run the following command:

``` bash
npx schema-codegen --help
```

**Output:**

``` bash
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

### Example: Unity / C\#

Below is a real example to generate the C# schema files from the [demo Unity project](https://github.com/colyseus/colyseus-unity3d/blob/aa9a722a50b2958ce01785969cd8ecb8aee24fd0/Server/package.json#L12).

``` bash
npx schema-codegen src/rooms/schema/* --csharp --output ../Assets/Scripts/States/"
generated: Player.cs
generated: State.cs
```

**Using `npm` scripts:**

For short, it is recommended to have your `schema-codegen` arguments configured under a `npm` script in your `package.json`:

``` json
"scripts": {
    "schema-codegen": "schema-codegen src/rooms/schema/* --csharp --output ../Assets/Scripts/States/"
}
```

This way you can run `npm run schema-codegen` rather than the full command:

``` bash
npm run schema-codegen
generated: Player.cs
generated: State.cs
```

---

# Advanced: Add your custom callback system

The `@colyseus/schema` version `3.0` introduced a way to bring your own callback system during decoding.

The standard way of attaching callbacks uses the same "flavor" as Colyseus is used to from previous versions. However, you can bring your own callback system by overriding the `Decoder`'s `triggerChanges` method.

This is an example of how you can bring your own callback system:

``` typescript
import { Room, DataChange } from "@colyseus/schema";

function getRawChangesCallback(room: Room, callback: (changes: DataChange[]) => void) {
    room['serializer']['decoder'].triggerChanges = callback;

    // .refs => contains a map of all Schema instances
    room['serializer']['decoder'].root.refs

    // .refIds => contains a map of all refIds by Schema instances
    room['serializer']['decoder'].root.refIds

    // .refCounts => contains a map of all reference counts by refId
    room['serializer']['decoder'].root.refCounts
}

const room = await client.joinOrCreate("my_room");
getRawChangesCallback(room, (changes) => {
    console.log("raw list of changes", changes);
});
```

On the above example, the raw list of changes is being printed to the console.

You can see how the standard callback system is implemented [here](https://github.com/colyseus/schema/blob/3.0/src/decoder/strategy/StateCallbacks.ts).
