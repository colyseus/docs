# [State Sync](/state/overview) &raquo; Client-side Callbacks

The schema callbacks are triggered only in the client-side, right after the
latest state patches sent by the server were received and applied on the client.

## Schema callbacks

!!! Warning "C#, C++, Haxe"
    When using statically typed languages, you need to generate the client-side schema files based on your TypeScript schema definitions. [See generating schema on the client-side](#client-side-schema-generation).

### Callbacks

When applying state changes coming from the server, the client-side is going to trigger callbacks on local instances according to the change being applied.

The callbacks are triggered based on instance reference. Make sure to attach the callback on the instances that are actually changing on the server.

- [listen()](#listenprop-callback)
- [onAdd (instance, key)](#onadd-instance-key)
- [onRemove (instance, key)](#onremove-instance-key)
- [onChange (instance, key)](#onchange-instance-key) (on collections: `MapSchema`, `ArraySchema`, etc.)
- [onChange (changes)](#onchange-changes-datachange) (on `Schema` instance)

#### `.listen(prop, callback)`

Listens for a single property change.

**Parameters:**

- `property`: the property name you'd like to listen for changes.
- `callback`: the callback that is going to be triggered when `property` changes.

=== "TypeScript"

    ``` typescript
    state.listen("currentTurn", (currentValue, previousValue) => {
        console.log(`currentTurn is now ${currentValue}`);
        console.log(`previous value was: ${previousValue}`);
    });
    ```

=== "C#"

    ``` csharp
    state.OnCurrentTurnChange((currentValue, previousValue) => {
        Debug.Log(currentValue);
        Debug.Log(previousValue);
    })
    ```

=== "Lua"

    ``` lua
    state:listen("currentTurn", function (current_value, previous_value)
        pprint(current_value);
        pprint(previous_value);
    end)
    ```

=== "Haxe"

    ``` haxe
    state.listen("currentTurn", (currentValue, previousValue) => {
        trace(currentValue);
        trace(previousValue);
    });
    ```

The `.listen()` method returns a function that, when called, removes the attached callback:

``` typescript
const unbindCallback = state.listen("currentTurn", (currentValue, previousValue) => {
    // ...
});

// later on, if you don't need the listener anymore, you can call `unbindCallback()` to stop listening for `"currentTurn"` changes.
unbindCallback();
```

**What's the difference between `listen` and `onChange`?**

The `.listen()` method is a shorthand for `onChange` on a single property. Below is a rewrite from `.listen()` to `onChange`:

``` typescript
state.onChange(function(changes) {
    changes.forEach((change) => {
        if (change.field === "currentTurn") {
            console.log(`currentTurn is now ${change.value}`);
            console.log(`previous value was: ${change.previousValue}`);
        }
    })
});
```

---

#### `onAdd (instance, key)`

The `onAdd` callback can only be used in collection of items (`MapSchema`, `ArraySchema`, etc.). The `onAdd` callback is called with the new instance and its key on holder object as argument.

=== "JavaScript"

    ``` typescript
    room.state.players.onAdd((player, key) => {
        console.log(player, "has been added at", key);

        // add your player entity to the game world!

        // If you want to track changes on a child object inside a map, this is a common pattern:
        player.onChange(function(changes) {
            changes.forEach(change => {
                console.log(change.field);
                console.log(change.value);
                console.log(change.previousValue);
            })
        });
    });
    ```

=== "Lua"

    ``` lua
    room.state.players:on_add(function (player, key)
        print("player has been added at", key);

        -- add your player entity to the game world!

        -- If you want to track changes on a child object inside a map, this is a common pattern:
        player:on_change(function(changes)
            for i, change in ipairs(changes) do
                print(change.field)
                print(change.value)
                print(change.previousValue)
            end
        end)
    end)
    ```

=== "C#"

    ``` csharp
    room.State.players.OnAdd((string key, Player player) =>
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
    });
    ```

---

#### `onRemove (instance, key)`

The `onRemove` callback can only be used in maps (`MapSchema`) and arrays (`ArraySchema`). The `onRemove` callback is called with the removed instance and its key on holder object as argument.

=== "JavaScript"

    ``` javascript
    room.state.players.onRemove((player, key) => {
        console.log(player, "has been removed at", key);

        // remove your player entity from the game world!
    });
    ```

=== "Lua"

    ``` lua
    room.state.players:on_remove(function (player, key)
        print("player has been removed at " .. key);

        -- remove your player entity from the game world!
    end)
    ```

=== "C#"

    ``` csharp
    room.State.players.OnRemove((string key, Player player) =>
    {
        Debug.Log("player has been removed at " + key);

        // remove your player entity from the game world!
    });
    ```

---

#### `onChange (changes: DataChange[])`

> `onChange` works differently for direct `Schema` references and collection structures. For [`onChange` on collection structures (array, map, etc.), check here](#onchange-instance-key).

You can register the `onChange` to track a `Schema` instance's property changes. The `onChange` callback is triggered with an array of changed properties, along with its previous values.

=== "JavaScript"

    ``` typescript
    room.state.onChange((changes) => {
        changes.forEach(change => {
            console.log(change.field);
            console.log(change.value);
            console.log(change.previousValue);
        });
    });
    ```

=== "Lua"

    ``` lua
    room.state:on_change(function (changes)
        for i, change in ipairs(changes) do
            print(change.field)
            print(change.value)
            print(change.previous_value)
        end
    end)

    ```

=== "C#"

    ``` csharp
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

You cannot register the `onChange` callback on objects that haven't been synchronized with the client-side yet.

---

#### `onChange (instance, key)`

> `onChange` works differently for direct `Schema` references and collection structures. For [`onChange` on `Schema` structures, check here](#onchange-changes-datachange).

This callback is triggered whenever a collection of **primitive** types (`string`, `number`, `boolean`, etc.) updates some of its values.

=== "JavaScript"

    ``` javascript
    room.state.players.onChange((player, key) => {
        console.log(player, "have changes at", key);
    });
    ```

=== "Lua"

    ``` lua
    room.state.players:on_change(function (player, key)
        print("player have changes at " .. key);
    end)
    ```

=== "C#"

    ``` csharp
    room.State.players.OnChange((string key, Player player) =>
    {
        Debug.Log("player have changes at " + key);
    });
    ```

If you'd like to detect changes inside a collection of **non-primitive** types (holding `Schema` instances),use [`onAdd`](#onadd-instance-key) and register [`onChange`](#onchange-changes-datachange) on them.

!!! Warning "`onChange`, `onAdd` and `onRemove` are **exclusive**"
    The `onChange` callback is not triggered during [`onAdd`](#onadd-instance-key) or [`onRemove`](#onremove-instance-key).

    Consider registering `onAdd` and `onRemove` if you need to detect changes during these steps too.

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

### Example: Unity / C#

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
