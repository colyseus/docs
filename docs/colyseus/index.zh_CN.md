# 欢迎使用 Colyseus

!!! Tip "重要提示"
    - 文档正在更新和改进中.
    - 文档翻译正在进行中.

## 介绍

Colyseus 是基于 Node.js 的, 使用 JavaScript/TypeScript 语言进行开发的, 权威性多平台游戏服务系统.

Colyseus 对于客户端技术和语言一视同仁. 您可以使用任何一种官方支持的客户端, 比如 [Unity](/colyseus/getting-started/unity3d-client/), [JavaScript/TypeScript](/colyseus/getting-started/javascript-client/), [Defold Engine](/colyseus/getting-started/defold-client/), [Haxe](/colyseus/getting-started/haxe-client/), [Cocos Creator](/colyseus/getting-started/cocos-creator/) 或者 [Construct3](/colyseus/getting-started/construct3-client/).

**Colyseus 可以提供:**

- 基于 webSocket 的实时通讯.
- 服务器和客户端简单易懂的 API.
- 服务器和客户端自动数据同步机制.
- 将客户端匹配到游戏会话
- 水平/垂直服务容量扩展

---

## 开始

开始前, 请确保您本地机器已安装好必要的软件工具.

**必要软件**

- [下载并安装 Node.js](https://nodejs.org/) LTS 或更高版本
- [下载并安装 Git SCM](https://git-scm.com/downloads)
- [下载并安装 Visual Studio Code](https://code.visualstudio.com/) (或者您喜欢的其他编辑器)

### 创建一个简单的 Colyseus 服务器

打开系统控制台, 输入下列命令, 从零开始架设本地服务器.

```
npm init colyseus-app ./my-first-game-server
```

至此服务器模板架设完成. 它可以运行于本地, 自托管服务器, 或者 [Colyseus Arena](/arena/) 之上.

#### 下一步

- 选择一种 [客户端 SDK](/colyseus/client/) 来连接服务器.
- 学习如何在服务器与客户端之间 [交换信息](/colyseus/server/room/#onmessage-type-callback).
- 了解 [自动状态数据同步](/colyseus/state/overview/) 的工作原理
- 尽情实验! 探索, 体验乐趣!

---

### 一些实例项目

建议您参考下面的实例项目探索和学习 Colyseus.

- [Official examples](https://github.com/colyseus/colyseus-examples)
- [PlayCanvas Tutorial](https://developer.playcanvas.com/en/tutorials/real-time-multiplayer-colyseus/)
- [BabylonJS Tutorial](https://doc.babylonjs.com/guidedLearning/multiplayer/Colyseus)
- [PixiJS Tic-Tac-Toe](https://github.com/endel/colyseus-tic-tac-toe)
- [The Open-Source IO Shooter](https://github.com/halftheopposite/TOSIOS)
- [Colyseus + PixiJS Boilerplate (Agar.io simplistic adaptation)](https://github.com/endel/colyseus-pixijs-boilerplate)

**官方 Unity 实例项目**

- [Shooting Gallery](/colyseus/demo/shooting-gallery/)
- [Starboss](/colyseus/demo/starboss/)
- [Turn Based Tanks](/colyseus/demo/turn-based-tanks/)
- [MMO](/colyseus/demo/mmo/)

---

## 附赠: JS GameDev Summit 2022

<iframe width="560" height="315" src="https://www.youtube.com/embed/KnN6nRtfL44" title="Making Multiplayer Games with Colyseus, Node.js and TypeScript" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

[Slides](https://docs.google.com/presentation/d/e/2PACX-1vTbM8frwpFb1DhqeFw3hNAEl-awUHs6gU-cCZti4Ec8bvFx-Oa6-qRYlaopwi44uqrXFZoPgMgd64sG/pub?start=false&loop=false&delayms=3000) | [GitNation](https://portal.gitnation.org/contents/making-multiplayer-games-with-colyseus-nodejs-and-typescript)

---

**社区视频**: 社区成员制作的系列视频:

- [Multiplayer Tic-Tac-Toe in Colyseus & Phaser 3.50](https://www.youtube.com/playlist?list=PLumYWZ2t7CRueXsocQXOGqewmwzohljof)
- [Multiplayer Game Design Colyseus and Unity](https://www.youtube.com/playlist?list=PLxgtJR7f0RBK_yGDSbPuspqMR-oEi1S25)