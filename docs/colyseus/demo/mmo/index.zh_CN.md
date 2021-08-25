﻿
# MMO 技術試玩版

此技術試玩版的目的，是展示製作{1>基本<1} MMO 的一種方法。包含聊天室系統、玩家持續性、多個流動 ColyseusRoom 和網路可互動物件。請注意，本試玩版{2>不<2}包含分區或其他任何能用於實際執行等級 MMO 的負載平衡方法。本試玩版是設計用於 Colyseus 0.14.7 版和 {3>Unity 2020.3.1f1 版<3}。

  

{1>{2>下載試玩版<2}<1}（{3>檢視原始程式碼<3}）

  

{1>遊玩試玩版！<1}

{1>螢幕擷取畫面<1}

## 開始使用

  

### 啟動本機伺服器

你必須在{1>提供的伺服器目錄<1}中的伺服器裡安裝並啟動本試玩版，才能夠正常運作。只需按照這些文件的 Unity3d 部分中的{2>「執行演示伺服器」下的說明進行操作<2}。

此外，本試玩版將使用 MongoDB 用於玩家持續性。如果你希望在本機執行，你必須設定或提供自己的本機 DB（請參照「調整試玩版」區段）

{1>請至 MongoDB 網站查看如何設定本機執行個體的詳細資料<1}

### ColyseusSettings ScriptableObject

  

全部伺服器設定都可以透過位於這裡的 ColyseusSetting ScriptableObject 來進行變更：

  

{1>ScriptableObject<1}

  

如果你執行的是本機伺服器，預設的設定應該很充足，然而如果你希望提供主機伺服器服務，會需要變更{1>Colyseus 伺服器位址<1}和對應的{2>Colyseus 伺服器連接埠<2} 值。  

## 遊玩試玩版

啟動位在 {1>ColyseusTechDemo-MMO\\Assets\\Scenes\\MMOLoginScene<1} 的場景「MMOLoginScene」中的玩家。如果你是第一次遊玩，就必須建立帳號。輸入你的電子郵件、密碼，然後登入以開始遊玩。如果你成功登入，用戶端會載入「TowerScene」場景，並在其中放置 NetworkedEntity。你可以隨時按下 ESC 鍵來檢視控制項、自訂你的角色或離開至主選單。走進位於房間邊的灰色立方體，你會被轉至不同的房間。

### 控制項
本試玩版的控制項會隨時顯示在 ESC 選單上，如以下所示：

