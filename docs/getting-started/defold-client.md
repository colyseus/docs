# Defold Client

Defold Engine is a Free 2D Game Engine for Cross-Platform Publishing.

The [colyseus-defold](https://github.com/colyseus/colyseus-defold) client has been tested on all major platforms supported by Defold, such as HTML5, iOS, Android, Mac and Windows.

## Installation

You will need to add [colyseus-defold](https://github.com/colyseus/colyseus-defold), as well as its dependencies into your `game.project` dependencies section in order to use the client.

Open your `game.project` file, and add the following URLs to the `Dependencies` section (under `Project -> Dependencies`):

	https://github.com/colyseus/colyseus-defold/archive/master.zip
    https://github.com/britzl/defold-websocket/archive/master.zip
    https://github.com/britzl/defold-luasocket/archive/0.11.zip
    https://github.com/britzl/defold-luasec/archive/master.zip

Read more about [Defold library dependencies](http://www.defold.com/manuals/libraries/)

You can also specify a [specific release](https://github.com/colyseus/colyseus-defold/releases) of the client, by copying its respective zip archive URL.

# Usage

```lua
local ColyseusClient = require "colyseus.client"

local client
local room

function init(self)
    -- Add initialization code here
    client = ColyseusClient.new("ws://localhost:2567")

    -- join chat room
    room = client:join("chat")
end

function update(self, dt)
   client:loop()
end
```

See [client-side documentation](/client/overview/).

## Caveats

When running on localhost, make sure you don't have any service running on port
80, otherwise the client won't connect into the specified port number.

Alternatively, you can bind the Colyseus server to port 80.

## Dependencies

The [colyseus-defold](https://github.com/colyseus/colyseus-defold) depends on the WebSocket, LuaSocket and LuaSec projects:

* [defold-websocket](https://github.com/britzl/defold-websocket)
* [defold-luasocket](https://github.com/britzl/defold-luasocket)
* [defold-luasec](https://github.com/britzl/defold-luasec)