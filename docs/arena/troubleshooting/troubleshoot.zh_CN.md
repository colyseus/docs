# 故障排除 / 常见问题

## 服务器上线报错
下面列举了我们收到最常见的关于将应用部署到 Colyseus Arena 时报出的错误.

### prelaunch-actions.sh - not found or bad variable name
报这个错一般说明应用的 `arena.env` 或者 `arena.secret.env` 配置文件有问题. 要注意确保格式正确, 键值之间没有多余的空行或空格. 标准格式举例如下.
```
NODE_ENV=production
ABC=123
TEST=banana
```
!!! NOTE
    - 注意 **=** 两边没有空格.

### Cannot find module '@colyseus/core'
检查服务器日志开头看看 NPM install 是否成功完成. 模块丢失, 模块依赖不兼容等都能引发这种错误.
!!! NOTE
    - @colyseus/social 已弃用, 如果上线 Arena 会引发上述错误. 更好的登录认证将在未来的 Colyseus 版本中实现.

## 连接 / 网络报错

### 服务器随机性自动关机 / 太多用户连接服务器时出现掉线情况
Colyseus 为开发者编写权威服务器代码提供了很大的灵活性. 基于服务器代码复杂度和压力测试的不同做法, 当用户数逐渐增大后, 可能会出现这种问题. 默认 Colyseus Arena 分配给每个服务器 100 个用户连接. 对于实际的游戏不同这个值可能过大或者过小. 如果出现这种压力负荷问题请提交一份工单, 我们的支持团队会帮助您一起调整好服务器负荷的配置工作.
!!! NOTE
    - 将来会更新仪表板以提供直接配置负荷分配及服务器各种参数的配置功能.
