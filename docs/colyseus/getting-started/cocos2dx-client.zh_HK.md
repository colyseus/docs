# Cocos2d-x SDK

## 安裝

- 下載 [Cocos2d-X](http://www.cocos2d-x.org/download) 並安裝 [installation instructions](https://github.com/cocos2d/cocos2d-x#download-stable-versions) 進行安裝.
- 下載 [colyseus-cocos2d-x](https://github.com/colyseus/colyseus-cocos2d-x/archive/master.zip) 並將 `Source/` 目錄復製到您的項目中.
- 添加 `Source/` 目錄至您項目的 `Header Search Paths`.

!!! tip "要用 Cocos Creator?"
    參見 [JavaScript » Cocos Creator](/getting-started/javascript-client/#cocos-creator-30).

## 使用方式

下方您可以看到如何使用 `Client`, 匹配進入 `Room`, 以及從已連接的房間中
發送並接收消息.

> 了解如何使用 [State Handling](/state/schema/#client-side-schema-generation) 生成您的 `RoomState`

```cpp
#include "Colyseus/Client.h";

Client* client = new Client("ws://localhost:2567");
Room* room;

bool HelloWorld::init()
{
    client = new Client("ws://localhost:2667");
    client->joinOrCreate<RoomState>("state_handler", {}, [=](MatchMakeError *err, Room<RoomState>* _room) {
        if (err != "") {
            std::cout << "JOIN ERROR! " << err << std::endl;
            return;
        }

        room = _room;

        room->onMessage("type", [=] (msgpack::object message) -> void {
            std::cout << message << std::endl;
        });

        room->onStateChange = [=] (RoomState* state) -> void {
            // ...
        };

        room->onError = [this](std::string message) -> void {
            std::cout << "ROOM ERROR => " << message.c_str() << std::endl;
        };

        room->onLeave = [this]() -> void {
            std::cout << "LEFT ROOM" << std::endl;
        };

        room->getState()->players->onAdd = [this](Player* player, string sessionId) -> void {
            // add player sprite
            auto sprite = Sprite::create("HelloWorld.png");
            sprite->setPosition(player->x, player->y);
            players.insert(sessionId, sprite);
            this->addChild(sprite, 0);

            player->onChange = [this, sprite, player](std::vector<colyseus::schema::DataChange> changes) -> void {
                for(int i=0; i < changes.size(); i++)   {
                    if (changes[i].field == "x") {
                        sprite->setPositionX(player->x);

                    } else if (changes[i].field == "y") {
                        sprite->setPositionY(player->y);
                    }
                }
            };
        };

        room->getState()->players->onRemove = [this](Player* player, string sessionId) -> void {
            std::cout << "onRemove called!" << std::endl;
            auto sprite = players.at(sessionId);
            this->removeChild(sprite);
            players.erase(sessionId);
            std::cout << "onRemove complete!" << std::endl;
        };

        std::cout << "Done!" << std::endl;
    });
}
```

## 示例

該示例使用 [colyseus-examples](https://github.com/colyseus/colyseus-examples) 作為服務器 (`02-state-handler.ts` 示例) 請依照 [colyseus-examples](https://github.com/colyseus/colyseus-examples) 的 README 進行安裝.

### 運行用戶端

在 `Example` 目錄下, 運行 `cocos run -p {platform-id}` 命令, 例如:

**編譯 Windows 程序:**

```
cocos run -p win32
```

**編譯 Mac 程序:**

```
cocos run -p mac
```
