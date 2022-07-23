# 如何使用 API 令牌

!!! 需求
    - [注册](https://console.colyseus.io/register){target=_blank} Colyseus Arena 账户
    - 有效的 API 令牌

!!! 注意
    - Public API 文档地址: [https://public-api.colyseus.dev/api-docs/](https://public-api.colyseus.dev/api-docs/){target=_blank}

## 如何使用 API 令牌

依照前文创建好 API 令牌, [API 令牌](./create-api-token.md) 通过文档的链接地址来与 Public API 进行交互. 步骤如下:

- 点击界面上 **API-Token** 旁边的 `Copy` 按钮

![COPY-BTN](../../../images/api-token-copy-btn.png)

- 打开 Public API 文档 (地址见上文)

- 点击 `Authorize` 然后在 `API-Token` 位置粘贴上文拷贝的令牌, 然后点击 close

![AUTHORIZE](../../../images/api-token-auth-ui.png)

![AUTHORIZE_UI](../../../images/api-token-auth.png)

- 此时在界面帮助下, 就可以与 API 进行交互. 点开 `/user/me` 卷展栏然后点击 `Try It Out`

![TRY-ME-OUT](../../../images/user-me-try-out.png)

![USER-ME-EXECUTE](../../../images/user-me-try-out.png)