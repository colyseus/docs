# `StateView`: Per-client State Visibility

!!! tip "New since 0.16"
    This feature was introduced in version `0.16`. It replaces the previously experimental `@filter()` and `@filterChildren()` decorators.

By default, the entire state is visible to all clients. However, you may want to control which parts of the state are visible to each client.

You can do so by:

1. Assigning a `StateView` instance to the client
2. Tag fields with the `@view()` decorator
3. Manually `.add()` schema instances to the `StateView`
4. Manually `.remove()` schema instances from the `StateView`

The `StateView` must be assigned to the `client.view`.

---

## Initialize a `StateView`

```typescript
import { StateView } from "@colyseus/schema";
// ...
    onJoin(client, options) {
        client.view = new StateView();
        // ...
    }
// ...
```

!!! Note "How serialization works"
    Each `StateView` instance is going to add a new encoding step for state serialization. You may re-use the same `StateView` instance for multiple clients, or create a new one for each client.

    Internally, all "shared" properties (properties not tagged with `@view()`) are serialized first, and then each `StateView` is serialized with its own set of properties.

---

## Tag fields with `@view()`

The `@view()` decorator is used to tag a field as only visible to `StateView`'s that contains that `Schema` instance.

```typescript
class Player extends Schema {
    // visible to all
    @type("string") name: string;

    // only visible to clients containing this schema instance on their `StateView`
    @view() @type("number") position: number;
}
```

On the example above, the `position` field is only visible to clients that contain this `Player` instance on their `StateView`.

### Add instance to `StateView`

In order to add a schema instance to a `StateView`, you must call `.add()` on the `StateView` instance:

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

The client-side will receive either a "On Add" or "Listen" callback you can listen to, depending on which structure the schema instance is part of.

### Remove instance from `StateView`

In order to remove a schema instance from a `StateView`, you must call `.remove()` on the `StateView` instance:

```typescript
client.view.remove(player);
```

The client-side will receive either a "On Remove" or "Listen" callback you can listen to, depending on which structure the schema instance is part of.

---

## Specialized tags with `@view(tag: number)`

Sometimes you may want to have multiple views with different fields.

```typescript
class Player extends Schema {
    // visible to all
    @type("string") name: string;

    // any `.add(player)` will see this field
    @view() @type("number") health: number;

    // only `.add(player, 1)` will see this field
    @view(1) @type("number") position: number;
}
```

By assigning a numeric tag to the `@view()` decorator, that field will only be visible to clients that contain this `Schema` instance on their `StateView` with the same tag:

```typescript
const player = new Player().assign({ name: "Player 1", health: 100, position: 0 });
this.state.players.set(client.sessionId, player);

// add with tag 1 - "position" field is visible
client.view.add(player, 1);
```


On the example above, the `attributes` field is only visible to clients that contain this `Player` instance on their `StateView` with tag `1`, whereas the `position` field is visible to all clients that contain this `Player` instance on their `StateView`.

Considering the `Player` of the example, the following table shows the visibility of each field:

| Field / Visibility | Without `view.add()` | With `view.add(player)` | With `view.add(player, 1)` |
|--------------------|----------------------|-------------------------|----------------------------|
| `name`             | ✅                   | ✅                       | ✅                         |
| `health`           | ❌                   | ✅                       | ✅                         |
| `position`         | ❌                   | ❌                       | ✅                         |

---

## Items of `ArraySchema` and `MapSchema`

When you tag an array or map with `@view()`, each element of the array or map must be added to the client's `StateView` individually.

```typescript
class Player extends Schema {
    @type("string") name: string;
    @type("number") position: number;
}

class MyState extends Schema {
    @view() @type({ map: Player }) players = new MapSchema<Player>();
}
```

The instance must be assigned to the state and added to the `StateView`:

```typescript
import { StateView } from "@colyseus/schema";
// ...
    onJoin(client, options) {
        const player = new Player();

        client.view = new StateView();
        client.view.add(player);

        this.state.players.set(client.sessionId, player);
    }
// ...
```
