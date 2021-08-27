# 常見問答集

### 一個Colyseus伺服器能處理多少CCU？

Colyseus伺服器可以處理的最大併發用戶數（CCU）將根據您遊戲迴圈的CPU密集程度以及您的伺服器向用戶端發送的流量而有所變化。

Linux伺服器預設的"檔案描述符限制"（您可以擁有的開放連接數）大約是1024 - 此值可以增加，但風險自負。因此，您可以安全地假設最便宜的雲端伺服器能夠容納1024個併發連接。有報告稱，人們設法擁有多達[60萬個開放的WebSocket連接](https://blog.jayway.com/2015/04/13/600k-concurrent-websocket-connections-on-aws-using-node-js/)，即使其為空閒連接，也不傳輸資料 - 這證明，您有可能透過微調伺服器規格和配置處理超過1024個併發連接。

### `"錯誤：座位預訂過期"`是什麼意思？

此項錯誤意味著用戶端未能及時與房間建立連接。在生產環境中，您可能會看到該項錯誤時常發生。[您可以增加限制](/server/room/#setseatreservationtime-seconds)。

### 我怎樣才能將`狀態`的資料只同步到一個特定的用戶端？

您可以使用[schema filters](/state/schema/#filtering-data-per-client)，和/或透過[room's send method](/server/client/#sendtype-message)手動發送資料到各個用戶端。

### Colyseus是否幫助我進行用戶端預測？

Colyseus並沒有提供任何用戶端預測的解決方案。像[wilds.io](http://wilds.io/)和[mazmorra.io](https://mazmorra.io/)這樣的遊戲不使用任何形式的用戶端預測。[`lerp`](http://gamestd.io/mathf/globals.html#lerp)的用戶座標通常會得到合理的結果。

### 我得到了此類錯誤：`類別構造函數Room不能在沒有'new'的情況下調用"`，我應該怎麼做？

請確保您的`tsconfig.json`中有`es2015`或更高版本。

```javascript { "compilerOptions": { // ... "target": "es2015", // ... }, // ... } ```
