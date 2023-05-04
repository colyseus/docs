- [监测器 (`--inspect` 参数)](#监测器)
- [调试信息](#调试信息)

## 监测器

您可使用 Node.js 的内置监测器来调试您的应用程序.

!!! Tip
    详情请参考 [调试 Node.js 应用](https://nodejs.org/en/docs/inspector/).

### 在商用环境下使用监测器

商用环境下请谨慎使用监测器. 使用内存快照和断点会直接影响您的用户体验.

*1.* 连接到远程服务器:

```
ssh root@remote.example.com
```

*2.* 查看 Node 进程的 PID

```
ps aux | grep node
```

*3.* 将监测器加挂到进程中

```
kill -usr1 PID
```

*4.* 在您的本地机器中创建 SSH 通道到远程监测器

```
ssh -L 9229:localhost:9229 root@remote.example.com
```

这样您的生产服务器就可以通过 [`chrome://inspect`](`chrome://inspect`) 来进行监测了.

## 调试信息

启动服务器时使用 `DEBUG=colyseus:*` 参数就可以启用全部的调试日志:

```
DEBUG=colyseus:* npm start
```

- `colyseus:errors`: 记录服务端发生异常的 (或者故意的, 内部的) 错误.
- `colyseus:matchmaking`: 记录房间被新建或销毁.
- `colyseus:message`: 记录流入/流出的房间消息.
- `colyseus:patch`: 记录广播至客户端的数据补丁的字节大小和间隔时间.
- `colyseus:connection`: 记录客户端与服务器的连接.
<!-- - `colyseus:driver`:  -->
<!-- - `colyseus:presence`:  -->