| 輸入 | 說明 | |----------------------------------|--------------------| | W,A,S,M | 移動 | | 按住 Shift | 衝刺 | | Q,E | 旋轉角色 | | 向上/向下捲動 | 放大/縮小 | | 按住並拖曳滑鼠右鍵 | 視角樞紐 | | \` | 切換聊天室視窗 |

## 試玩版概觀
本試玩版是設計來展示使用者使用 Colyseus 設計和建置 MMO 風格遊的潛力。Colyseus 以下列功能為特色：
### 動態房間
MMORoom 會在需要時進行建立與處置。當玩家進入方格空間時， 我們會加入{1>進度<1}值設為方格值的房間，就像 {2>arena.config.ts<2}: {3>javascript gameServer.define('lobby\_room', MMORoom).filterBy(\["progress"]); // 透過「進度」（我們想加入的方格，例如：-1x2）來篩選房間 <3} 當玩家在世界四處移動時，會根據其在世界方格的位置來加入/離開房間。訊息會自用戶端向伺服器傳送，表示玩家正嘗試更新其進度，我們會在以下擷取到該進度 {4>MMORoom.ts<4}: {5}javascript this.onMessage("transitionArea", (client:Client, transitionData:Vector\[]) => { if (transitionData == null || transitionData.length < 2) { logger.error(\`\*\** Grid Change Error!Missing data for grid change! \*\*\*\`); return; } this.onGridUpdate(client, transitionData\[0] as Vector2, transitionData\[1] as Vector3); }); {6} 在決定新方格的位置後，用戶端提供了新 SeatReservation 以供取用，因此會加入其新方格位置的正確 ColyseusRoom。在登入/註冊時也會有相似的流程（請參照{7>玩家持續性<7}區段）。

{1>MapScreenshop<1}

這是本示範建置的方格地圖。非綠色的方格空間包含相連的出口，讓你能在其中四處旅行。例如你可以前往方格空間 {1>-3x3<1} 西北方的出口，然後你就會被放置在方格空間 {2>3x-3<2} 中。其他所有相鄰的方格空間都會連接彼此的出口。只有邊角接觸的方格空間，在這些邊角會有能以對角線穿過方格的出口。

### 聊天室系統
{1>ChatScreenshot<1} 額外的 ColyseusRoom 會用於處理聊天室系統：{2>ChatRoom.ts<2}。不論是在用戶端或是伺服器，我們在任何地方加入或離開 MMORoom 時，也會加入或離開 ChatRoom。這些 ChatRoom 是由 {3>roomId<3}（連接到的 MMORoom ID）所篩選。當用戶端傳送訊息時， 會新增至 ChatRoomState 的 ChatQueue，對所有連接的用戶端觸發狀態變更。每個傳入的新訊息會收到 {4>timeStamp<4} 值，其隨後會從佇列中刪除。
### 玩家持續性
!!! 提示「使用者驗證備註」本示範使用非常基礎的使用者驗證系統， 目的是取得唯一使用者帳戶的玩家持續性，且不能作為建置整個使用者驗證的實際範例。不要使用你在任何地方實際使用的任何電子郵件和密碼組合。
		
在本試玩版中，唯一使用者帳戶會保存在資料庫，以追蹤玩家的進度（玩家目前所處的房間和最後待在的房間）、位置、錢幣餘額等等。    
需要玩家帳戶才能遊玩本試玩版。使用者驗證成功後，房間的座位保留會傳回到用戶端。該座位保留的工作階段 ID，會在資料庫的玩家帳戶項目中儲存為「pendingSessionId」。當用戶端嘗試取用作物保留時，玩家帳戶為了加入房間，會使用該房間「onAuth」處理常式執行的「pendingSessionId」來查詢作業。如果不存在任何符合「pendingSessionId」的玩家帳戶，用戶端就不會獲准加入房間。然而，如果玩家帳戶成功進行查詢，「pendingSessionId」會變成「activeSessionId」而用戶端會加入房間。  
玩家的進度會在配對處理序時用於篩選房間。舉例來說，具有進度值為 "1,1"（代表方格區域座標為 1x1）會配對至具有相同進度值（如果已存在）的房間，如果不存在任何具有該進度值的房間，就會建立一個具有該值的房間。這樣一來，每個方格座標的房間只會在玩家在裡面時存在。玩家的進度會在透過其中一個出口門離開一個方格區域移動至另一個區域時進行更新。
### 互動元素
{1>可互動物<1} 方格空間中可能會散落有{2>可互動物<2}。這些是 {3>InteractableState<3} 結構描述物件的用戶端呈現，會在我們建立方格空間預製時放置在編輯器內。當玩家使用這些其中一個物件執行互動時，用戶端會傳送 {4>objectInteracted<4} 訊息至伺服器。如果伺服器尚未得知已提供的可互動物 ID，則伺服器會建立新的結構描述參考，其會新增至房間的結構描述地圖並傳回用戶端。然後伺服器會檢查用戶端是否符合執行互動的需求。如果能成功執行，所有的用戶端都會收到 {5>objectUsed<5} 訊息廣播，附帶可互動物的 ID 以及進行互動的使用者的資訊。而在用戶端，合適的 {6>NetworkedEntity<6} 和 {7>可互動<7}物件會受告知要同時執行。本試玩版具有 4 種不同類型的可互動物，你可以在各種方格空間中找到：- 按鈕頒獎台 - 每按一次會給進行互動的玩家 1 枚錢幣 - 錢幣行動 - 會暫時停用你的控制項並將你的 NetworkedEntity 彈來彈去的小旅程。每次使用花費 1 個硬幣 - Teleporter - 一個小型平台，可以將使用者傳送到其「退出平台」。使用 2 個硬幣 - FX Swirl - Button Podium 的替代品，無需任何費用，也無需提供任何東西，但按下時會顯示很酷的效果（使用 DEFAULT 伺服器類型）

## 調整演示

當您使用這個演示時，您可能需要進行一些調整，以更好地熟悉正在發生的事情。以下，您將學習如何進行這些細微的調整。

### 使用您自己專屬的資料庫
如果您希望將此演示指向您自己專屬的資料庫，您需要在位於{2>伺服器<2}目錄中的 {1>arena.env<1} 檔案中提供不同的 Mongo 連接字串，而該目錄目前希望您託管本機 mongo 資料庫：{3> javascript DEMO\_DATABASE=mongodb://localhost:27017/demo?retryWrites=true&w=majority <3}

### 聊天訊息生命週期
在用戶端，您可以透過更改 {2>ChatManager.cs<2} 上的公共 {1>messageShowTime<1} 變數來更改訊息顯示的時間長度，然後在加入/建立時將其發送到伺服器 {3>MMOManager.cs<3} 中的一個房間：{4>csharp private async void JoinChatRoom() { ColyseusRoom<ChatRoomState> chatRoom = await client.JoinOrCreate<ChatRoomState>("chat\_room", new Dictionary<string, object>( ) { { "roomID", Room.Id }, {"messageLifetime", ChatManager.Instance.messageShowTime} }); ChatManager.Instance.SetRoom(chatRoom); } <4}
### 新增您自己專屬的可互動物
如果要向用戶端新增新的可互動物，其必須繼承自 {1>Interactable.cs<1}。查看其他可互動物，以了解您可以做些什麼。如果您想覆蓋可互動物上的 {2>serverType<2} 值，您還應該在 {4>interactableObjectFactory.ts<4} 中為伺服器上的新 {3>serverType<3} 新增一個案例：\`\`\`javascript export function getStateForType(type: string) :InteractableState { let state :InteractableState = new InteractableState(); //任何新類型都需要一個合適的建構函數，否則其將返回空值 switch(type){ case("DEFAULT"): { state.assign({ coinChange :0, interactableType : type, useDuration :5100.0 }); break; }

		case("BUTTON_PODIUM"):
		{
			state.assign({
				coinChange :  1,
				interactableType :  type,
				useDuration :  10000.0
			});
			break;
		}
		case("COIN_OP"):
		{
			state.assign({
				coinChange : -1,
				interactableType :  type,
				useDuration :  5100.0
			});
			break;
		}
		case("TELEPORTER"):
		{
			state.assign({
				coinChange : -2,
				interactableType :  type,
				useDuration :  5100.0
			});
			break;
		}
	}
	return  state;
} {1} 變數 \`coinChange\` 是使用者的硬幣計數在使用時應該改變的數量。如果該值為負數（要使用的可互動 COSTS 硬幣），伺服器將在成功反應之前確認使用者有足夠的硬幣來使用它，如函數中所示：\`MMORoom.ts\` 中的 \`handleObjectCost\`：{2} javascript handleObjectCost(object:InteractableState, user:NetworkedEntityState): boolean { let cost: number = object.coinChange; let worked: boolean = false;

    //Its a gain, no need to check
    if (cost >= 0) {
      user.coins += cost;
      worked = true;
    }
    //Check if user can afford this
    if (cost < 0) {
      if (Math.abs(cost) <= user.coins) {
        user.coins += cost;
        worked = true;
      }
      else {
        worked = false;
      }
    }

    return worked;
  } {1} 如果此檢查成功，則物件互動將正常進行。變數 \`useDuration\` 用於計算使用者與其互動後可互動物將保持 \`inUse\` 的時間。當一個可互動物被使用時，其 \`availableTimestamp\` 被設定為：{2} javascript interactableObject.inUse = true; interactableObject.availableTimestamp = this.state.serverTime + interactableObject.useDuration; {3> 然後伺服器將在每個 \`simulationInterval\` 期間檢查，其中 \`simulationInterval\`: <3} javascript checkObjectReset() { this.state.interactableItems.forEach((state:InteractableState) => { if (state.inUse && state.availableTimestamp <= this.state.serverTime) { state.inUse = false; state.availableTimestamp = 0.0; } }); } \`\`\` 如果 {5>serverTime<5} 表示是時候執行此操作，則會重設 MMORoom 中任何可互動物的 {4>inUse<4} 值。
