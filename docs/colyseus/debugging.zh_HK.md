- {1>Inspector ({2>--inspect<2} flag)<1}
- [调试消息](#debug-messages)

## 检测器

您可使用Node.js的内置检测器来调试您的应用程序。

!!!提示 查阅更多有关{1>调试 Node.js 应用<1}的内容。

### 在生产环境中使用检测器

生产过程中需谨慎使用检测器。使用内存快照和断点会直接影响您的用户体验。

{1}连接到远程服务器：

{1> ssh root@remote.example.com <1}

{1}检查节点进程的 PID

{1> ps aux | grep node <1}

{1}将检测器附到进程中

{1> kill -usr1 PID <1}

{1}在您的本地机器中创建 SSH 通道以移除检测器

{1> ssh -L 9229:localhost:9229 root@remote.example.com <1}

您的生产服务器当前应显示在 {1>{2>chrome://inspect<2}<1} 中。

## 调试消息

使用 {1>DEBUG=colyseus:\*<1} 环境变量运行您的服务器以启用全部调试日志

{1> DEBUG=colyseus:* npm start <1}

您也可以按类别启用调试日志打印功能。 

### {1>colyseus:patch<1}

记录广播到所有客户端的字节数和补丁下发的时间间隔。

{1> colyseus:patch "chat" (roomId: "ryWiL5rLTZ") is sending 28 bytes: +57ms <1}

### {1>colyseus:errors<1}

记录服务器端在任何时间出现的意外（或预知，内部）错误。

### {1>colyseus:matchmaking<1}

记录任何时间下的房间创建或配置行为。

{1> colyseus:matchmaking spawning 'chat' on worker 77218 +52s colyseus:matchmaking disposing 'chat' on worker 77218 +2s <1}
