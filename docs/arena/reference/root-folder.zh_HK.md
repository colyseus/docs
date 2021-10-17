# Package.json / 目錄路徑

## Package.json 用法

在 Arena Cloud 上部署時, 您的部署並未使用用戶的 package.json 文件. 而是 Arena Cloud 將用戶文件的自定義依賴項復製融合到 Arena package.json 中, 然後在您的伺服器啟動時配置此文件.

## 相對和絕對文件夾位置

需要註意的是, 這個 json 文件位於 Arena Cloud 伺服器的根目錄, 而不是伺服器代碼的根目錄. 如果需要從 package.json 中引用自定義模組, 則應該把它放置在基於 Arena Cloud 伺服器根目錄的相對路徑下.

您上傳的伺服器代碼的相對路徑是 ```./app/server/arena/```.

您上傳的伺服器代碼的絕對路徑是 ```./colyseus/app/server/arena/```.
