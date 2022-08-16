# Welcome to Colyseus

!!! tip "Important Notices"
    - Documentation is currently being updated and improved.
    - Translation of the documentation is in progress.

## Introduction

Colyseus is an Authoritative Multiplayer Framework for writing your own game servers using JavaScript/TypeScript and Node.js.

Colyseus is agnostic regarding the technology you choose for the client-side. You can use one of the official client-side SDK's available, such as [Unity](/colyseus/getting-started/unity3d-client/), [JavaScript/TypeScript](/colyseus/getting-started/javascript-client/), [Defold Engine](/colyseus/getting-started/defold-client/), [Haxe](/colyseus/getting-started/haxe-client/), [Cocos Creator](/colyseus/getting-started/cocos-creator/) and [Construct3](/colyseus/getting-started/construct3-client/).

**What Colyseus provides to you:**

- WebSocket-based realtime communication
- Simple API in the server-side and client-side.
- Automatic state synchronization between server and client.
- Matchmaking clients into game sessions
- Scale vertically or horizontally

---

## Getting started

Before we start, let's make sure we have the necessary system requirements installed in your local machine.

**Requirements**:

- [Download and install Node.js](https://nodejs.org/) v14.0 or higher
- [Download and install Git SCM](https://git-scm.com/downloads)
- [Download and install Visual Studio Code](https://code.visualstudio.com/) (or other editor of your choice)

### Creating your server

Open your system terminal, and use the command below to set up a barebones server locally.

```
npm init colyseus-app ./my-first-game-server
```

This server template is ready to be used locally, self-hosted, or on [Colyseus Arena](/arena/).

#### Next steps

- Connect to your server by using one of the [client-side SDK's available](/colyseus/client/).
- Learn how to [exchange messages](/colyseus/server/room/#onmessage-type-callback) between client and server
- Understand how the [automatic state synchronization](/colyseus/state/overview/) works
- Experiment! Play, and have fun!

---

### Examples to explore

You are encouraged to check out existing projects to explore and understand how Colyseus works.

- [Official examples](https://github.com/colyseus/colyseus-examples)
- [PlayCanvas Tutorial](https://developer.playcanvas.com/en/tutorials/real-time-multiplayer-colyseus/)
- [BabylonJS Tutorial](https://doc.babylonjs.com/guidedLearning/multiplayer/Colyseus)
- [PixiJS Tic-Tac-Toe](https://github.com/endel/colyseus-tic-tac-toe)
- [The Open-Source IO Shooter](https://github.com/halftheopposite/TOSIOS)
- [Colyseus + PixiJS Boilerplate (Agar.io simplistic adaptation)](https://github.com/endel/colyseus-pixijs-boilerplate)

**Official Unity Tech Demos**

- [Shooting Gallery](/colyseus/demo/shooting-gallery/)
- [Starboss](/colyseus/demo/starboss/)
- [Turn Based Tanks](/colyseus/demo/turn-based-tanks/)
- [MMO](/colyseus/demo/mmo/)

---

## Presentation: JS GameDev Summit 2022

<iframe width="560" height="315" src="https://www.youtube.com/embed/KnN6nRtfL44" title="Making Multiplayer Games with Colyseus, Node.js and TypeScript" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

[Slides](https://docs.google.com/presentation/d/e/2PACX-1vTbM8frwpFb1DhqeFw3hNAEl-awUHs6gU-cCZti4Ec8bvFx-Oa6-qRYlaopwi44uqrXFZoPgMgd64sG/pub?start=false&loop=false&delayms=3000) | [GitNation](https://portal.gitnation.org/contents/making-multiplayer-games-with-colyseus-nodejs-and-typescript)

---

**Community videos**: a selection of videos made by community members for you:

- [Multiplayer Tic-Tac-Toe in Colyseus & Phaser 3.50](https://www.youtube.com/playlist?list=PLumYWZ2t7CRueXsocQXOGqewmwzohljof)
- [Multiplayer Game Design Colyseus and Unity](https://www.youtube.com/playlist?list=PLxgtJR7f0RBK_yGDSbPuspqMR-oEi1S25)