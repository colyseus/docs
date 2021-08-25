# Haxe SDK

我们欢迎你将 SDK 与任何 Haxe 游戏引擎一同使用，比如：[OpenFL](https://www.openfl.org/)、[Kha](http://kha.tech/)、[HaxeFlixel](http://haxeflixel.com/)、[Heaps](https://heaps.io/)、[HaxePunk](http://haxepunk.com/)等。

## 安装

从 haxelib 安装 {1>colyseus<1}：

{1> haxelib install colyseus <1}

## 用法

### 连接至服务器：

\`\`\`haxe import io.colyseus.Client; import io.colyseus.Room;

var client = new Client('ws://localhost:2567'); \`\`\`

### 加入房间：

> 看看如何从 {2>State Handling<2} 生成你的{1>RoomState<1}

\`\`\`haxe client.joinOrCreate("room\_name", \[], RoomState, function(err, room) { if (err != null) { trace("JOIN ERROR: " + err); return; }

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
}); \`\`\`

### 其他房间事件

房间状态已更新：

{1>haxe room.onStateChange += function(state) { // full new state avaialble on 'state' variable } <1}

从服务器广播的消息或直接发给本客户端的消息：

{1>haxe room.onMessage("type", function (message) { trace(client.id + " received on " + room.name + ": " + message); }); <1}

发生服务器错误：

{1>haxe room.onError += function() { trace(client.id + " couldn't join " + room.name); } <1}

服务器离开房间：

{1>haxe room.onLeave += function() { trace(client.id + " left " + room.name); } <1}

## 运行演示项目

[`example`](https://github.com/colyseus/colyseus-hx/blob/master/example/openfl) 项目可以被编译为`html5`、`neko`、`cpp`、`ios` 等。

它使用来自 {2>colyseus-examples<2} 项目的 {1>state\_handler<1} 房间，你可以在{3>此<3}找到。

### 编译演示项目为 {1>html5<1}

{1> git clone https://github.com/colyseus/colyseus-hx.git cd colyseus-hx/example/openfl lime build project.xml html5 <1}

你可以{1>在此<1}查看实时演示项目。


## {1>ios<1} 目标警告

如果想在 iOS 上编译，你可能需要手动应用该补丁：{1>HaxeFoundation/hxcpp@5f63d23<1}

> 详情请见：http://community.openfl.org/t/solved-system-not-available-on-ios-with-xcode-9-0/9683?source\_topic\_id=10046
