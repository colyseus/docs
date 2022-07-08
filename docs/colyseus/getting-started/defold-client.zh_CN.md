# Defold SDK

Defold Engine 一个是跨平台发布的免费2D游戏引擎.

[colyseus-defold](https://github.com/colyseus/colyseus-defold) SDK 已在 Defold 支持的所有主要平台进行过测试, 比如 HTML5, iOS,  Android, Mac 和 Windows.

## 安装

想要使用该 SDK, 您需要将 [colyseus-defold](https://github.com/colyseus/colyseus-defold) 以及其依赖库添加到项目 `game.project` 文件的 dependencies 部分.

打开您的 `game.project` 文件, 添加以下 URL 至 `Dependencies` 部分 (位于 `Project -> Dependencies` 下):

    https://github.com/colyseus/colyseus-defold/archive/0.14.zip
    https://github.com/defold/extension-websocket/archive/refs/tags/3.1.0.zip

更多详情参见 [Defold 库依赖](http://www.defold.com/manuals/libraries/)

您也可以通过复制某个 zip 档的 URL, 来使用 SDK 的 [指定版本](https://github.com/colyseus/colyseus-defold/releases).

## 用法

```lua
local ColyseusClient = require "colyseus.client"

local client
local room

function init(self)
    -- 此处添加初始化代码
    client = ColyseusClient.new("ws://localhost:2567")

    -- 进入聊天房间
    client:join_or_create("chat", {}, function(err, _room)
      if err then
        print("JOIN ERROR: " .. err)
        return
      end

      room = _room
    end)
end
```

参考 [客户端文档](/client/).

## 常见问题

### "我无法连接至本地服务器!"

在本地服务器上运行时, 请确保端口 80 上没有运行着任何服务,
否则客户端将无法连接到指定的端口号.

或者, 您也可以将 Colyseus 服务器绑定至端口 80.

### "`reconnect()` 在 iOS 上无效!"

如果您的手机锁屏, 所有 WebSocket 连接都将被关闭. 您可以调用 `reconnect()` 来重新连接并恢复 session, 这需要对 iOS 采取以下解决办法:

```lua
function window_callback(self, event, data)
    if event == window.WINDOW_EVENT_FOCUS_GAINED then
        -- iOS 锁屏后断线断线重连的临时解决办法
        room:send("whatever")
    end
end

window.set_listener(window_callback)
```
