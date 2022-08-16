# 狀態數據同步

Colyseus 通過其強類型的 [`Schema` 結構](/state/schema/) 自動進行狀態同步.

### 它是如何運作的?

- 當用戶成功加入房間時, 將從服務器接收取完整 state.
- 每個 [補丁幀](/server/room/#patchrate-number), 都會把 state 的二進製差別補丁發送給每個客戶端 (默認頻率為 `50ms`).
- 客戶端收到補丁時, 會觸發 [schema 回調函數](/state/schema/#callbacks).
- 客戶端收到並同步全部最新補丁後, 觸發 [`onStateChange` 函數](/client/room/#onstatechange).
- 服務端邏輯可以隨時任意更改 state, 已連接的客戶端總是會與服務器保持同步.

![state 同步](state-sync.png)