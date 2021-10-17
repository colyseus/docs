# 使用私有 NPM 庫 (.npmrc)

如果您使用的是非公開 NPM 模組, 要求 Arena 訪問私有 NPM 庫, 則需要將以下文件添加到伺服器代碼的根目錄下.

*文件 ```.npmrc``` 範例:*
```
<PROJECT/REPO NAME>:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=<PRIVATE TOKEN / KEY>
```

!!! NOTE
    - 在第二行, npm.pkg.git.com 之前必須有 `//`
    - 如果使用非 github 托管庫, 應指定 `registry` 的 url
    - 使用您自己的專案信息替換 `<PROJECT/REPO NAME>` 和 `<PRIVATE TOKEN / KEY>`.

