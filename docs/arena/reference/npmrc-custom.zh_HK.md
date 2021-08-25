# 使用私有 NPM 存储库(.npmrc)

如果使用的是非公共 NPM 模块，并且需要 Arena 访问私有 NPM 存储库，则可以通过将以下文件添加到服务器代码的根目录来完成。 

{1>File {2>.npmrc<2} Example:<1} {3> <PROJECT/REPO NAME>:registry=https://npm.pkg.github.com/ //npm.pkg.github.com/:\_authToken=<PRIVATE TOKEN / KEY> <3}

!!!注意   
    \- 在第二行，npm.pkg.git.com 之前必须包括 {1>//<1}
\- 如果使用非 github 存储库，应更新 {2>注册表<2} url
\- 使用您的项目值替换 {3><项目/存储库名称><3} 和 {4><私有 TOKEN / 秘钥><4}。

