# Package.json / 資料夾位置

## Package.json 用法

在 Arena Cloud 上部署時，您的部署並未完全使用 package.json 檔案。Arena Cloud 將自定義依賴項複製到託管的 Arena package.json 中，然後在您的伺服器啟動時安裝。 

## 相對和絕對資料夾位置

需要注意的是，這個 json 檔案位於您 Arena Cloud 伺服器的根目錄，而不是您伺服器代碼的根目錄。如果您從 package.json 中引用自定義模組，則需要根據 Arena Cloud 伺服器根目錄放置其相對路徑。

您上傳的伺服器代碼的相對路徑是 ```./app/server/arena/```。

您上傳的伺服器代碼的絕對路徑是 ```./colyseus/app/server/arena/```