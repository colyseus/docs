# 概述

## 访问/查看服务器和服务
在应用仪表板上选择 ***Deployments***, 可以查看为您的 Arena Cloud 应用运行的各个服务器和服务.

![部署按钮](../../images/deployments-button.jpg)

## 部署仪表板

在此界面上, 可以访问日志并单独重新启动为您的 Arena Cloud 应用运行的服务.

![部署概览](../../images/deployments-overview.jpg)

- ***Colyseus 游戏服务器:*** Colyseus 游戏服务器运行您部署的代码. 可以访问每个服务器的日志或使用右上角的 **All Game Server Logs** 按钮查看所有 Colyseus 游戏服务器日志.

- ***Arena Git Sync Service (Arena Git 同步服务):*** Arena 应用才可以从定义的 Git 存储库同步和部署服务器代码 *(仅支持 Powered Ascent (PA) 计划及更高版本).*

- ***Arena Load Balancer (Arena 负载均衡器):*** 此服务管理传入连接, 并将它们分发给正确的 colyseus 服务器. 在可用游戏服务器之间平衡新房间创建负载 *(仅适用于自动扩展的多服务器部署, To Mars (TM) 计划及更高版本).*
  !!! NOTE
      - 重新启动此服务将中断所有现有连接, 从而断开玩家与游戏服务器的连接. 仅当在负载均衡器中遇到错误/异常, 并且游戏客户端无法连接时, 才应执行此操作.
      - 当 CCU 流量超过 10,000 名玩家时, 可能会看到多个 *Arena 负载均衡器*.

- ***Arena Autoscaling Service (Arena 自动扩展服务):*** 管理 Colyseus 游戏服务器的扩展和缩减. 此服务可确保具有活动会话的游戏服务器在玩家连接时不会缩减数量 *(仅适用于自动扩展的多服务器部署, To Mars (TM) 计划及更高版本).*


