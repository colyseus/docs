# 

## 安裝

- 
- 
- 

!!! 提示「尋找一個例子？」 

## 使用方式



> 了解如何從 {2>State Handling<2} 生成您的 {1>RoomState<1}



const client = new Client("ws://localhost:2567");



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
} \`\`\`

## 範例



### {1>升級用戶端：<1}









