## Installation

- Download the latest version of [colyseus-unity3d](https://github.com/colyseus/colyseus-unity3d) locally. ([download link](https://github.com/colyseus/colyseus-unity3d/archive/master.zip))
- Copy `Assets/Plugins` files into your Unity project.

## Running the demo server

The [colyseus-unity3d](https://github.com/colyseus/colyseus-unity3d) comes with a [usage example](https://github.com/colyseus/colyseus-unity3d/blob/master/Assets/ColyseusClient.cs), and a simple [room handler](https://github.com/colyseus/colyseus-unity3d/blob/master/Server/demo_room.js) for basic testing. You can test it locally by running these commands in your commandline:

```
cd Server
npm install
npm start
```

!!! Tip
    Ensure you have [Node v8+](http://nodejs.org/) installed locally to run the server.

## Usage

Each `Client` and `Room` connections need to run on its own Coroutine. See [usage example](https://github.com/colyseus/colyseus-unity3d/blob/master/Assets/ColyseusClient.cs) for more details.

### Connecting to the Server

```csharp
Client client = new Colyseus.Client ("ws://localhost:2567");
StartCoroutine(client.Connect());
```

### Joining a Room

```csharp
Room room = client.Join ("room_name");
room.OnReadyToConnect += (sender, e) => {
    StartCoroutine(room.Connect());
};
```

### Getting the full room state

```csharp
room.OnStateChange += OnStateChange;

void OnStateChange (object sender, RoomUpdateEventArgs e)
{
	if (e.isFirstState) {
		// First setup of your client state
		Debug.Log(e.state);
	} else {
		// Further updates on your client state
		Debug.Log(e.state);
	}
}
```

### Listening to add/remove on a specific key on the room state

```csharp
room.Listen ("players/:id", OnPlayerChange);

void OnPlayerChange (DataChange change)
{
	Debug.Log (change.path["id"]);
	Debug.Log (change.operation); // "add" or "remove"
	Debug.Log (change.value); // the player object
}
```

### Listening to specific data changes in the state

```csharp
room.Listen ("players/:id/:axis", OnPlayerMove);

void OnPlayerMove (DataChange change)
{
	Debug.Log ("OnPlayerMove");
	Debug.Log ("playerId: " + change.path["id"] + ", axis: " + change.path["axis"]);
	Debug.Log (change.value);
}
```