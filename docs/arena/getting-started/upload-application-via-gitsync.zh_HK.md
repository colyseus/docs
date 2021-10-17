# GitSync (PA 及更高版本)

### 需求

* 僅適用於 **Powered Ascent** 計劃及更高計劃版本.

## 配置文件

要使用 git 同步, 需要將如下 ```arena.gitsync.json``` 文件添加到伺服器代碼的根目錄並將其部署到您的應用中.

同步服務大約每 2 分鐘從 Git 托管庫的指定分支中拉取更新.

## arena.gitsync.json 範例
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

**JSON 屬性:**

- **serverDir:** 這是您上傳的代碼被保存的根目錄. 如果用 "npm run build" 創建部署代碼, 應將此文件夾作為輸出目標文件夾.

- **buildType:** 此屬性有兩個可選項.
    - `arena` - 在從 serverDir 復製文件之前執行 ```npm install && npm run build```.
    - `none` - 直接從 serverDir 文件夾復製文件, 不執行任何命令. 如果伺服器代碼已被編譯好可以直接在 Arena Cloud 上執行, 請使用此選項.

- **gitServer:** 您的 git 托管庫位址.

- **gitUser:** 您的 git 托管庫帳戶, 至少要用於讀取權限.

- **gitPassword:** 您的 git 托管庫密碼 ***(如果密碼包含特殊字符則需進行 URL 編碼)***

- **branch:** 拉取文件的分支名.

- **redeployOnChange:** 如果為 true, 新代碼將立即部署到遊戲伺服器並重新啟動, 從而結束這些伺服器上的所有遊戲 (不久後會實施更好的滾動更新機製).

- **overrideGitURL:** 用於各種非標準 / 非 https 代碼托管庫位址 (不建議使用).

- **repoReset:** 強行刪除 git 同步伺服器對應的本地副本. 如果要將 REPO 指向新位址, 這個功能會很有用. 至少開啟等待一個更新周期生效, 生效後可以將其關閉.

## 檢查狀態

使用應用儀表板的 ***Deployments (部署)*** 區域來查看同步狀態或查找報錯信息. 點選 **Git Sync Service (Git 同步服務)** 標題旁邊的打開日誌按鈕, 來查看最近的日誌/報錯信息.

![Arena 應用管理視圖](../../images/git-sync-logs.jpg)

## 故障排除
如果在同步過程中遇到合並沖突或其他未知/嚴重錯誤, 建議您在部署界面為 **Git Sync Service** 點選 **Restart** 按鈕. 重新啟動 GitSync 服務將清除本地代碼庫, 並在重啟後拉取最新代碼.
