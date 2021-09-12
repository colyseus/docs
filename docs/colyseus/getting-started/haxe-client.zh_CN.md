# Haxe SDK

我们欢迎您将 SDK 与任何 Haxe 游戏引擎一同使用,比如：[OpenFL](https://www.openfl.org/), [Kha](http://kha.tech/), [HaxeFlixel](http://haxeflixel.com/), [Heaps](https://heaps.io/), [HaxePunk](http://haxepunk.com/) 等.

## 安装

从 haxelib 安装 `colyseus`：

```
haxelib install colyseus
```

## 用法

### 连接至服务器：

```haxe
import io.colyseus.Client;
import io.colyseus.Room;

var client = new Client('ws://localhost:2567');
```

### 加入房间：

> 看看如何从 [State Handling](/state/schema/#client-side-schema-generation) 生成您的 `RoomState`

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

### 其他房间事件

房间状态已更新：

```haxe
room.onStateChange += function(state) {
  // full new state avaialble on 'state' variable
}
```

从服务器广播的消息或直接发给本客户端的消息：

```haxe
room.onMessage("type", function (message) {
  trace(client.id + " received on " + room.name + ": " + message);
});
```

发生服务器错误：

```haxe
room.onError += function() {
  trace(client.id + " couldn't join " + room.name);
}
```

服务器离开房间：

```haxe
room.onLeave += function() {
  trace(client.id + " left " + room.name);
}
```

## 运行演示项目

[`example`](https://github.com/colyseus/colyseus-hx/blob/master/example/openfl) 项目可以被编译为 `html5`, `neko`, `cpp`, `ios` 等.

它使用来自 [colyseus-examples](https://github.com/colyseus/colyseus-examples) 项目的 `state_handler` 房间,您可以在 [这里](https://github.com/colyseus/colyseus-examples/blob/master/rooms/02-state-handler.ts) 找到.

### 编译演示项目为 `html5`

```
git clone https://github.com/colyseus/colyseus-hx.git
cd colyseus-hx/example/openfl
lime build project.xml html5
```

您可以 [在此](http://colyseus.io/colyseus-hx/) 查看实时演示项目.


## `ios` 目标警告

如果想在 iOS 上编译,您可能需要手动应用该补丁：[HaxeFoundation/hxcpp@5f63d23](https://github.com/HaxeFoundation/hxcpp/commit/5f63d23768988ba2a4d4488843afab70d279a593)

> 详情请见：http://community.openfl.org/t/solved-system-not-available-on-ios-with-xcode-9-0/9683?source\_topic\_id=10046
