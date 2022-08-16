# Construct 3 SDK

## 安裝

- [下載 Construct 3 SDK](https://www.construct.net/en/make-games/addons/111/colyseus-multiplayer-sdk)

!!! Warning "註意! 您需要一個伺服器來使用 Colyseus!"
    眾所周知 Construct 的現有功能可以從客戶端 "托管" 一個多人進程. 這在使用 Colyseus 時是不可能的.Colyseus 是一個權威性 **伺服器**, 由 Node.js 編寫. 您無法使您的客戶端直接托管遊戲進程.

!!! tip "Construct 3 SDK:Source code"
    您可以在此找到 Construct SDK 的源代碼: [Construct 3](https://github.com/colyseus/colyseus-construct3) (與 Construct3 的 C3 和 C2 執行時間兼容) / [Construct 2](https://github.com/colyseus/colyseus-construct2) (非最新版 - 與 0.9.x 伺服器兼容)

## 示例專案

示例專案與 [TypeScript (pixijs-boilerplate)](https://github.com/endel/colyseus-pixijs-boilerplate) 有相同的結果.

- [客戶端(c3p 專案)](/_downloads/ColyAgarClient-0-14-0.c3p)
- [Glitch 上的伺服器端(源代碼)](https://glitch.com/~colyseus-construct3)


## 處理消息

從伺服器向客戶端發送消息時的一個重要註意事項: 您需要提供一個擁有 `"type"` 字段的對象, 以便客戶端能夠進行解析.

**伺服器端**

```
typescript this.broadcast("foo", "bar");
```

**客戶端**

使用 `On Message` 條件, 以 `"foo"` 作為自變數. 表達式 `CurrentValue` 將擁有一個數值 `"欄"`.


## 屬性

### 預設端點
使用 "Connect" 行動的預設端點.

## 行動

### 設置端點為{0}
格式: wss://example.com

### 以{1}選項加入房間{0}.
以名稱加入房間

### 以{1}選項加入房間{0}.
以名稱加入房間

### 以{1}選項創建房間{0}.
以名稱創建房間

### 以{1}選項加入房間{0}.
以 ID 加入現有房間

### 以 sessionId {1} 重新連線至房間{0}.
使用之前連線過的房間重新連線

### 以{1}發送{0}
向一個房間發送消息

### 從房間離開
從房間斷開客戶端連線.

### 獲得可用的{0}房間.
以名稱獲得可用房間, 當數據可用時 OnGetAvailableRooms 觸發. 數據以 JSON 字符串 CurrentValue 表達式返回

## 條件

### 加入時
成功加入房間時觸發.

### 離開時
離開房間時觸發.

### 錯誤時
伺服器發生錯誤時觸發.

### On Message ({0})
當房間廣播一條消息, 或直接向本客戶端發送消息時觸發.

### 狀態改變時
當房間狀態改變時觸發.

### 獲得可用房間時
當可用的房間數據在 CurrentValue 表達式中準備好時觸發.

### 添加時{0}
當一個項添加至 ArraySchema 或 MapSchema 時觸發.

### 字段改變時{0}
當 Schema 實例中字段改變時觸發. 需要使用

### 改變時{0}
當 ArraySchema 或 MapSchema 中的一個項發生改變時觸發.

### 移除時{0}
當一個項從 ArraySchema 或 MapSchema 移除時觸發.

### 作為索引{0}
僅對 Arrays和Maps 可用. 檢查當前項的索引是否與提供的值相等.

### 作為字段{0}
只有在直接對象 "改變" 時可用. 檢查一個字段名是否被更改.

## 表達式

### JSON
聲明一個 JSON 值.

### CurrentValue
從當前項獲取值

### PreviousValue
從當前項獲取之前的值. 只有在實例變數 "改變" 時可用. arrays 和 maps 不可用.

### CurrentValueAt
從當前項獲取嵌套值

### CurrentIndex
從當前項獲取索引. "添加", "改變" 或 "移除" 時可用

### CurrentField
獲取被更改的當前字段. "字段更改" 時可用

### 狀態
獲取房間狀態的值

### SessionId
當前用戶的獨特 sessionId

### ErrorCode
獲取上一個錯誤代碼

### ErrorMessage
獲取上一條錯誤消息
