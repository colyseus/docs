# Defold SDK

Defold Engine 是用於跨平臺發布的免費2D遊戲引擎.

[colyseus-defold](https://github.com/colyseus/colyseus-defold) SDK 已在 Defold 支持的所有主要平臺進行過測試, 比如 HTML5, iOS,  Android, Mac 和 Windows.

## 安裝

想要使用該 SDK, 您需要將 [colyseus-defold](https://github.com/colyseus/colyseus-defold) 以及其依賴關系添加至您的 `game.project` 依賴項部分.

打開您的 `game.project` 文件,添加以下 URL 至`Dependencies`部分(在 `Project -> Dependencies` 下):

    https://github.com/colyseus/colyseus-defold/archive/0.14.zip
    https://github.com/defold/extension-websocket/archive/refs/tags/2.2.3.zip

閱讀更多關於 [Defold 庫依賴](http://www.defold.com/manuals/libraries/) 的資訊

您也可以通過復製其各自的 zip 存檔 URL,來指定該 SDK 的[具體版本](https://github.com/colyseus/colyseus-defold/releases).

## 用法

```lua
local ColyseusClient = require "colyseus.client"

local client
local room

function init(self)
    -- Add initialization code here
    client = ColyseusClient.new("ws://localhost:2567")

    -- join chat room
    client:join_or_create("chat", {}, function(err, _room)
      if err then
        print("JOIN ERROR: " .. err)
        return
      end

      room = _room
    end)
end
```

參閱[>客戶端](/client/client/).

## 常見問題

### "我無法連線至本地伺服器!"

在本地伺服器上執行時,確保端口 80 上沒有執行任何服務,否則,客戶端將不會連線到指定的端口號.

或者, 您也可以將 Colyseus 伺服器綁定至端口80.

### "`reconnect()` 在 iOS 上無效!"

如果您的手機鎖屏,所有 WebSocket 連線都將關閉.您可以調用 `reconnect()` 來重新建立進程,這需要對 iOS 采取以下解決辦法:

```lua
function window_callback(self, event, data)
    if event == window.WINDOW_EVENT_FOCUS_GAINED then
        -- iOS workaround to re-active WebSocket connection after phone is unlocked
        room:send("whatever")
    end
end

window.set_listener(window_callback)
```
