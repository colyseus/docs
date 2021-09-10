# 使用私有 NPM 儲存庫 (.npmrc)

如果您使用的是非公共 NPM 模組並且需要 Arena 存取私有 NPM 儲存庫，則可透過將以下檔案新增到伺服器代碼的根目錄來完成.

*File ```.npmrc``` Example:*
```
<PROJECT/REPO NAME>:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=<PRIVATE TOKEN / KEY>
```

!!! NOTE
    - 您必須在第二行的 npm.pkg.git.com 條目之前包含 `//`
    - 如果您使用的是 github 以外的註冊表，請更新 `registry` url
    - 替換`<PROJECT/REPO NAME>` 和 `<PRIVATE TOKEN / KEY>` 以及您的專案價值.

