# Construct 3 SDK

## 安裝

- [下載 Construct 3 SDK](https://www.construct.net/en/make-games/addons/111/colyseus-multiplayer-client)

!!!警告「注意！您需要一個伺服器來使用 Colyseus！」 Construct 具有眾所周知的現有功能，可以從用戶端「託管」多人會話。這在使用 Colyseus 時是不可能的。Colyseus 是一個權威的 **伺服器**，其是用 Node.js 編寫而成。您不能讓您的用戶端直接託管遊戲會話。

!!! 提示「Construct 3 SDK:原始碼」您可以在此處找到 Construct SDK 的原始碼：[Construct 3](https://github.com/colyseus/colyseus-construct3)（與 Construct3 的 C3 和 C2 執行時間相容）/[Construct 2\\](https://github.com/colyseus/colyseus-construct2)（非最新 - 與伺服器 0.9.x 相容）

## 示例專案

示例專案的結果與 [TypeScript (pixijs-boilerplate)](https://github.com/endel/colyseus-pixijs-boilerplate) 類似。

- [用戶端（c3p 專案）](/_downloads/ColyAgarClient-0-14-0.c3p)
- [Glitch 上的伺服器端（原始碼）](https://glitch.com/~colyseus-construct3)


## 處理訊息

從伺服器向用戶端發送訊息時的一個重要注意事項：您需要提供一個帶有 `"type"` 欄位的物件，以便用戶端對其進行解析。

**伺服器端**

```typescript this.broadcast("foo", "bar"); ```

**用戶端**

使用 `On Message` 條件，以 `"foo"` 作為參數。表達式 `CurrentValue` 的值為 `"bar"`。


## 屬性

### 預設端點
用於「連接」操作的預設端點。

## 各項操作

### 將端點設為 {0}
格式：wss://example.com

### 加入帶有選項 {1} 的房間 {0}。
按名稱加入房間

### 加入帶有選項 {1} 的房間 {0}。
按名稱加入房間

### 使用選項 {1} 建立房間 {0}。
按名稱建立房間

### 加入帶有選項 {1} 的房間 {0}。
透過 ID 加入現有房間

### 使用 sessionId {1} 重新連接到房間 {0}。
使用之前連接的房間重新連接

### 使用 {1} 發送 {0}
向房間發送訊息

### 離開房間
斷開用戶端與房間的連接。

### 獲取可用的 {0} 個房間。
按名稱獲取可用房間，當資料可用時觸發 OnGetAvailableRooms。在表達式 CurrentValue 中作為 JSON 字串返回的資料

## 各種條件

### 加入
成功加入房間時觸發。

### 離開
從房間離開時觸發。

### 錯誤
當伺服器發生錯誤時觸發。

### 訊息 ({0})
當房間廣播訊息，或直接向該用戶端發送訊息時觸發。

### 狀態變化
當房間狀態改變時觸發。

### 獲取可用房間
當可用房間資料在 CurrentValue 表達式中準備就緒時觸發。

### 在 {0} 新增
將項目新增到 ArraySchema 或 MapSchema 時觸發。

### {0} 處的欄位變化
在 Schema 實例中變更欄位時觸發。需要使用

### 在 {0} 變更
在 ArraySchema 或 MapSchema 中更改項目時觸發。

### 在 {0} 移除
從 ArraySchema 或 MapSchema 中刪除項目時觸發。

### 索引值 {0}
僅適用於陣列和映射。檢查目前項目的索引值是否等於提供的值。

### 欄位 {0}
僅在直接物件「變更」期間可用。檢查欄位名稱是否已更改。

## 表達式

### JSON
宣告一個 JSON 值。

### CurrentValue
從目前項目中取值

### PreviousValue
從目前欄位獲取先前的值。僅在實例變數「變更」期間可用。不適用於陣列和映射。

### CurrentValueAt
從目前項目獲取嵌套值

### CurrentIndex
獲取目前項目的索引值。在「新增」、「變更」或「刪除」期間可用

### CurrentField
獲取正在變更的目前欄位。在「現場變更」期間可用

### State
從房間的狀態中取值

### SessionId
目前使用者的唯一 sessionId

### ErrorCode
獲取最後一條錯誤代碼

### ErrorMessage
獲取最後一條錯誤訊息
