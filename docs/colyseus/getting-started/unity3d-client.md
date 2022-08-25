# Unity SDK

!!! tip "New changes since May 10th, 2021"
    [Read more about it here](/migrating/unity-sdk-0.14.5).

# Installation

## Using Unity Package Manager

- Go to Window > Package Manager. Click "+" button, then select "Add package from git URL..."
- Enter Git URL: `https://github.com/colyseus/colyseus-unity3d.git#upm`
- Click "ADD"

Click to import the example project in order to test the built-in demonstration.

## Using legacy `.unitypackage`:

- Download the latest [Colyseus Unity SDK](https://github.com/colyseus/colyseus-unity3d/releases/latest/download/Colyseus_Plugin.unitypackage)
- Import the `Colyseus_Plugin.unitypackage` contents into your project.

The `Colyseus_Plugin.unitypackage` contains an example project under `Assets/Colyseus/Example` you can use as a reference.

# Setup

Here we'll be going over the steps to get your Unity client up and running and connected to a Colyseus server. 

Topics covered include:

- Running the server locally
- Server settings
- Connecting to a server
- Connecting to a room
- Communicating with a room, and the room's state. 

The topics should be enough for you to set up a basic client on your own, however, you are welcome to use and modify the included example code to suit your needs.

## Running the server locally

To run the demonstration server locally, run the following commands in your terminal:

```
cd Server
npm install
npm start
```

The built-in demonstration comes with a single [room handler](https://github.com/colyseus/colyseus-unity3d/blob/master/Server/src/rooms/MyRoom.ts), containing a suggested way of handling entities and players. Feel free to change all of it to fit your needs!

## Initializing Client

Client instance must be initalized with the server's WebSocket address/Secure websocket(wss) address in the initial stage.
```csharp
ColyseusClient client = new ColyseusClient("ws://localhost:2567");
```

## Connecting to a Room:

- There are several ways to create and/or join a room.
- You can create a room by calling the `Create` method of `ColyseusClient` which will automatically create an instance of the room on the server and join it:
```csharp
ColyseusRoom<MyRoomState> room = await client.Create<MyRoomState>(roomName);
```

- You can join an existing room if there is any available slot in the room by calling `join`:
```csharp
ColyseusRoom<MyRoomState> room = await client.Join<MyRoomState>(roomName);
```

- Also you can join a an available room by calling `JoinById`:
```csharp
ColyseusRoom<MyRoomState> room = await client.JoinById<MyRoomState>(roomId);
```

- You can call the `JoinOrCreate` method of `ColyseusClient` which will matchmake into an available room, if able to, or will create a new instance of the room and then join it on the server:
```csharp
ColyseusRoom<MyRoomState> room = await client.JoinOrCreate<MyRoomState>(roomName);
```

## Room Options:

- When creating a new room you have the ability to pass in a dictionary of room options, such as a minimum number of players required to start a game or the name of the custom logic file to run on your server.
- Options are of type `object` and are keyed by the type `string`:
```csharp
Dictionary<string, object> roomOptions = new Dictionary<string, object>
{
    ["YOUR_ROOM_OPTION_1"] = "option 1",
    ["YOUR_ROOM_OPTION_2"] = "option 2"
};

ColyseusRoom<MyRoomState> room = await client.JoinOrCreate<ExampleRoomState>(roomName, roomOptions);
```

## Room Events:

`ColyseusRoom` has various events that you will want to subscribe to:

### OnJoin
- Gets called after the client has successfully connected to the room.

### OnLeave
!!! tip "Updated as of 0.14.7"
    In order to handle custom websocket closure codes, the delegate functions now pass around the `int` closure code rather than the `WebSocketCloseCode` value.

- Gets called after the client has been disconnected from the room.
- Has an `int` parameter with the reason for the disconnection.
```csharp
room.OnLeave += OnLeaveRoom;
```
where `OnLeaveRoom` functions as so:
```csharp
private void OnLeaveRoom(int code)
  {
      WebSocketCloseCode closeCode = WebSocketHelpers.ParseCloseCodeEnum(code);
      LSLog.Log(string.Format("ROOM: ON LEAVE =- Reason: {0} ({1})", closeCode, code));
  }
```

### OnStateChange
- Any time the room's state changes, including the initial state, this event will get fired.

```csharp
room.OnStateChange += OnStateChangeHandler;
private static void OnStateChangeHandler(ExampleRoomState state, bool isFirstState)
{
    // Do something with the state
}
```

### OnError
- When a room related error occurs on the server it will be reported with this event.
- Has parameters for an error code and an error message.

## Room Messages:
You have the ability to listen for or to send custom messages from/to a room instance on the server.

### OnMessage
- To add a listener you call `OnMessage` passing in the type and the action to be taken when that message is received by the client.
- Messages are useful for events that occur in the room on the server. (Take a look at our [tech demos](https://docs.colyseus.io/demo/shooting-gallery/) for use case examples of using `OnMessage`)

```csharp
room.OnMessage<MyMessageType>("welcomeMessage", message =>
{
    Debug.Log(message);
});
```

### Send
- To send a custom message to the room on the server use the `Send` method of `ColyseusRoom`
- Specify the `type` and an optional `message` parameters to send to your room.

```csharp
room.Send("position", new { x = 1.3, y = -1.4 });
```

### Room State:
> See how to generate your `RoomState` from [State Handling](https://docs.colyseus.io/state/schema/#client-side-schema-generation)

- Each room holds its own state. The mutations of the state are synchronized automatically to all connected clients.
- In regards to room state synchronization:
  - When the user successfully joins the room, they receive the full state from the server.
  - At every `patchRate`, binary patches of the state are sent to every client (default is 50ms)
  - `onStateChange` is called on the client-side after every patch received from the server.
  - Each serialization method has its own particular way to handle incoming state patches.
- `MyRoomState` is the base room state you will want your room state to inherit from.
- Take a look at our tech demos for implementation examples of synchronizable data in a room&#39;s state such as networked entities, networked users, or room attributes. ([Shooting Gallery Tech Demo](https://docs.colyseus.io/demo/shooting-gallery/))

```csharp
public partial class MyRoomState : Schema
{
	[Type(0, "map", typeof(MapSchema<Player>))]
	public MapSchema<Player> players = new MapSchema<Player>();
}
```

When you are using MapSchema or ArraySchema, the state sychronizations from the server can be used as below as well.

```csharp
// Something has been added to Schema
room.State.players.OnAdd += (key, player) =>
{
    Debug.Log($"{key} has joined the Game!");
};

// Something has changed in Schema
room.State.players.OnChange += (key, player) =>
{
    Debug.Log($"{key} has been changed!");
};

// Something has been removed from Schema
room.State.players.OnRemove += (key, player) =>
{
    Debug.Log($"{key} has left the Game!");
};
```

## Debugging

If you set a breakpoint in your application while the WebSocket connection is open, the connection will be closed automatically after 3 seconds due to inactivity. To prevent the WebSocket connection from dropping, use `pingInterval: 0` during development:

```typescript
import { Server, RedisPresence } from "colyseus";

const gameServer = new Server({
  // ...
  pingInterval: 0 // HERE
});
```

Make sure to have a `pingInterval` higher than `0` on production. The default `pingInterval` value is `3000`.
