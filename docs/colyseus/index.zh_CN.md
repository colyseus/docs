# 欢迎使用 Colyseus

!!! Tip "重要提示"
    - 文档正在更新和改进中.
    - 文档翻译正在进行中.



## 开始

开始前,请确保您本地机器已安装好必要的软件工具.

**必要软件**

- [下载并安装 Node.js](https://nodejs.org/) V14.0 或更高版本
- [下载并安装 Git SCM](https://git-scm.com/downloads)
- [下载并安装 Visual Studio Code](https://code.visualstudio.com/) (或者您喜欢的其他编辑器)

### 创建一个简单的 Colyseus 服务器

使用 `npm init colyseus-app` 命令可以创建简单的 Colyseus 服务器. 您可以选择 TypeScript(推荐), JavaScript 或 Haxe 作为服务器语言.

```
npm init colyseus-app ./my-colyseus-app
```

### 摘自官方示例:

您也可以复制 [示例项目](https://github.com/colyseus/colyseus-examples) 并在本地运行查看各种应用案例.

```
git clone https://github.com/colyseus/colyseus-examples.git
cd colyseus-examples
npm install
```

在本地运行服务器需要先运行 `npm start`,然后打开 [http://localhost:2567](http://localhost:2567) 来查看各个案例.

### 展示: Colyseus 工作原理概览

<center>
    <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vSjJtmU-SIkng_bFQ5z1000M6nPSoAoQL54j0Y_Cbg7R5tRe9FXLKaBmcKbY_iyEpnMqQGDjx_335QJ/embed?start=false&loop=false&delayms=3000" frameborder="0" width="680" height="411" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</center>
