# Haxe SDK

我們歡迎您將本 SDK 與任何 Haxe 遊戲引擎一同使用, 比如: [OpenFL](https://www.openfl.org/), [Kha](http://kha.tech/), [HaxeFlixel](http://haxeflixel.com/), [Heaps](https://heaps.io/), [HaxePunk](http://haxepunk.com/) 等.

## 安裝

從 haxelib 安裝 `colyseus`:

```
haxelib install colyseus
```

## 用法

### 連接至服務器:

```haxe
import io.colyseus.Client;
import io.colyseus.Room;

var client = new Client('ws://localhost:2567');
```

### 加入房間:

> 看看如何使用 [State Handling](/state/schema/#client-side-schema-generation) 生成您的 `RoomState`

```haxe
client.joinOrCreate("room_name", [], RoomState, function(err, room) {
    if (err != null) {
        trace("JOIN ERROR: " + err);
        return;
    }

    room.state.entities.onAdd(function(entity, key) {
        trace("entity added at " + key + " => " + entity);

        entity.onChange(function (changes) {
            trace("entity has been changed");
        });
    })

    room.state.entities.onChange(function(entity, key) {
        trace("entity changed at " + key + " => " + entity);
    })

    room.state.entities.onRemove(function(entity, key) {
        trace("entity removed at " + key + " => " + entity);
    })
});
```

### 其他房間事件

房間 state 更新:

```haxe
room.onStateChange += function(state) {
  // 'state' 變量即是最新的完整的同步狀態
}
```

從服務器廣播的或者直接發給該客戶端的消息:

```haxe
room.onMessage("type", function (message) {
  trace(client.id + " received on " + room.name + ": " + message);
});
```

發生服務器錯誤:

```haxe
room.onError += function() {
  trace(client.id + " couldn't join " + room.name);
}
```

客戶端離開房間:

```haxe
room.onLeave += function() {
  trace(client.id + " left " + room.name);
}
```

## 運行演示項目

這個 [`example`](https://github.com/colyseus/colyseus-hx/blob/master/example/openfl) 項目可以被編譯為 `html5`, `neko`, `cpp`, `ios` 等平臺應用.

它使用了 [colyseus-examples](https://github.com/colyseus/colyseus-examples) 項目的 `state_handler` 房間, 您可以在 [這裏](https://github.com/colyseus/colyseus-examples/blob/master/rooms/02-state-handler.ts) 找到.

### 編譯演示項目為 `html5`

```
git clone https://github.com/colyseus/colyseus-hx.git
cd colyseus-hx/example/openfl
lime build project.xml html5
```

您可以 [於此](http://colyseus.io/colyseus-hx/) 運行實時在線演示項目.


## `ios` 目標警告

如果想編譯 iOS 應用, 您可能需要手動應用這個補丁: [HaxeFoundation/hxcpp@5f63d23](https://github.com/HaxeFoundation/hxcpp/commit/5f63d23768988ba2a4d4488843afab70d279a593)

> 詳情請見:
> http://community.openfl.org/t/solved-system-not-available-on-ios-with-xcode-9-0/9683?source\_topic\_id=10046
