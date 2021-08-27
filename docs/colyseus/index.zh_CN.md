# 歡迎來到 Colyseus

!!! 提示「重要通知」- 目前正在更新和改進文件。 - 文件的翻譯正在進行中。



## 開始使用

在開始之前，讓我們確保在您的本機上安裝了必要的系統要求。

**\##要求**

- [下載並安裝 Node.js ](https://nodejs.org/) v12.0 或更高版本
- [下載並安裝 Git SCM](https://git-scm.com/downloads)
- [下載並安裝 Visual Studio Code](https://code.visualstudio.com/)（或您選擇的其他編輯器）

### 建立準系統 Colyseus 伺服器

使用 `npm init colyseus-app` 命令生成準系統 Colyseus 伺服器。您可以選擇 TypeScript（推薦）、JavaScript 或 Haxe 作為伺服器的首選語言。

``` npm init colyseus-app ./my-colyseus-app ```

### 來自官方示例

或者，您可以透過複製 [examples project](https://github.com/colyseus/colyseus-examples) 並在本機執行來檢查一些示例。

``` git clone https://github.com/colyseus/colyseus-examples.git cd colyseus-examples npm install ```

若要在本機執行伺服器，請執行 `npm start`，然後打開 [http://localhost:2567](http://localhost:2567) 以探索每個示例。

### 介紹：Colyseus 工作原理概述

<center> <iframe src="https://docs.google.com/presentation/d/e/2PACX-1vSjJtmU-SIkng_bFQ5z1000M6nPSoAoQL54j0Y_Cbg7R5tRe9FXLKaBmcKbY_iyEpnMqQGDjx_335QJ/embed?start=false&loop=false&delayms=3000" frameborder="0" width="680" height="411" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe> </center>
