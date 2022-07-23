# 如何使用 API 令牌

!!! 需求
    - [註冊](https://console.colyseus.io/register){target=_blank} Colyseus Arena 賬戶
    - 有效的 API 令牌

!!! 註意
    - Public API 文檔地址: [https://public-api.colyseus.dev/api-docs/](https://public-api.colyseus.dev/api-docs/){target=_blank}

## 如何使用 API 令牌

依照前文創建好 API 令牌, [API 令牌](./create-api-token.md) 通過文檔的鏈接地址來與 Public API 進行交互. 步驟如下:

- 點擊界面上 **API-Token** 旁邊的 `Copy` 按鈕

![COPY-BTN](../../../images/api-token-copy-btn.png)

- 打開 Public API 文檔 (地址見上文)

- 點擊 `Authorize` 然後在 `API-Token` 位置粘貼上文拷貝的令牌, 然後點擊 close

![AUTHORIZE](../../../images/api-token-auth-ui.png)

![AUTHORIZE_UI](../../../images/api-token-auth.png)

- 此時在界面幫助下, 就可以與 API 進行交互. 點開 `/user/me` 卷展欄然後點擊 `Try It Out`

![TRY-ME-OUT](../../../images/user-me-try-out.png)

![USER-ME-EXECUTE](../../../images/user-me-try-out.png)