# Defold SDK

Defold Engine 是一款用於跨平台發布的免費 2D 遊戲引擎。

[colyseus-defold](https://github.com/colyseus/colyseus-defold) SDK 已在 Defold 支持的所有主要平台上進行了測試，例如 HTML5、iOS、Android、Mac 和 Windows。

## 安裝

您需要將 [colyseus-defold](https://github.com/colyseus/colyseus-defold) 及其相依性新增到您的 `game.project` 相依性部分才能使用 SDK。

開啟您的 `game.project` 檔案，並將以下網址新增到`相依性`部分（在`專案 -> 相依性`下）：

    https://github.com/colyseus/colyseus-defold/archive/0.14.zip
    https://github.com/defold/extension-websocket/archive/refs/tags/2.2.3.zip

深入了解[重新顯示庫相依性](http://www.defold.com/manuals/libraries/)

您還可以透過複製相應的 zip 存檔 URL 來指定 SDK 的[特定版本](https://github.com/colyseus/colyseus-defold/releases)。

## 使用方式

\`\`\`lua local ColyseusClient = require "colyseus.client"

local client local room

function init(self) -- Add initialization code here client = ColyseusClient.new("ws://localhost:2567")

    -- join chat room
    client:join_or_create("chat", {}, function(err, _room)
      if err then
        print("JOIN ERROR: " .. err)
        return
      end

      room = _room
    end)
end \`\`\`

請參閱[用戶端文件](/client/client/)。

## 常見問答集

### 「我無法連接到本機伺服器！」

在 localhost 上執行時，請確保您沒有在埠口 80 上執行任何服務，否則客戶端將無法連接到指定的埠口編號。

或者，您可以將 Colyseus 伺服器綁定到埠口 80。

### 「`reconnect()` 無法在 iOS 上運作!」

如果您鎖定手機，則所有 WebSocket 連接都將關閉。您可以調用 `reconnect()` 來重新建立會話，這對 iOS 來說需要一個變通方法。

\`\`\`lua function window\_callback(self, event, data) if event == window.WINDOW\_EVENT\_FOCUS\_GAINED then -- iOS 在手機解鎖後重新啟動 WebSocket 連接的變通方法 room:send("whatever") end end

window.set\_listener(window\_callback) \`\`\`
