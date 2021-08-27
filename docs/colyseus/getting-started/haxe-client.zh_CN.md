# Haxe SDK

我們鼓勵您將此 SDK 與任何 Haxe 遊戲引擎一起使用，例如：[OpenFL](https://www.openfl.org/)、[Kha](http://kha.tech/)、[HaxeFlixel](http://haxeflixel.com/)、[Heaps](https://heaps.io/)、[HaxePunk](http://haxepunk.com/) 等。

## 安裝

從 haxelib 安裝 `colyseus`：

``` haxelib 安裝 colyseus ```

## 使用方式

### 連接到伺服器：

\`\`haxe import io.colyseus.Client; 匯入 io.colyseus.Room;

var client = new Client('ws://localhost:2567'); \`\`\`

### 加入房間：

> 了解如何從 [State Handling](/state/schema/#client-side-schema-generation) 生成您的 `RoomState`

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

```haxe room.onStateChange += function(state) { // 'state' 變數上可用的全新狀態 } ```

從伺服器或直接向此用戶端廣播的訊息：

```haxe room.onMessage("type", function (message) { trace(client.id + " received on " + room.name + ": " + message); }); ```

發生伺服器錯誤：

```haxe room.onError += function() { trace(client.id + " couldn't join " + room.name); } ```

客戶離開房間：

```haxe room.onLeave += function() { trace(client.id + " left " + room.name); } ```

## 執行演示專案

[`示例`](https://github.com/colyseus/colyseus-hx/blob/master/example/openfl)專案可以編譯為 `html5`、`neko`、`cpp`、`ios` ， 等等。

其使用 [colyseus-examples](https://github.com/colyseus/colyseus-examples) 專案中的 `state_handler` 空間，您可以在[此處](https://github.com/colyseus/colyseus-examples/blob/master/rooms/02-state-handler.ts)找到該空間。

### 將演示項目編譯為 `html5`

``` git clone https://github.com/colyseus/colyseus-hx.git cd colyseus-hx/example/openfllime build project.xml html5 ```

您可以[在此處查看演示專案](http://colyseus.io/colyseus-hx/)。


## `ios` 目標警告

您可能需要手動套用此修補程式才能為 iOS 進行編譯：[HaxeFoundation/hxcpp@5f63d23](https://github.com/HaxeFoundation/hxcpp/commit/5f63d23768988ba2a4d4488843afab70d279a593)

> 更多資訊：http://community.openfl.org/t/solved-system-not-available-on-ios-with-xcode-9-0/9683?source\_topic\_id=10046
