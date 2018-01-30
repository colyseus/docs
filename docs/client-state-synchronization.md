Whenever the [state mutates](api-room) in the server-side, you can listen to particular variable changes in the client-side.

The `Room` instance in the client-side uses [delta-listener](https://github.com/endel/delta-listener) to allow you to trigger callbacks for particular mutations.

**Example**

Let's say you have a list of entities and its positions in your server-side:

```javascript
class MyRoom extends Room {
    onInit () {
        this.setState({
            entities: {
                "f98h3f": { x: 0, y: 0, hp: 10 },
                "24jgd3": { x: 100, y: 0, hp: 6 }
            }
        });
    }
}
```

In the client-side, you want to listen for mutations in the attributes of these entities. Before being able to catch them, we need to mutate them. The mutation can occur during your simulation interval, or by actions taken by connected clients (during `onMessage` in the server-side).

```javascript
class MyRoom extends Room {
    onInit () {
        // this.setState(...) see above
        this.setSimulationInterval(() => this.update());
    }

    update () {
        for (let entityId in this.state.entities) {
            // simple and naive gravity
            this.state.entities[entityId].y += 1;
        }
    }
}
```

Now that we have the mutations in place, we can listen to them in the client-side. The callback will be called for each attribute, of each entity.

```javascript fct_label="JavaScript"
room.listen("entities/:id/:attribute", (change) => {
    console.log(change.operation); // => "replace" (can be "add", "remove" or "replace")
    console.log(change.path["id"]); // => "f98h3f"
    console.log(change.path["attribute"]); // => "y"
    console.log(change.value); // => 1
})
```

```javascript fct_label="C#"
room.Listen("entities/:id/:attribute", OnAttributeChange);

void OnAttributeChange (DataChange change)
{
    Debug.Log ("OnAttributeChange");
    Debug.Log (change.operation); // => "replace" (can be "add", "remove" or "replace")
    Debug.Log (change.path["id"]); // => "f98h3f"
    Debug.Log (change.path["attribute"]); // => "y"
    Debug.Log (change.value); // => 1
})
```