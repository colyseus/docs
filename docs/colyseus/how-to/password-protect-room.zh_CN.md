## 步骤1: 允许匹配程序识别 `"password"` 字段.

在 `filterBy()` 中定义 `"password"` 字段.

```typescript
gameServer
  .define("battle", BattleRoom)
  .filterBy(['password'])
```


## 步骤2: 不列出房间

若 `create()` 或 `joinOrCreate()` 已获取密码, 则将房间列为私人房间:

```typescript
export class BattleRoom extends Room {

  onCreate(options) {
    if (options.password) {
      this.setPrivate();
    }
  }

}
```
