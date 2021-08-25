# 服务器 API » 优雅关闭

Colyseus 默认提供合理的关闭机制。将在进程终止之前执行这些操作：

- 异步断开所有连接的客户端 ({1>Room#onLeave<1})
- 异步处理所有生成的房间 ({1>Room#onDispose<1})
- 在关闭进程之前执行可选的异步回调 {1>Server#onShutdown<1}

如果在 {1>onLeave<1} / {2>onDispose<2} 时执行异步任务，您应该返回一个 {3>Promise<3}，并在任务准备好时完成它。对于 {4>onShutdown(callback)<4}，也是如此。


## 返回一个 {1>Promise<1}

通过返回 {1>Promise<1}，服务器将等待它们完成，然后终止工作进程。

\`\`\`typescript import { Room } from "colyseus";

class MyRoom extends Room { onLeave (client) { return new Promise((resolve, reject) => { doDatabaseOperation((err, data) => { if (err) { reject(err); } else { resolve(data); } }); }); }

    onDispose () {
        return new Promise((resolve, reject) => {
            doDatabaseOperation((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
} \`\`\`

## 使用 {1>异步<1}

{1>async<1} 关键字将使函数在后台返回一个 {2>Promise<2}。{3>阅读更多有关异步/等待的信息<3}。

\`\`\`typescript import { Room } from "colyseus";

class MyRoom extends Room { async onLeave (client) { await doDatabaseOperation(client); }

    async onDispose () {
        await removeRoomFromDatabase();
    }
} \`\`\`

## 进程关闭回调

还可以通过设置 {1>onShutdown<1} 回调来监听进程关闭。

\`\`\`typescript fct\_label="Server" import { Server } from "colyseus";

let server = new Server();

server.onShutdown(function () { console.log("master process is being shut down!"); }); \`\`\`
