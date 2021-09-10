# GitSync（PA 及以上）

### 相關要求

* 僅適用於 **Powered Ascent** 計劃及更高版本。

## 設定您的配置檔案

若要配置 git sync，您需要將以下 ```arena.gitsync.json``` JSON 檔案新增到伺服器代碼的根資料夾並將其部署到您的應用程式。 

同步服務大約每 2 分鐘將拉取您的 Git 儲存庫，以在請求的分支中進行新的簽入。 

## arena.gitsync.json 示例
```
{
    "serverDir": "upload",
    "buildType": "arena",
    "gitServer": "github.com/Lucid-Sight-Inc/testsyncrepo.git",
    "gitUser": "USER",
    "gitPassword": "PASS",
    "branch" : "testbranch",
    "redeployOnChange": true,
    "overrideGitURL": "",
    "repoReset" : false
}
```

**JSON 屬性：**

- **serverDir:**這是上傳代碼所在的儲存庫根目錄的位置。如果您將使用 'npm run build' 來建立您的部署代碼，則將此命令輸出檔案的目錄放在此處。

- **buildType:**此屬性有兩個選項。 
    - `arena` \- 此選項將在嘗試從 serverDir 複製文件之前執行 ```npm install && npm run build```。 
    - `none` \- 直接從 serverDir 資料夾複製檔案，無需運行任何建置命令。如果您的伺服器代碼在您簽入之前已經編譯並準備好在 Arena Cloud 上執行，請使用此選項。

- **gitServer:**您的 git 儲存庫網址。

- **gitUser:**至少對您的儲存庫具有讀取權限的使用者帳戶。

- **gitPassword:**密碼 ***（密碼若含有任何特殊字符，則必須採用 URL 編碼）***

- **branch:**要從中提取的分支名稱。

- **redeployOnChange:**如果為 true，您的新代碼將立即部署到您的遊戲伺服器並重新啟動，從而結束相關伺服器上的所有現有遊戲（將在接下來的幾週內實施正常滾動更新）。

- **overrideGitURL: ** 對於您的儲存庫的任何非標準/非 https URL（我們不建議使用此選項）。

- **repoReset:**這將強制刪除 git 同步伺服器上儲存庫的本機副本。如果您要將 REPO 更改為指向新位置，這將非常有用。您需要將其保持開啟一個更新周期，然後才能將其關閉。

## 檢查狀態

您可以使用應用程式資訊中心的***相關部署***部分檢查同步狀態或查找任何錯誤。選擇伺服器標籤旁邊的日誌 **Git 同步服務**，以查看最近的日誌/錯誤。

![Arena 應用程式管理視圖](../../images/git-sync-logs.jpg)

## 疑難排解
如果您在同步過程中遇到合併衝突或其他未知/嚴重錯誤，我們建議您從 **Git 同步服務**的部署畫面中選擇**重新啟動**。重新啟動 GitSync 服務將清除本機儲存庫並在重新啟動時拉出一個新副本。
