# 常見問題

### 一個 Colyseus 服務器能夠承載多少 CCU?!

一個 Colyseus 服務器能夠承載的最大並發用戶數將取決於您的遊戲的 CPU 運算密集程度以及您的服務器向客戶端發送的數據流量.

Linux 默認的 "file descriptor limit" (最大連接數) 限製為 1024 —— 可以根據需要酌情調整. 所以, 即使是最便宜的雲端服務器也能夠容納1024個並發用戶. 據說有人通過配置打開了 [60萬個 WebSocket 連接](https://blog.jayway.com/2015/04/13/600k-concurrent-websocket-connections-on-aws-using-node-js/), 即使是沒有數據傳輸的空連接 —— 這也證明了通過配置完全可以容納超過 1024 個連接的限製.

### `"Error: seat reservation expired"` 是什麽意思??

該錯誤意味著客戶端未能在一定時間段內與房間完成連接. 通常在商用環境下會經常見到該錯誤. [可以適當提高超時設置](/server/room/#setseatreservationtime-seconds).

### 我該如何將 `state` 數據只同步給一位特定客戶端?

您可以使用 [schema filters](/state/schema/#filtering-data-per-client),或者通過 [room 的 send 方法](/server/client/#sendtype-message) 將數據手動發送給每個客戶端.

### Colyseus 是否會幫助我進行客戶端預測?

Colyseus 本身不提供現成的客戶端預測方法. 像 [wilds.io](http://wilds.io/) 和 [mazmorra.io](https://mazmorra.io/) 這樣的遊戲並沒有使用任何形式的客戶端預測. 把用戶坐標進行 [`補間插值`](http://gamestd.io/mathf/globals.html#lerp) 的效果通常不錯.

### 爆出這個錯誤: `"Class constructor Room cannot be invoked without 'new'"`, 我該怎麽辦?

請確定在您的 `tsconfig.json` 文件裏開啟了 `es2015` 或更新的編譯配置:

```javascript
{
    "compilerOptions": {
        // ...
        "target": "es2015",
        // ...
    },
    // ...
}
```
