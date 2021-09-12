這是一份介紹如何使用腳本創建 colyseus 伺服器的分步指南.

##工具要求

- [`Node.js`](https://nodejs.org/)

##安裝

創建一個空目錄.
```cmd
mkdir colyseusServer
```

進入目錄.
```cmd
cd colyseusServer
```

使用預設選項初始化 npm
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

安裝依賴項
```cmd
npm i colyseus
```

安裝 Dev 依賴項
```cmd
npm i --save-dev typescript ts-node-dev
```

在專案的根目錄中新建名為 `tsconfig.json` 的文件夾
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

在 `src` 目錄下新建一個名為 `main.ts` 的文件夾.
```ts
import { Server } from "colyseus"
const port = parseInt(process.env.port, 10) || 3000

const gameServer = new Server()
gameServer.listen(port)
console.log(`[GameServer] Listening on Port: ${port}`)
```

恭喜！您已完成 colyseus 伺服器的安裝.

##指令

您現在可以啟用伺服器了：
```cmd
npm start
```

您可使用 `start:dev` 指令進行開發.伺服器會在您修改文件後自動重啟.
```cmd
npm run start:dev
```

生產環境需要先創建一個構建指令.
```cmd
npm run build
```

然後您就可以使用 `start:prod` 指令來啟動伺服器了.該指令使用的是 `dist` 文件夾中 `build` 指令創建的文件.
```cmd
npm run start:prod
```
