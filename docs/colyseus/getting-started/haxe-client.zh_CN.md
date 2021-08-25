# Haxe SDK

我們鼓勵您將此 SDK 與任何 Haxe 遊戲引擎一起使用，例如：[OpenFL](https://www.openfl.org/)、[Kha](http://kha.tech/)、[HaxeFlixel](http://haxeflixel.com/)、[Heaps](https://heaps.io/)、[HaxePunk](http://haxepunk.com/) 等。

## 安裝

從 haxelib 安裝 {1>colyseus<1}：

{1> haxelib 安裝 colyseus <1}

## 使用方式

### 連接到伺服器：

\`\`haxe import io.colyseus.Client; 匯入 io.colyseus.Room;

var client = new Client('ws://localhost:2567'); \`\`\`

### 加入房間：

> 了解如何從 {2>State Handling<2} 生成您的 {1>RoomState<1}

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

### 其他房間活動

房間狀態已更新：

{1>haxe room.onStateChange += function(state) { // 'state' 變數上可用的全新狀態 } <1}

從伺服器或直接向此用戶端廣播的訊息：

{1>haxe room.onMessage("type", function (message) { trace(client.id + " received on " + room.name + ": " + message); }); <1}

發生伺服器錯誤：

{1>haxe room.onError += function() { trace(client.id + " couldn't join " + room.name); } <1}

客戶離開房間：

{1>haxe room.onLeave += function() { trace(client.id + " left " + room.name); } <1}

## 執行演示專案

[`示例`](https://github.com/colyseus/colyseus-hx/blob/master/example/openfl)專案可以編譯為 `html5`、`neko`、`cpp`、`ios` ， 等等。

其使用 {2>colyseus-examples<2} 專案中的 {1>state\_handler<1} 空間，您可以在{3>此處<3}找到該空間。

### 將演示項目編譯為 {1>html5<1}

{1> git clone https://github.com/colyseus/colyseus-hx.git cd colyseus-hx/example/openfllime build project.xml html5 <1}

您可以{1>在此處查看演示專案<1}。


## {1>ios<1} 目標警告

您可能需要手動套用此修補程式才能為 iOS 進行編譯：{1>HaxeFoundation/hxcpp@5f63d23<1}

> 更多資訊：http://community.openfl.org/t/solved-system-not-available-on-ios-with-xcode-9-0/9683?source\_topic\_id=10046
