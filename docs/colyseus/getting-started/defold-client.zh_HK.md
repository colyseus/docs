# Defold SDK

Defold Engine 是用于跨平台发布的免费2D游戏引擎。

[colyseus-defold](https://github.com/colyseus/colyseus-defold) SDK已在 Defold 支持的所有主要平台进行过测试，比如 HTML5、iOS、 Android、Mac 和 Windows。

## 安装

想要使用该 SDK，你需要将 [colyseus-defold](https://github.com/colyseus/colyseus-defold) 以及其依赖关系添加至你的 `game.project` 依赖项部分。

打开你的 `game.project` 文件，添加以下 URL 至`Dependencies`部分（在 `Project -> Dependencies` 下）：

    https://github.com/colyseus/colyseus-defold/archive/0.14.zip
    https://github.com/defold/extension-websocket/archive/refs/tags/2.2.3.zip

阅读更多关于 [Defold 库依赖](http://www.defold.com/manuals/libraries/)的信息

你也可以通过复制其各自的 zip 存档 URL，来指定该 SDK 的[具体版本](https://github.com/colyseus/colyseus-defold/releases)。

## 用法

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

参阅[>客户端](/client/client/)。

## 常见问题

### “我无法连接至本地服务器！”

在本地服务器上运行时，确保端口 80 上没有运行任何服务，否则，客户端将不会连接到指定的端口号。

或者，你也可以将 Colyseus 服务器绑定至端口80。

### “`reconnect()` 在 iOS 上无效！”

如果你的手机锁屏，所有 WebSocket 连接都将关闭。你可以调用 `reconnect()` 来重新建立进程，这需要对 iOS 采取以下解决办法：

\`\`\`lua function window\_callback(self, event, data) if event == window.WINDOW\_EVENT\_FOCUS\_GAINED then -- iOS workaround to re-active WebSocket connection after phone is unlocked room:send("whatever") end end

window.set\_listener(window\_callback) \`\`\`
