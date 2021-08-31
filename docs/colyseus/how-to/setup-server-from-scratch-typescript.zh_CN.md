這是使用 Typescript 建立 colyseus 伺服器的分步指南。

\##要求

- [`Node.js`](https://nodejs.org/)

\##設定

建立一個新的空目錄。 ```cmd mkdir colyseusServer ```

進入目錄。 ```cmd cd colyseusServer ```

使用預設選項 ```cmd npm init ``` 初始化 npm 變更 `package.json` 的 `"main"` 和 `"scripts"` 屬性。```json { "main": "dist/main.js", "scripts": { "build": "tsc", "start": "ts-node src/main.ts", "start:dev": "ts-node-dev --watch \"src/**/*\" --respawn --transpile-only src/main.ts ", "start:prod": "node dist/main.js", "test": "echo \"Error: no test specified\" && exit 1" }, } ```

安裝相依性 ```cmd npm i colyseus ```

安裝開發相依性 ```cmd npm i --save-dev typescript ts-node-dev ```

在專案的根目錄建立一個名為 `tsconfig.json` 的新檔案 ```json { "compilerOptions": { "outDir": "./dist", "module": "commonjs", "lib": ["es6"], "target": "es2016", "declaration": true, "removeComments": true, "noImplicitAny": false, "experimentalDecorators": true, "sourceMap": true, "esModuleInterop": true, "strict": true, "allowJs": true, "strictNullChecks": false, "forceConsistentCasingInFileNames": true }, "include": [ "src" ] } ```

建立一個新的 ` src ` 目錄 ``` cmd mkdir src ```

在 `src` 目錄下建立一個名為 `main.ts` 的新檔案 ```ts import { Server } from "colyseus" const port = parseInt(process.env.port, 10) | | 3000

const gameServer = new Server() gameServer.listen(port) console.log(`[GameServer] Listening on Port: ${port}`) ```

恭喜您完成了 colyseus 伺服器的設定。

\##命令

現在您可以使用以下命令啟動伺服器：```cmd npm start ```

對於開發，您可以使用 `start:dev` 命令。當您變更檔案時，它會自動重新啟動伺服器。 ```cmd npm run start:dev ```

對於生產，您應先建立一個建置。 ```cmd npm run build ```

之後，您可以使用 `start:prod` 命令啟動伺服器。此命令使用從 `dist` 資料夾中的 `build` 命令建立的檔案。 ```cmd npm run start:prod ```