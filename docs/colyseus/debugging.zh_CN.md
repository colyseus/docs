- [监测器 (`--inspect` 参数)](#监测器)
- [调试信息](#调试信息)

## 监测器

您可使用 Node.js 的内置监测器来调试您的应用程序.

!!!Tip 详情请见[调试 Node.js 应用](https://nodejs.org/en/docs/inspector/).

### 在生产环境中使用监测器

生产环境下请谨慎使用监测器. 使用内存快照和断点会直接影响您的用户体验.

*1.* 连接到远程服务器：

```ssh root@remote.example.com```

*2.* 查看 Node 进程的 PID

```ps aux | grep node```

*3.* 将监测器加挂到进程中

```kill -usr1 PID```

*4.* 在您的本地机器中创建 SSH 通道到远程监测器

```ssh -L 9229:localhost:9229 root@remote.example.com```

这样您的生产服务器就可以通过 [`chrome://inspect`](`chrome://inspect`) 来进行监测了.

## 调试信息

启动服务器时使用 `DEBUG=colyseus:*` 参数就可以启用全部的调试日志:

```DEBUG=colyseus:* npm start```

或者, 您也可以按类别记录调试日志.

### `colyseus:patch`

记录补丁字节数和发送到客户端的补丁间隔时间.

```colyseus:patch "chat" (roomId: "ryWiL5rLTZ") is sending 28 bytes: +57ms```

### `colyseus:errors`

记录服务器端发生的意外（或者是意料之中的, 亦或是内部的）错误.

### `colyseus:matchmaking`

记录房间的创建和释放情况.

```
colyseus:matchmaking spawning 'chat' on worker 77218 +52s
colyseus:matchmaking disposing 'chat' on worker 77218 +2s
```
