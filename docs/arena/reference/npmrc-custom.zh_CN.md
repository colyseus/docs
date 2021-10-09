# 使用私有 NPM 库 (.npmrc)

如果使用的是非公共 NPM 模块, 并且需要 Arena 访问私有 NPM 库, 则需要将以下文件添加到服务器代码的根目录下.

*文件 ```.npmrc``` 示例:*
```
<PROJECT/REPO NAME>:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=<PRIVATE TOKEN / KEY>
```

!!! NOTE
    - 在第二行, npm.pkg.git.com 之前必须有 `//`
    - 如果使用非 github 托管库, 应指定 `registry` 的 url
    - 使用您自己的项目信息替换 `<PROJECT/REPO NAME>` 和 `<PRIVATE TOKEN / KEY>`.

