# Arena 伺服器 API

用來管理 Colyseus Arena 伺服器部署的一套易用, 高效, 高可用性的 API. 它是管理多地域部署的理想工具, 還可以用來向客戶端傳遞簡潔的配置信息. 通過 API 可以方便快捷地向客戶端用戶推送配置信息和服務入口.

## 開始使用
Arena 伺服器 API 可以用 Arena 儀表板部署為一個獨立的應用. 部署伺服器 API 應用需要您已加入付費計劃.

### 配置
伺服器 API 使用一個 JSON 文件進行配置. 首先在 Arena 儀表板的 **Server Code** 頁面新建 `config.json` 文件. 該文件不是必須按照下面那樣的格式, 最少需要配置 1 個伺服器, 可以隨意增加或者減少配置表中的伺服器.

**必要值**

- `url`: 這個是整個配置裏唯一必要的值, 它被用來輪詢檢查伺服器活動情況.
!!! NOTE
    - Arena 伺服器 API 僅在支持自動擴容縮容的 Arena 計劃 (Powered Ascent 及更高版本) 中可用.

**示例 `config.json`:**
```
{
   "servers": [
      {
         "name": "Game US-East 1",
         "region": "US",
         "url": "fake.colyseus.dev",
         "port": 443,
         "visible": true
      },
      {
         "name": "Game EU-Central 1",
         "region": "Germany",
         "url": "fake.colyseus.de",
         "port": 443,
         "visible": false
      }
   ]
}
```

### 部署 API
保存好配置文件然後點選右上角的 `Deploy` 按鈕即可進行部署. 記得先 ***check reload*** 再點 **Deploy**.

配置更新會被推送至伺服器硬盤然後啟動一個新 API 伺服器來應用更新, 新伺服器啟動 (約 20 - 30 秒) 之後老伺服器關閉. 這樣就能讓 API 服務在更新時也能無縫運行.

### 訪問 API
通過顯示於 **Manage** 頁面下的 URL 加上以下位址就可以訪問伺服器 API 了.  (**比如:** *abc123.colyseus.dev/api/v1/list*)

- `/api/v1/list`: 包括 `config.json` 文件配置的一組伺服器及它們當前的狀態, 連接數和遊戲伺服器數量.

- `/api/v1/listExpanded`: 包括每個應用部署的更詳細信息, 包括遊戲伺服器 ID 及其本地 IP 等. (未來會提供導向入口以便連接客戶端到指定的遊戲伺服器上).


**`/api/v1/list` 返回數據舉例:**
```
{
  "arena": [
    {
      "name": "Game US-East 1",             // 用戶定義
      "region": "US",                       // *
      "url": "fake.colyseus.dev",           // *
      "port": 443,                          // *
      "visible": true,                      // *

      "totalCCU": 0,                        // API生成
      "totalGameServers": 1,                // *
      "state": "active"                     // *
    },
    {
      "name": "Game EU-Central 1",          // 用戶定義
      "region": "Germany",                  // *
      "url": "fake.colyseus.de",            // *
      "port": 443,                          // *
      "visible": false,                     // *

      "state": "unreachable"                // API生成
    }
  ]
}
```
!!! NOTE
    - Arena 目前僅支持 2567, 80, 443 (SSL) 端口.
