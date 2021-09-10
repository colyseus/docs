## 第 1 步：讓配對者識別 `"password"` 欄位.

在 `filterBy()` 方法中定義 `"password"` 欄位.

```typescript gameServer .define("battle", BattleRoom) .filterBy(['password']) ```


## 第 2 步：使房間不公開

如果為 `create()` 或 `joinOrCreate()` 提供了密碼,請將房間列表設定為私人：

```typescript export class BattleRoom extends Room {

  onCreate(options) { if (options.password) { this.setPrivate(); } }

} ```
