# Cocos2d-x SDK

## 安裝

- 下载[Cocos2d-X](http://www.cocos2d-x.org/download)并遵守其[installation instructions](https://github.com/cocos2d/cocos2d-x#download-stable-versions).
- 下载[colyseus-cocos2d-x](https://github.com/colyseus/colyseus-cocos2d-x/archive/master.zip)并将`Source/`文件复制到你的项目中.
- 添加`Source/`目录至你项目的`Header Search Paths`.

!!! tip "Looking for Cocos Creator?" 见[JavaScript » Cocos Creator](/getting-started/javascript-client/#cocos-creator-30).

## 使用方式

下方你可以看到如何使用`Client`,匹配进入`Room`,以及从已连接的房间发送并接收消息.

> 了解如何從 [State Handling](/state/schema/#client-side-schema-generation) 生成您的 `RoomState`

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

## 示例

该示例使用[colyseus-examples](https://github.com/colyseus/colyseus-examples)作为服务器(`02-state-handler.ts`示例)请遵循[colyseus-examples](https://github.com/colyseus/colyseus-examples)的README中的安装指示.

### 執行用戶端

从`Example`目录,运行`cocos run -p {platform-id}` 命令,例如：

**Building for Windows:**

``` cocos run -p win32 ```

**Building for Mac:**

``` cocos run -p mac ```
