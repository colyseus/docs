這是使用 Typescript 建立 colyseus 伺服器的分步指南。

\##要求

- {1>{2>Node.js<2}<1}

\##設定

建立一個新的空目錄。 {1>cmd mkdir colyseusServer <1}

進入目錄。 {1>cmd cd colyseusServer <1}

使用預設選項 {1>cmd npm init <1} 初始化 npm 變更 {4>package.json<4} 的 {2>"main"<2} 和 {3>"scripts"<3} 屬性。{5>json { "main": "dist/main.js", "scripts": { "build": "tsc", "start": "ts-node src/main.ts", "start:dev": "ts-node-dev --watch \\"src/\*\*/*\\" --respawn --transpile-only src/main.ts ", "start:prod": "node dist/main.js", "test": "echo \\"Error: no test specified\\" && exit 1" }, } <5}

安裝相依性 {1>cmd npm i colyseus <1}

安裝開發相依性 {1>cmd npm i --save-dev typescript ts-node-dev <1}

在專案的根目錄建立一個名為 {1>tsconfig.json<1} 的新檔案 {2>json { "compilerOptions": { "outDir": "./dist", "module": "commonjs", "lib": \["es6"], "target": "es2016", "declaration": true, "removeComments": true, "noImplicitAny": false, "experimentalDecorators": true, "sourceMap": true, "esModuleInterop": true, "strict": true, "allowJs": true, "strictNullChecks": false, "forceConsistentCasingInFileNames": true }, "include": \[ "src" ] } <2}

建立一個新的 {1> src <1} 目錄 {2> cmd mkdir src <2}

在 {2>src<2} 目錄下建立一個名為 {1>main.ts<1} 的新檔案 \`\`\`ts import { Server } from "colyseus" const port = parseInt(process.env.port, 10) | | 3000

const gameServer = new Server() gameServer.listen(port) console.log({1>\[GameServer] Listening on Port: ${port}<1}) \`\`\`

恭喜您完成了 colyseus 伺服器的設定。

\##命令

現在您可以使用以下命令啟動伺服器：{1>cmd npm start <1}

對於開發，您可以使用 {1>start:dev<1} 命令。當您變更檔案時，它會自動重新啟動伺服器。 {2>cmd npm run start:dev <2}

對於生產，您應先建立一個建置。 {1>cmd npm run build <1}

之後，您可以使用 {1>start:prod<1} 命令啟動伺服器。此命令使用從 {3>dist<3} 資料夾中的 {2>build<2} 命令建立的檔案。 {4>cmd npm run start:prod <4}