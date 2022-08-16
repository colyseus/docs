# Defold SDK

Defold Engine 一個是跨平臺發布的免費2D遊戲引擎.

[colyseus-defold](https://github.com/colyseus/colyseus-defold) SDK 已在 Defold 支持的所有主要平臺進行過測試, 比如 HTML5, iOS,  Android, Mac 和 Windows.

## 安裝

想要使用該 SDK, 您需要將 [colyseus-defold](https://github.com/colyseus/colyseus-defold) 以及其依賴庫添加到項目 `game.project` 文件的 dependencies 部分.

打開您的 `game.project` 文件, 添加以下 URL 至 `Dependencies` 部分 (位於 `Project -> Dependencies` 下):

    https://github.com/colyseus/colyseus-defold/archive/0.14.zip
    https://github.com/defold/extension-websocket/archive/refs/tags/3.1.0.zip

更多詳情參見 [Defold 庫依賴](http://www.defold.com/manuals/libraries/)

您也可以通過復製某個 zip 檔的 URL, 來使用 SDK 的 [指定版本](https://github.com/colyseus/colyseus-defold/releases).

## 用法

```lua
local ColyseusClient = require "colyseus.client"

local client
local room

function init(self)
    -- 此處添加初始化代碼
    client = ColyseusClient.new("ws://localhost:2567")

    -- 進入聊天房間
    client:join_or_create("chat", {}, function(err, _room)
      if err then
        print("JOIN ERROR: " .. err)
        return
      end

      room = _room
    end)
end
```

參考 [客戶端文檔](/client/).

## 常見問題

### "我無法連接至本地服務器!"

在本地服務器上運行時, 請確保端口 80 上沒有運行著任何服務,
否則客戶端將無法連接到指定的端口號.

或者, 您也可以將 Colyseus 服務器綁定至端口 80.

### "`reconnect()` 在 iOS 上無效!"

如果您的手機鎖屏, 所有 WebSocket 連接都將被關閉. 您可以調用 `reconnect()` 來重新連接並恢復 session, 這需要對 iOS 采取以下解決辦法:

```lua
function window_callback(self, event, data)
    if event == window.WINDOW_EVENT_FOCUS_GAINED then
        -- iOS 鎖屏後斷線斷線重連的臨時解決辦法
        room:send("whatever")
    end
end

window.set_listener(window_callback)
```
