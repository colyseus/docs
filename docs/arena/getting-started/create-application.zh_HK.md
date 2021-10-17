# 應用部署

### 需求

* [註冊](https://console.colyseus.io/register) Arena Cloud 賬戶
* 兼容 [Arena Cloud](../create-colyseus-server/) 的 Colyseus 伺服器應用

## 創建應用部署

您的遊戲或應用可以有許多應用部署, 用於分各類應用環境 (開發, 模擬, 生產) 或 區域 (美國東部, 歐盟西部, 亞太南部). 每個應用部署都有自己的專用資源池, 獨立於其他部署執行.

開始創建您的第一個應用部署...

![新建應用按鈕](../../images/create-new-app.jpg)

- 登錄後點選儀表板右上角的 **Create A New App (創建新應用)**.

- 填寫應用詳細信息字段, 並選擇您的 *Plan (計劃)* 和 *Region (地區)*

- 如果您的受邀試用郵件中提供了 **Arena Code**, 請在 *Code (代碼)* 字段中輸入該代碼.

![註冊流程](../../images/create-app.jpg)

- 提交並等待創建您的應用創建成功

!!! NOTE
    新應用部署最多可能需要 2 分鐘的時間, 具體取決於您選定的地區
    受邀試用用戶 *必須* 使用 Arena **CODE** 來創建新應用

## 應用儀表板

在您新創建的應用上選擇 **Manage (管理)**, 即可進入應用儀表板. 在這裏可以看到活動統計快照和各種工具, 以更新代碼, 查看活動伺服器, 重啟應用以及查看日誌.

![Arena 應用管理界面](../../images/app-manage-details.jpg)

- **Current Usage (當前使用情況):** 顯示當前 CCU 以及超過 Arena 計劃的部分 (如果真的超過了的話)
- **Connection (連接):** 用於訪問您的應用的 URL 和端口
- **API Key (API 秘鑰):** 應用的唯一標識符, 用來通過 Arena Public API 訪問應用部署
- **Arena Plan (Arena 計劃):** 您的應用註冊的托管計劃.
- ***GIT Updated (GIT 更新):*** 最新 GIT 更新的信息.
- ***GIT Msg (GIT 消息):*** 最新更新的登錄信息.
- ***GIT Hash (GIT 哈希):*** 最新更新的哈希值.
!!! NOTE
    僅當使用 CI/CD GitSync 服務時, ***才能*** 看到 ***GIT*** 的詳細信息 (用於 Powered Ascent 及更高計劃版本)
