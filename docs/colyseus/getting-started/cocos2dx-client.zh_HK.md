# Cocos2d-x SDK

## 安装

- 下載[Cocos2d-X](http://www.cocos2d-x.org/download)並遵照其[安裝說明](https://github.com/cocos2d/cocos2d-x#download-stable-versions)。
- 下載[colyseus-cocos2d-x](https://github.com/colyseus/colyseus-cocos2d-x/archive/master.zip)並將`Source/`檔案複製到您的專案中。
- 將`Source/`目錄新增到您專案的`標頭搜索路徑`。

!!! tip "Looking for Cocos Creator?" 參見[JavaScript " Cocos Creator](/getting-started/javascript-client/#cocos-creator-30)。

## 用法

下面，您可以看到如何使用`Client`配對到一個`Room`，並從連接的房間發送和接收資訊。

> 看看如何从 [State Handling](/state/schema/#client-side-schema-generation) 生成你的`RoomState`

```cpp #include "Colyseus/Client.h";

Client* client = new Client("ws://localhost:2567"); Room* room;

bool HelloWorld::init() { client = new Client("ws://localhost:2667"); client->joinOrCreate<RoomState>("state\_handler", {}, \[=\](MatchMakeError *err, Room<RoomState>* \_room) { if (err != "") { std::cout << "JOIN ERROR! " << err << std::endl; return; }

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
} ```

## 範例

此範例使用[colyseus-examples](https://github.com/colyseus/colyseus-examples)作為伺服器（`02-state-handler.ts`範例）。請遵循[colyseus-examples](https://github.com/colyseus/colyseus-examples)在README中的安裝說明。

### 运行客户端

從`Example`目錄，執行`cocos run -p {platform-id}`指令，例如：

**為Windows組建：**

``` cocos run -p win32 ```

**為Mac組建：**

``` cocos run -p mac ```