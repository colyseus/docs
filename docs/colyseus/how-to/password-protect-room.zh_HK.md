## 步驟1: 允許 matchmaker 識別 `"password"` 字段.

在 `filterBy()` 方法裏定義 `"password"` 字段.

```typescript
gameServer
  .define("battle", BattleRoom)
  .filterBy(['password'])
```


## 步驟2: 不列出房間

若 `create()` 或 `joinOrCreate()` 調用時提供了密碼, 則將該房間列為私人房間:

```typescript
export class BattleRoom extends Room {

  onCreate(options) {
    if (options.password) {
      this.setPrivate();
    }
  }

}
```
