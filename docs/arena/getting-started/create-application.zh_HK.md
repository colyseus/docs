# 应用部署

### 要求

* [注册](https://https://console.colyseus.io/register) Arena Cloud 账户 
* 兼容 [Arena Cloud](../create-colyseus-server/) 的 Colyseus 服务器

## 创建应用部署

您的游戏或应用可以有许多应用部署，用于分隔您的不同环境（开发、模拟、生产）和/或区域（美国东部、欧盟西部、亚太南部）。每个应用部署都有自己的专用资源池，并独立于您帐户管理的所有其他部署工作。 

开始创建您的第一个应用部署...

![新建应用按钮](../../images/create-new-app.jpg)

- 登录后，选择仪表板右上角的 **Create A New App（创建新应用）**。

- 填写应用详细信息字段，并选择您的 *Plan（计划）* 和 *Region（地区）*

- 如果您的抢先体验电子邮件中提供了 **Arena 代码**，请在 *Code（代码）* 字段中输入该代码。

![注册流程](../../images/create-app.jpg)

- 提交并等待创建您的应用

!!! NOTE
    新应用部署最多可能需要 2 分钟的时间，具体取决于选定的区域

## 应用仪表板

在您新创建的应用上选择 **Manage（管理）**，可以查看应用仪表板。在这里，可以看到您的活动快照和访问工具，以更新代码、查看活动服务器、重新启动您的应用和查看日志。

![Arena 应用管理视图](../../images/app-manage-details.jpg)

- **Current Usage（当前使用情况）：**显示超过您当前的 Arena 计划限制的当前 CCU （如果有）
- **Connection（连接）：** 用于访问您的应用的 URL 和端口
- **API Key（API 秘钥）：**应用的唯一参考标识符，可用于通过 Arena Public API 访问应用部署
- **Arena Plan（Arena 计划）：**您的应用注册的当前托管计划。
- ***GIT Updated（GIT 更新）：***来自最近 GIT 更新的信息。
- ***GIT Msg（GIT 消息）：***最近更新的签入消息。
- ***GIT Hash（GIT 哈希）：***最近更新版本的哈希。 
!!! NOTE
    仅当使用 CI/CD GitSync 服务时，***才能***看到 ***GIT*** 详细信息（用于 Powered Ascent 和 Up Arena 计划）
