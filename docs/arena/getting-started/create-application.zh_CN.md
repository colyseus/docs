# 应用部署

### 要求

* [注册](https://console.colyseus.io/register) Arena Cloud 账户
* 兼容 [Arena Cloud](../create-colyseus-server/) 的 Colyseus 服务器应用

## 创建应用部署

您的游戏或应用可以有许多应用部署, 用于分各类应用环境 (开发, 模拟, 生产) 或 区域 (美国东部, 欧盟西部, 亚太南部). 每个应用部署都有自己的专用资源池, 独立于其他部署运行.

开始创建您的第一个应用部署...

![新建应用按钮](../../images/create-new-app.jpg)

- 登录后点选仪表板右上角的 **Create A New App (创建新应用)**.

- 填写应用详细信息字段, 并选择您的 *Plan (计划)* 和 *Region (地区)*

- 如果您的受邀试用邮件中提供了 **Arena Code**, 请在 *Code (代码)* 字段中输入该代码.

![注册流程](../../images/create-app.jpg)

- 提交并等待创建您的应用创建成功

!!! NOTE
    新应用部署最多可能需要 2 分钟的时间, 具体取决于您选定的地区
    受邀试用用户 *必须* 使用 Arena **CODE** 来创建新应用

## 应用仪表板

在您新创建的应用上选择 **Manage (管理)**, 即可进入应用仪表板. 在这里可以看到活动统计快照和各种工具, 以更新代码, 查看活动服务器, 重启应用以及查看日志.

![Arena 应用管理界面](../../images/app-manage-details.jpg)

- **Current Usage (当前使用情况):** 显示当前 CCU 以及超过 Arena 计划的部分 (如果真的超过了的话)
- **Connection (连接):** 用于访问您的应用的 URL 和端口
- **API Key (API 秘钥):** 应用的唯一标识符, 用来通过 Arena Public API 访问应用部署
- **Arena Plan (Arena 计划):** 您的应用注册的托管计划.
- ***GIT Updated (GIT 更新):*** 最新 GIT 更新的信息.
- ***GIT Msg (GIT 消息):*** 最新更新的登录信息.
- ***GIT Hash (GIT 哈希):*** 最新更新的哈希值.
!!! NOTE
    仅当使用 CI/CD GitSync 服务时, ***才能*** 看到 ***GIT*** 的详细信息 (用于 Powered Ascent 及更高计划版本)
