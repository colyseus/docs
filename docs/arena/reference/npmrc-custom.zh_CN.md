# 使用私有 NPM 儲存庫 (.npmrc)

如果您使用的是非公共 NPM 模組並且需要 Arena 存取私有 NPM 儲存庫，則可透過將以下檔案新增到伺服器代碼的根目錄來完成。 

{1> 檔案 {2> .npmrc <2} 示例：<1} {3> <PROJECT / REPO NAME>: registry = https: //npm.pkg.github.com/ //npm.pkg.github.com /: _ authToken = <PRIVATE TOKEN / KEY><3}

!!!注意事項   
    \- 您必須在第二行的 npm.pkg.git.com 條目之前包含 {1>//<1} - 如果您使用的是 github 以外的註冊表，請更新 {2>registry<2} url - 替換 {3 ><PROJECT/REPO NAME><3} 和 {4><PRIVATE TOKEN / KEY><4} 以及您的專案價值。

