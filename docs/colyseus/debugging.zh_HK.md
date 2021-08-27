- [Inspector (`--inspect` flag)](#inspector)
- [调试消息](#debug-messages)

## 检测器

您可使用Node.js的内置检测器来调试您的应用程序。

!!!提示 查阅更多有关[调试 Node.js 应用](https://nodejs.org/en/docs/inspector/)的内容。

### 在生产环境中使用检测器

生产过程中需谨慎使用检测器。使用内存快照和断点会直接影响您的用户体验。

*1\.*连接到远程服务器：

``` ssh root@remote.example.com ```

*2\.*检查节点进程的 PID

``` ps aux | grep node ```

*3\.*将检测器附到进程中

``` kill -usr1 PID ```

*4\.*在您的本地机器中创建 SSH 通道以移除检测器

``` ssh -L 9229:localhost:9229 root@remote.example.com ```

您的生产服务器当前应显示在 [`chrome://inspect`](`chrome://inspect`) 中。

## 调试消息

使用 `DEBUG=colyseus:*` 环境变量运行您的服务器以启用全部调试日志

``` DEBUG=colyseus:* npm start ```

您也可以按类别启用调试日志打印功能。 

### `colyseus:patch`

记录广播到所有客户端的字节数和补丁下发的时间间隔。

``` colyseus:patch "chat" (roomId: "ryWiL5rLTZ") is sending 28 bytes: +57ms ```

### `colyseus:errors`

记录服务器端在任何时间出现的意外（或预知，内部）错误。

### `colyseus:matchmaking`

记录任何时间下的房间创建或配置行为。

``` colyseus:matchmaking spawning 'chat' on worker 77218 +52s colyseus:matchmaking disposing 'chat' on worker 77218 +2s ```
