# Haxe SDK

我們歡迎您將 SDK 與任何 Haxe 遊戲引擎一同使用,比如：[OpenFL](https://www.openfl.org/), [Kha](http://kha.tech/), [HaxeFlixel](http://haxeflixel.com/), [Heaps](https://heaps.io/), [HaxePunk](http://haxepunk.com/) 等.

## 安裝

從 haxelib 安裝 `colyseus`：

```
haxelib install colyseus
```

## 用法

### 連線至伺服器：

```haxe
import io.colyseus.Client;
import io.colyseus.Room;

var client = new Client('ws://localhost:2567');
```

### 加入房間：

> 看看如何從 [State Handling](/state/schema/#client-side-schema-generation) 生成您的 `RoomState`

```haxe
client.joinOrCreate("room_name", [], RoomState, function(err, room) {
    if (err != null) {
        trace("JOIN ERROR: " + err);
        return;
    }

    room.state.entities.onAdd = function(entity, key) {
        trace("entity added at " + key + " => " + entity);

        entity.onChange = function (changes) {
            trace("entity changes => " + changes);
        }
    }

    room.state.entities.onChange = function(entity, key) {
        trace("entity changed at " + key + " => " + entity);
    }

    room.state.entities.onRemove = function(entity, key) {
        trace("entity removed at " + key + " => " + entity);
    }
});
```

### 其他房間事件

房間狀態已更新：

```haxe
room.onStateChange += function(state) {
  // full new state avaialble on 'state' variable
}
```

從伺服器廣播的消息或直接發給本客戶端的消息：

```haxe
room.onMessage("type", function (message) {
  trace(client.id + " received on " + room.name + ": " + message);
});
```

發生伺服器錯誤：

```haxe
room.onError += function() {
  trace(client.id + " couldn't join " + room.name);
}
```

伺服器離開房間：

```haxe
room.onLeave += function() {
  trace(client.id + " left " + room.name);
}
```

## 執行演示專案

[`example`](https://github.com/colyseus/colyseus-hx/blob/master/example/openfl) 專案可以被編譯為 `html5`, `neko`, `cpp`, `ios` 等.

它使用來自 [colyseus-examples](https://github.com/colyseus/colyseus-examples) 專案的 `state_handler` 房間,您可以在 [這裏](https://github.com/colyseus/colyseus-examples/blob/master/rooms/02-state-handler.ts) 找到.

### 編譯演示專案為 `html5`

```
git clone https://github.com/colyseus/colyseus-hx.git
cd colyseus-hx/example/openfl
lime build project.xml html5
```

您可以 [在此](http://colyseus.io/colyseus-hx/) 查看實時演示專案.


## `ios` 目標警告

如果想在 iOS 上編譯,您可能需要手動應用該補丁：[HaxeFoundation/hxcpp@5f63d23](https://github.com/HaxeFoundation/hxcpp/commit/5f63d23768988ba2a4d4488843afab70d279a593)

> 詳情請見：http://community.openfl.org/t/solved-system-not-available-on-ios-with-xcode-9-0/9683?source\_topic\_id=10046
