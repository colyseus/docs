# GitSync (PA 及更高版本)

### 要求

* 仅适用于 **Powered Ascent** 计划及更高计划版本.

## 配置文件

要使用 git 同步, 需要将如下 ```arena.gitsync.json``` 文件添加到服务器代码的根目录并将其部署到您的应用中.

!!! NOTE
    - **再次提示** 必须点选 `Deploy` 来推送 ```arena.gitsync.json``` 到您的应用服务器, GitSync 才能正确更新.

同步服务大约每 2 分钟从 Git 托管库的指定分支中拉取更新.

## arena.gitsync.json 示例
```
{
    "serverDir": "upload",
    "buildType": "arena",
    "gitServer": "github.com/Lucid-Sight-Inc/testsyncrepo.git",
    "gitUser": "USER",
    "gitPassword": "PASS",
    "branch" : "testbranch",
    "redeployOnChange": true,
    "overrideGitURL": "",
    "repoReset" : false
}
```

**JSON 属性:**

- **serverDir:** 这是您上传的代码被保存的根目录. 如果用 "npm run build" 创建部署代码, 应将此文件夹作为输出目标文件夹.

- **buildType:** 此属性有两个可选项.
    - `arena` - 在从 serverDir 复制文件之前运行 ```npm install && npm run build```.
    - `none` - 直接从 serverDir 文件夹复制文件, 不运行任何命令. 如果服务器代码已被编译好可以直接在 Arena Cloud 上运行, 请使用此选项.

- **gitServer:** 您的 git 托管库地址.

- **gitUser:** 您的 git 托管库帐户, 至少要用于读取权限.

- **gitPassword:** 您的 git 托管库密码 ***(如果密码包含特殊字符则需进行 URL 编码)***

- **branch:** 拉取文件的分支名.

- **redeployOnChange:** 如果为 true, 新代码将立即部署到游戏服务器并重新启动, 从而结束这些服务器上的所有游戏 (不久后会实施更好的滚动更新机制).

- **overrideGitURL:** 用于各种非标准 / 非 https 代码托管库地址 (不建议使用).

- **repoReset:** 强行删除 git 同步服务器对应的本地副本. 如果要将 REPO 指向新地址, 这个功能会很有用. 至少开启等待一个更新周期生效, 生效后可以将其关闭.

## 检查状态

使用应用仪表板的 ***Deployments (部署)*** 区域来查看同步状态或查找报错信息. 点选 **Git Sync Service (Git 同步服务)** 标题旁边的打开日志按钮, 来查看最近的日志/报错信息.

![Arena 应用管理视图](../../images/git-sync-logs.jpg)

## 故障排除
如果在同步过程中遇到合并冲突或其他未知/严重错误, 建议您在部署界面为 **Git Sync Service** 点选 **Restart** 按钮. 重新启动 GitSync 服务将清除本地代码库, 并在重启后拉取最新代码.
