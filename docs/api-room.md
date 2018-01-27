## Room API

### Abstract methods

Room handlers should implement these methods.

- `onInit (options)` - When room is initialized
- `requestJoin (options)` - Checks if a new client is allowed to join. (default: `return true`)
- `onJoin (client)` - When client successfully join the room
- `onLeave (client)` - When a client leaves the room
- `onMessage (client, data)` - When a client sends a message
- `onDispose ()` - Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)

### Public properties

- `patchRate` - Frequency to send the room state to connected clients (in milliseconds)
- `maxClients` - Maximum number of clients allowed to connect into the room
- `autoDispose` - Automatically dispose the room when last client disconnect. (default: `true`)
- `clock` - A [`ClockTimer`](https://github.com/gamestdio/clock-timer.js) instance
- `clients` - Array of connected clients
- `timeline` - A [`Timeline`](https://github.com/gamestdio/timeframe) instance (see `useTimeline`)

### Public methods:

Room handlers have these methods available.

- `setState( object )` - Set the current state to be broadcasted / patched.
- `setSimulationInterval( callback[, milliseconds=16.6] )` - (Optional) Create the simulation interval that will change the state of the game. Default simulation interval: 16.6ms (60fps)
- `setPatchRate( milliseconds )` - Set frequency the patched state should be sent to all clients. (default: `50` = 20fps)
- `send( client, data )` - Send data to a particular client
- `lock()` - Prevent new clients from joining the room
- `unlock()` - Unlock the room for new clients
- `broadcast( data )` - Send data to all connected clients
- `disconnect()` - Disconnect all clients, then dispose
- `useTimeline([ maxSnapshots=10 ])` - (Optional, experimental) Keep state snapshots for lag compensation