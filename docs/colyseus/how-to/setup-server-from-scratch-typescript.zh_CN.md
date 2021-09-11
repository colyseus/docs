这是一份介绍如何使用脚本创建 colyseus 服务器的分步指南.

##工具要求

- [`Node.js`](https://nodejs.org/)

##安装

创建一个空目录.
```cmd
mkdir colyseusServer
```

进入目录.
```cmd
cd colyseusServer
```

使用默认选项初始化 npm
```cmd
npm init
```
修改 `package.json` 的 `"main"` 和 `"scripts"` 属性.
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

安装依赖项
```cmd
npm i colyseus
```

安装 Dev 依赖项
```cmd
npm i --save-dev typescript ts-node-dev
```

在项目的根目录中新建名为 `tsconfig.json` 的文件夹
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

新建一个 `src` 目录
```cmd
mkdir src
```

在 `src` 目录下新建一个名为 `main.ts` 的文件夹.
```ts
import { Server } from "colyseus"
const port = parseInt(process.env.port, 10) || 3000

const gameServer = new Server()
gameServer.listen(port)
console.log(`[GameServer] Listening on Port: ${port}`)
```

恭喜！您已完成 colyseus 服务器的安装.

##命令

您现在可以启用服务器了：
```cmd
npm start
```

您可使用 `start:dev` 命令进行开发.服务器会在您修改文件后自动重启.
```cmd
npm run start:dev
```

生产环境需要先创建一个构建命令.
```cmd
npm run build
```

然后您就可以使用 `start:prod` 命令来启动服务器了.该命令使用的是 `dist` 文件夹中 `build` 命令创建的文件.
```cmd
npm run start:prod
```
