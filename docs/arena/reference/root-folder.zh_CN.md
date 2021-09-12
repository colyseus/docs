# Package.json / 文件夹位置

## Package.json 用法

在 Arena Cloud 上部署时, 您的部署并未完全使用 package.json 文件. Arena Cloud 将自定义依赖项复制到托管的 Arena package.json 中, 然后在您的服务器启动时安装此文件.

## 相对和绝对文件夹位置

需要注意的是, 这个 json 文件位于 Arena Cloud 服务器的根目录, 而不是服务器代码的根目录. 如果从 package.json 中引用自定义模块, 则需要根据 Arena Cloud 服务器根目录放置其相对路径.

您上传的服务器代码的相对路径是 ```./app/server/arena/```.

您上传的服务器代码的绝对路径是 ```./colyseus/app/server/arena/```.
