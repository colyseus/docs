# 故障排除 / 常見問題

## 伺服器上線報錯
下面列舉了我們收到最常見的關於將應用部署到 Colyseus Arena 時報出的錯誤.

### prelaunch-actions.sh - not found or bad variable name
報這個錯一般說明應用的 `arena.env` 或者 `arena.secret.env` 配置文件有問題. 要註意確保格式正確, 鍵值之間沒有多余的空行或空格. 標準格式舉例如下.
```
NODE_ENV=production
ABC=123
TEST=banana
```
!!! NOTE
    - 註意 **=** 兩邊沒有空格.

### Cannot find module '@colyseus/core'
檢查伺服器日誌開頭看看 NPM install 是否成功完成. 模塊丟失, 模塊依賴不兼容等都能引發這種錯誤.
!!! NOTE
    - @colyseus/social 已棄用, 如果上線 Arena 會引發上述錯誤. 更好的登錄認證將在未來的 Colyseus 版本中實現.

## 連接 / 網絡報錯

### 伺服器隨機性自動關機 / 太多用戶連接伺服器時出現掉線情況
Colyseus 為開發者編寫權威伺服器代碼提供了很大的靈活性. 基於伺服器代碼復雜度和壓力測試的不同做法, 當用戶數逐漸增大後, 可能會出現這種問題. 默認 Colyseus Arena 分配給每個伺服器 100 個用戶連接. 對於實際的遊戲不同這個值可能過大或者過小. 如果出現這種壓力負荷問題請提交一份工單, 我們的支持團隊會幫助您一起調整好伺服器負荷的配置工作.
!!! NOTE
    - 將來會更新儀表板以提供直接配置負荷分配及伺服器各種參數的配置功能.
