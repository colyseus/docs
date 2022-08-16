# 概述

## 訪問 / 查看伺服器和服務
在應用儀表板上選擇 ***Deployments***, 可以查看您的 Arena Cloud 應用關聯的各個伺服器和服務.

![部署按鈕](../../images/deployments-button.jpg)

## 部署儀表板

在此界面上, 可以訪問日誌還可以重啟各個 Arena Cloud 應用服務.

![部署概覽](../../images/deployments-overview.jpg)

- ***Colyseus Game Server (遊戲伺服器):*** 已部署的執行著您的代碼的 Colyseus 遊戲伺服器. 可以訪問每個伺服器的日誌或使用右上角的 **All Game Server Logs** 按鈕查看所有 Colyseus 遊戲伺服器日誌.

- ***Arena Git Sync Service (Arena Git 同步服務):*** 從指定 Git 托管庫同步和部署伺服器代碼的 Arena 應用 *(僅支持 Powered Ascent (PA) 計劃及更高版本).*

- ***Arena Load Balancer (Arena 負載均衡器):*** 此服務管理傳入連接, 並將它們分發給正確的 colyseus 伺服器. 在多個遊戲伺服器之間創建房間以平衡負載 *(僅適用於自動容量縮放的多伺服器部署, To Mars (TM) 計劃及更高版本).*
!!! NOTE
      - 重新啟動此服務將中斷所有現有連接, 從而斷開玩家與遊戲伺服器的連接. 僅當在負載均衡器中遇到錯誤/異常, 並且遊戲客戶端無法連接時, 才應執行此操作.
      - 當 CCU 流量超過 10,000 名玩家時, 可能會看到多個 *Arena 負載均衡器*.

- ***Arena Autoscaling Service (Arena 自動容量縮放服務):*** 管理 Colyseus 遊戲伺服器的擴容和縮容. 此服務保證有玩家連接的遊戲伺服器不被縮容 *(僅適用於自動容量縮放的多伺服器部署, To Mars (TM) 計劃及更高版本).*


