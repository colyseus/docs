这是一份介绍如何使用脚本创建 colyseus 服务器的分步指南。

\##工具要求

- {1>{2>Node.js<2}<1}

\##安装

创建一个空目录。 {1>cmd mkdir colyseusServer <1}

进入目录。{1>cmd cd colyseusServer <1}

使用默认选项 {1>cmd npm init <1} 初始化 npm  修改 {4>package.json<4} 的 {2>"main"<2} 和 {3>"scripts"<3} 属性。{5>json { "main": "dist/main.js", "scripts": { "build": "tsc", "start": "ts-node src/main.ts", "start:dev": "ts-node-dev --watch \\"src/\*\*/*\\" --respawn --transpile-only src/main.ts ", "start:prod": "node dist/main.js", "test": "echo \\"Error: no test specified\\" && exit 1" }, } <5}

安装依赖项 {1>cmd npm i colyseus <1}

安装 Dev 依赖项 {1>cmd npm i --save-dev typescript ts-node-dev <1}

在项目的根目录中新建名为 {1>tsconfig.json<1} 的文件夹 {2>json { "compilerOptions": { "outDir": "./dist", "module": "commonjs", "lib": \["es6"], "target": "es2016", "declaration": true, "removeComments": true, "noImplicitAny": false, "experimentalDecorators": true, "sourceMap": true, "esModuleInterop": true, "strict": true, "allowJs": true, "strictNullChecks": false, "forceConsistentCasingInFileNames": true }, "include": \[ "src" ] } <2}

新建一个 {1>src<1} 目录 {2>cmd mkdir src <2}

在 {2>src<2} 目录下新建一个名为 {1>main.ts<1} 的文件夹。 \`\`\`ts import { Server } from "colyseus" const port = parseInt(process.env.port, 10) || 3000

const gameServer = new Server() gameServer.listen(port) console.log({1>\[GameServer] Listening on Port: ${port}<1}) \`\`\`

恭喜！您已完成 colyseus 服务器的安装。

\##命令

您现在可以启用服务器了：{1>cmd npm start <1}

您可使用 {1>start:dev<1} 命令进行开发。服务器会在您修改文件后自动重启。{2>cmd npm run start:dev <2}

生产环境需要先创建一个构建命令。{1>cmd npm run build <1}

然后您就可以使用 {1>start:prod<1} 命令来启动服务器了。该命令使用的是 {3>dist<3} 文件夹中 {2>build<2} 命令创建的文件。{4>cmd npm run start:prod <4}