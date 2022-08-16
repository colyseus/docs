這是一份從零開始搭建使用 typescript 腳本的 colyseus 服務器的指南.

## 工具要求

- [`Node.js`](https://nodejs.org/)

## 安裝

創建一個空目錄.
```cmd
mkdir colyseusServer
```

進入目錄.
```cmd
cd colyseusServer
```

使用默認參數初始化 npm
```cmd
npm init
```
修改 `package.json` 的 `"main"` 和 `"scripts"` 屬性.
```json
{
  "main": "dist/main.js",
  "scripts": {
    "build": "tsc",
    "start": "ts-node src/main.ts",
    "start:dev": "ts-node-dev --watch \"src/**/*\" --respawn --transpile-only src/main.ts ",
    "start:prod": "node dist/main.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
}
```

安裝依賴庫
```cmd
npm i colyseus
```

安裝 Dev 依賴庫
```cmd
npm i --save-dev typescript ts-node-dev
```

在項目的根目錄中新建 `tsconfig.json` 文件
```json
{
    "compilerOptions": {
        "outDir": "./dist",
        "module": "commonjs",
        "lib": ["es6"],
        "target": "es2016",
        "declaration": true,
        "removeComments": true,
        "noImplicitAny": false,
        "experimentalDecorators": true,
        "sourceMap": true,
        "esModuleInterop": true,
        "strict": true,
        "allowJs": true,
        "strictNullChecks": false,
        "forceConsistentCasingInFileNames": true
    },
    "include": [
      "src"
    ]
}
```

新建一個 `src` 目錄
```cmd
mkdir src
```

在 `src` 目錄下新建 `main.ts` 文件.
```ts
import { Server } from "colyseus"
const port = parseInt(process.env.PORT, 10) || 3000

const gameServer = new Server()
gameServer.listen(port)
console.log(`[GameServer] Listening on Port: ${port}`)
```

恭喜! 您已完成 colyseus 服務器的搭建.

## 命令

現在可以用以下命令啟用服務器了:
```cmd
npm start
```

開發環境下可以使用 `start:dev` 命令啟動. 服務器會在您修改文件後自動重啟.
```cmd
npm run start:dev
```

生產環境下需要先執行編譯命令.
```cmd
npm run build
```

然後就可以使用 `start:prod` 命令來啟動服務器了. 該命令使用的是 `dist` 文件夾中 `build` 命令創建的文件.
```cmd
npm run start:prod
```
