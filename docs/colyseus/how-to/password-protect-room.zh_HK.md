## 步驟1：允許匹配程序識別 `"password"` 字段.

在 `filterBy()` 中定義`"password"`字段.

```typescript
gameServer
  .define("battle", BattleRoom)
  .filterBy(['password'])
```


## 步驟2：不列出房間

若 `create()` 或 `joinOrCreate()` 已獲取密碼, 則將房間列為私人房間：

```typescript
export class BattleRoom extends Room {

  onCreate(options) {
    if (options.password) {
      this.setPrivate();
    }
  }

}
```
