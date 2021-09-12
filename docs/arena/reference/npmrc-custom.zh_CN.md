# 使用私有 NPM 存储库 (.npmrc)

如果使用的是非公共 NPM 模块, 并且需要 Arena 访问私有 NPM 存储库, 则可以通过将以下文件添加到服务器代码的根目录来完成.

*File ```.npmrc``` Example:*
```
<PROJECT/REPO NAME>:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=<PRIVATE TOKEN / KEY>
```

!!! NOTE
    - 在第二行, npm.pkg.git.com 之前必须包括 `//`
    - 如果使用非 github 存储库, 应更新 `注册表` url
    - 使用您的项目值替换 `<项目/存储库名称>` 和 `<私有 TOKEN / 秘钥>`.

