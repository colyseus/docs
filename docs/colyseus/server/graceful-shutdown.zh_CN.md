# 伺服器 API » 順利關機

Colyseus 預設提供了順利關機機制。這些動作會在處理序自行終止前執行：

- 非同步中斷連接所有連接的用戶端 ({1>Room#onLeave<1})
- 非同步處置或有產生的房間 ({1>Room#onDispose<1})
- 在關閉處理序 {1>Server#onShutdown<1} 前執行選擇性非同步回調

如果您正在 {1>onLeave<1} / {2>onDispose<2} 執行非同步工作，您應傳回 {3>Promise<3}，並在工作就緒前加以解析。同樣情況也會套用在 {4>onShutdown（回調）<4}。


## 傳回{1>承諾<1}

透過傳回{1>承諾<1}，伺服器不會在終止背景工作處理序前等待其完成。

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

## 正在使用{1>非同步<1}

{1>非同步<1}關鍵字能讓您的函式傳回基礎{2>承諾<2}。{3>閱讀有關非同步 / 等候的更多資訊<3}。

\`\`\`typescript import { Room } from "colyseus";

class MyRoom extends Room { async onLeave (client) { await doDatabaseOperation(client); }

    async onDispose () {
        await removeRoomFromDatabase();
    }
} \`\`\`

## 處理序關閉回調

您也可以透過設定 {1>onShutdown<1} 回調來接聽處理序關機。

\`\`\`typescript fct\_label="Server" import { Server } from "colyseus";

let server = new Server();

server.onShutdown(function () { console.log("master process is being shut down!"); }); \`\`\`
