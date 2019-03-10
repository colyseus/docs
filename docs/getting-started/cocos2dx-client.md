## Installation

- Download [Cocos2d-X](http://www.cocos2d-x.org/download) and follow their [installation instructions](https://github.com/cocos2d/cocos2d-x#download-stable-versions).
- Download [colyseus-cocos2d-x](https://github.com/colyseus/colyseus-cocos2d-x/archive/master.zip) and copy the `Source/` files into your project.
- Add the `Source/` directory to your project's `Header Search Paths`.

## Usage

Below you can see how to use the `Client`, matchmake into a `Room`, and send and
receive messages from the connected room.

```cpp
#include "Colyseus/Client.h";

Client* client;
Room* room;

bool HelloWorld::init()
{
    client = new Client("ws://localhost:2667");
    client->onOpen = CC_CALLBACK_0(HelloWorld::onConnectToServer, this);
    client->connect();
}

void HelloWorld::onConnectToServer()
{
    log("Colyseus: CONNECTED TO SERVER!");
    room->onMessage = CC_CALLBACK_2(HelloWorld::onRoomMessage, this);
    room->onStateChange = CC_CALLBACK_1(HelloWorld::onRoomStateChange, this);

    room->listen("players/:id", [this](std::map<std::string, std::string> path, PatchObject patch) -> void {
        std::cout << "CALLBACK FOR 'players/:id' >>" << std::endl;
        std::cout << "OPERATION: " << patch.op << std::endl;
        std::cout << "PLAYER ID:" << path.at(":id") << std::endl;
        std::cout << "VALUE: " << patch.value << std::endl;
    });
}

void HelloWorld::onRoomMessage(Room* sender, msgpack::object message)
{
    std::cout << "!! HelloWorld::onRoomMessage !!" << std::endl;
    std::cout << message << std::endl;
}

void HelloWorld::onRoomStateChange(Room* sender)
{
    std::cout << "!! HelloWorld::onRoomStateChange !!" << std::endl;
    std::cout << sender->state->get() << std::endl;
}
```

## Example

The example is using [colyseus-examples](https://github.com/colyseus/colyseus-examples) as a server (`02-state-handler.ts` example). Please follow installation instructions from [colyseus-examples](https://github.com/colyseus/colyseus-examples)'s README.

### Running the client

From the `Example` directory, run the `cocos run -p {platform-id}` command,
e.g.:

**Building for Windows:**

```
cocos run -p win32
```

**Building for Mac:**

```
cocos run -p mac
```