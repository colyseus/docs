# 狀態同步

Colyseus 透過其強力類型[`Schema`結構](/state/schema/)來自動處理狀態同步.

### 這是如何運作的？

- 當使用者成功加入房間時,其會自伺服器接收到完整的狀態.
- 在每個 [patchRate](/server/room/#patchrate-number) 中,狀態的二進位修補程式會傳送至每個用戶端(預設為 `50ms`)
- 當套用來自伺服器的修補程式時,會在用戶端觸發[回調](/state/schema/#callbacks)
- [`onStateChange`](/client/room/#onstatechange) 會在所有修補程式皆已套用至用戶端時觸發.
- 您的伺服器端邏輯可能會隨時變動房間狀態.連接的用戶端肯定能與伺服器同步.

![狀態同步圖表](state-sync.png)
