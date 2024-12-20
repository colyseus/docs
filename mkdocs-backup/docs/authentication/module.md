# Auth Module (`@colyseus/auth`)

The `@colyseus/auth` module is highly configurable and allows you to implement your own authentication backend.

!!! Note "This module is currently in beta"
    Feedback is welcome on [colyseus/colyseus#660](https://github.com/colyseus/colyseus/issues/660).

### Features

- Client-side APIs (via `client.auth`)
- Email/Password Authentication
- Anonymous Authentication
- Forgot Password + Password Reset
- OAuth 2.0 providers (_200+ supported providers, including Discord, Google, Twitter, etc._)

### Backend configuration **you need to provide**

- Environment secrets
- Storing and querying users from/into your database
- Sending emails (for "Email Verification" and "Password Reset")
- OAuth 2.0 providers (for OAuth authentication)

!!! Tip "Example Project using `@colyseus/auth`"
    The [Webgame Template](https://github.com/colyseus/webgame-template) repository contains a complete usage example for both server-side and client-side.

## Installation

Install the `@colyseus/auth` module:

```bash
npm install --save @colyseus/auth
```

## Usage

It is required to bind the authentication routes to Express.

=== "app.config.ts"

    ```typescript
    import { auth } from "@colyseus/auth";

    export default config({
    // ...
        initializeExpress: (app) => {
            // ...
            app.use(auth.prefix, auth.routes());
            // ...
        },
    // ...
    });
    ```

---

### Client-side API (`client.auth`)

!!! Warning "Backend configuration required"
    None of the client-side APIs below will work unless you [configure your backend](#backend-configuration). See [example configuration from the Webgame Template](https://github.com/colyseus/webgame-template/blob/main/packages/backend/src/config/auth.ts) project.

#### → `client.auth.registerWithEmailAndPassword(email, password, options?)`

Register a new user with email/password and return userdata. The user will be automatically logged in after registration. This method modifies the `client.auth.token` property.

The `options` argument is optional and may contain data you can use when creating the user's account.

=== "JavaScript"

    ```typescript
    try {
        const userdata = await client.auth.registerWithEmailAndPassword(email, password);
        console.log(userdata);

    } catch (e) {
        console.error(e.message);
    }
    ```

#### → `client.auth.signInWithEmailAndPassword(email, password)`

Sign in with email/password and return userdata. This method modifies the `client.auth.token` property.

=== "JavaScript"

    ```typescript
    try {
        const userdata = await client.auth.signInWithEmailAndPassword(email, password);
        console.log(userdata);

    } catch (e) {
        console.error(e.message);
    }
    ```

#### → `client.auth.signInAnonymously(options?)`

Sign in anonymously and return anonymous userdata. This method modifies the `client.auth.token` property.

=== "JavaScript"

    ```typescript
    try {
        const userdata = await client.auth.signInAnonymously();
        console.log(userdata);

    } catch (e) {
        console.error(e.message);
    }
    ```

#### → `client.auth.signInWithProvider(provider)`

Sign in with OAuth provider and return userdata. This method modifies the `client.auth.token` property.

=== "JavaScript"

    ```typescript
    try {
        const userdata = await client.auth.signInWithProvider('discord');
        console.log(userdata);

    } catch (e) {
        console.error(e.message);
    }
    ```

!!! Note "The OAuth authentication flow"
    - A popup window to is opened `/auth/provider/[PROVIDER-ID]`
    - The user is redirected to the OAuth provider's website
    - The user authenticates with the OAuth provider
    - The user is redirected back to `/auth/provider/[PROVIDER-ID]/callback` (see [OAuth Provider Callback](#oauth-provider-callback-authoauthoncallback))
    - The popup window is closed and userdata is returned


#### → `client.auth.sendPasswordResetEmail()`

=== "JavaScript"

    ```typescript
    try {
        const result = await client.auth.sendPasswordResetEmail('user@domain.io');
        console.log(result);

    } catch (e) {
        console.error(e.message);
    }
    ```

#### → `client.auth.getUserData()`

=== "JavaScript"

    ```typescript
    try {
        const userdata = await client.auth.getUserData();
        console.log(userdata);

    } catch (e) {
        console.error(e.message);
    }
    ```

#### → `client.auth.onChange()`

Define a callback that is triggered when internal auth state changes. It only triggers as a response from `client.auth` method calls - this is not a realtime subscription.

=== "JavaScript"

    ```typescript
    client.auth.onChange(function(authData) {
        console.log(authData.user);
        console.log(authData.token);
    });
    ```

#### → `client.auth.signOut()`

Clear the authentication token from the client-side.

=== "JavaScript"

    ```typescript
    client.auth.signOut()
    ```

#### → `client.auth.token`

The authentication token is automatically sent to the server on every request. Operations that result in a user being logged in will set the `client.auth.token` property, which is a JWT token containing the user's data. The contents of this token are

=== "JavaScript"

    ```typescript
    client.auth.token = "xxxx";
    ```

!!! Note "The JWT token is cached and reloaded on page refresh."
    The JWT token is stored in the `localStorage` of the browser.

---

## Backend configuration

### Environment Secrets and Security Concerns

It is required to provide the following environment secrets:

- `AUTH_SALT` - Used to hash the user's password. (`scrypt` algorithm by default)
- `JWT_SECRET` - Used to sign the JWT token.
- `SESSION_SECRET` - Used to sign the session cookie. (only used during OAuth flow)

!!! Note "How to generate a random string"
    You may use the following command to generate a random string `openssl rand -base64 32`. Alternatively, you can use [an online strong password generator](https://1password.com/password-generator/).

#### Keep your secrets safe

The exposure of these secrets may lead to security breaches on your application. Make sure to never expose them publicly, and limit the number of people in your team who have access to them.

If any of these secrets are compromised, you must rotate them immediately. The implications of rotating them are:

- Rotating `AUTH_SALT` will invalidate all user's passwords. Users will need to reset their password.
- Rotating `JWT_SECRET` will invalidate all JWT tokens. Users will need to login again.
- Rotating `SESSION_SECRET` will invalidate all session cookies. (only used during OAuth flow)

### Email/Password Authentication

In order to allow email/password authentication, you must implement the following callbacks:

- `auth.settings.onFindUserByEmail`: to query your database for the user's by its email address
- `auth.settings.onRegisterWithEmailAndPassword`: to insert a new user into your database

#### → `onFindUserByEmail` setting

Use this callback to query your database for the user's by its email address. (The database module is not provided by this module, you must provide your own.)

**Return value**: It must return the user entry from the database, with `password` field included. All values, except from the `password` will be encoded in the JWT token. It is recommended to return at least the user's `id` + `password` from your database, although you can store more fields for convenience sake.

**Error**: If `null` or `undefined` is returned, user will receive `invalid_credentials` error message. You may throw yourself a different error by using `throw new Error("your_error_message")`.

```typescript
import { auth } from "@colyseus/auth";

auth.settings.onFindUserByEmail = async function (email) {
    return await User.query().selectAll().where("email", "=", email).executeTakeFirst();
}
```

#### → `onRegisterWithEmailAndPassword` setting

Use this callback to insert a new user into your database. The password is already hashed.

If throwing an error, the error message will be sent to the client.

```typescript
import { auth } from "@colyseus/auth";

auth.settings.onRegisterWithEmailAndPassword = async function (email, password, options) {
    return await User.insert({ name, email, password, });
}
```

### Anonymous Authentication

Anonymous authentication is enabled by default. You may customize how the anonymous user is created by providing the `onRegisterAnonymously` callback.

By default, the anonymous user will have the following fields on its JWT token payload:

```typescript
{
  "anonymous": true
  "anonymousId": "vRSN1FbtZx5uo19hKSqA1", // 21 characters
}
```

#### → `onRegisterAnonymously` setting

You may use this callback to customize the JWT token payload for anonymous users. The fields returned by this callback will be available in the JWT token as payload.

On the example below the anonymous user is being inserted into the database, and its `userId` is being returned as payload.

```typescript
import { generateId } from "colyseus";
import { auth } from "@colyseus/auth";

auth.settings.onRegisterAnonymously = async function (options) {
    const userId = await User.insert({ anonymous: true });
    return { userId };
}
```

### Email Verification

You may enable email verification by providing both `onSendEmailConfirmation` and `onEmailConfirmed` callbacks.

It is your responsibility to limit the user access to your application until their email is verified.

!!! Note "Email verification is not mandatory"
    Users are allowed to login without verifying their email address. If you require email verification, you must validate if the user's email is verified on your application.

#### → `onSendEmailConfirmation` setting

Use this callback to send the email verification to the user.

| Argument | Description |
|------|-------------|
| `email` | the email address of the user |
| `html` | the HTML contents of the email (uses the `address-confirmation-email.html` template) |
| `link` | the URL to confirm the email address (optional, the template already includes this URL) |

```typescript
import { auth } from "@colyseus/auth";

auth.settings.onSendEmailConfirmation = async function(email, html, link) {
    // send email to the user (example using resend.com)
    await resend.emails.send({
        to: email,
        subject: '[Your project]: Confirm your email address',
        from: 'no-reply@your-domain.io',
        html: htmlContents,
    });
}
```

#### → `onEmailConfirmed` setting

This this callback to update the user's database record as verified.

| Argument | Description |
|------|-------------|
| `email` | the email address of the user |

```typescript
import { auth } from "@colyseus/auth";

auth.settings.onEmailConfirmed = async function(email) {
    // update user database record as verified
    await User.update({ verified: true }).where("email", "=", email).execute();
}
```

### Forgot Password

To enable "Forgot Password" feature, you must provide the following callbacks:

- `auth.settings.onForgotPassword`: to send the email to the user
- `auth.settings.onResetPassword`: to update the user's password

!!! Note "How it works"
    The link to reset the password is sent to the user's email address. The link contains a JWT token with the user's email address as payload. The user is then redirected to a page where they can enter a new password. The token expires in 30 minutes and can't be re-used.

#### → `onForgotPassword` setting

Use this callback to send the "forgot password" email to the user. The email template used is `reset-password-email.html`.

```typescript
import { auth } from "@colyseus/auth";

auth.settings.onForgotPassword = async function (email: string, html: string/* , resetLink: string */) {
  await resend.emails.send({
    to: email,
    subject: '[Your project]: Reset password',
    from: 'no-reply@your-domain.io',
    html: html
  });
}
```

#### → `onResetPassword` setting

Use this callback to update the user's password. The password is already hashed.

```typescript
import { auth } from "@colyseus/auth";

auth.settings.onResetPassword = async function (email: string, password: string) {
  await User.update({ password }).where("email", "=", email).execute();
}
```

### OAuth providers (Discord, Google, X/Twitter, etc)

In order to enable OAuth authentication, you must add at least one OAuth provider, and implement the `auth.oauth.onCallback` callback.

!!! Note "This module supports 200+ OAuth 2.0 providers"
    This module leverages the hard work of [simov](https://github.com/simov/) on his [grant](https://github.com/simov/grant) open-source module, which supports 200+ OAuth 2.0 providers.

    You may check the original [Grant Playground](https://grant.outofindex.com/) to experiment with scopes and OAuth configuration.

#### Add OAuth Provider (via `auth.oauth.addProvider()`)

| Argument | Description |
|------|-------------|
| `providerId` | the provider ID (e.g. "discord", "google", "twitter", etc) |
| `options` | the provider options, may vary depending on the provider (see below) |

```typescript
import { auth } from "@colyseus/auth";

auth.oauth.addProvider('[PROVIDER-ID]', {
  key: "XXXXXXXXXXXXXXXXXX", // Client ID
  secret: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Client Secret
  scope: ['identify', 'email'],
});
```

#### OAuth Provider Callback (`auth.oauth.onCallback`)

Use this callback to create the user's account after the OAuth provider redirects the user back to your application.

You must configure the "Redirect URL" on the OAuth provider's dashboard to point to the following URL:

```
https://[YOUR-DOMAIN]/auth/provider/[PROVIDER-ID]/callback
```

!!! Tip "Redirect URL on different environments"
    It is recommended that you create a different OAuth application for development and production environments. This way you can configure the "Redirect URL" to point to `http://localhost:2567/auth/provider/[PROVIDER-ID]/callback` during development, and `https://[YOUR-DOMAIN]/auth/provider/[PROVIDER-ID]/callback` on production.

| Argument | Description |
|------|-------------|
| `data` | the OAuth data (e.g. `profile`, `access_token`, etc) |
| `providerId` | the provider ID (e.g. `"discord"`, `"google"`, `"twitter"`, etc) |

```typescript
import { auth } from "@colyseus/auth";

auth.oauth.onCallback(async (data, provider) => {
    const profile = data.profile;
    return await User.upsert({
        discord_id: profile.id,
        name: profile.global_name || profile.username,
        locale: profile.locale,
        email: profile.email,
    });
});
```

#### Example: Discord

To enable Discord authentication, you must create a new application at [Discord Developer Portal](https://discord.com/developers/applications).

Under the _"Settings -> OAuth2"_ you will find the Client ID (`key`) and Client Secret (`secret`), that must be used to configure the provider:

```typescript
auth.oauth.addProvider('discord', {
  key: "XXXXXXXXXXXXXXXXXX", // Client ID
  secret: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Client Secret
  scope: ['identify', 'email'],
});
```

You will also need to configure the "Redirect URL" so Discord can redirect the user back to your application after authentication. The URL must be in the following format:

```
https://[YOUR-DOMAIN]/auth/provider/discord/callback
```

### Advanced Settings

You may customize the following settings:

- `auth.settings.onParseToken`: to parse JWT token provided by the client-side
- `auth.settings.onGenerateToken`: to generate the auth token
- `auth.settings.onHashPassword`: to hash the user's password

#### → `onParseToken` setting

Use this callback to parse the token provided by the client-side. The token is already verified and decoded.

```typescript
import { auth } from "@colyseus/auth";

auth.settings.onParseToken = async function (jwt) {
    return jwt;
}
```

#### → `onGenerateToken` setting

Use this callback to generate the token from the user's data. The token is already verified and decoded.

```typescript
import { auth } from "@colyseus/auth";

auth.settings.onGenerateToken = async function (userdata) {
    return JWT.sign(userdata);
}
```

#### → `onHashPassword` setting

Use this callback to hash the user's password.

```typescript
import { auth } from "@colyseus/auth";

auth.settings.onHashPassword = async function (password: string) {
    return Hash.make(password);
};
```

---

### Protecting an HTTP route (via `auth.middleware()`)

You may protect an HTTP route by using the `auth.middleware()` middleware. Only authenticated users will be able to access the route.

```typescript
app.get("/protected", auth.middleware(), (req: Request, res) => {
    res.json(req.auth);
});
```

---

### Customize Email Templates

You can customize the email templates by providing your own templates under the `html` directory.

```
my-colyseus-app/
├─ html/
│  ├─ address-confirmation-email.html
│  ├─ address-confirmation.html
│  ├─ reset-password-email.html
│  ├─ reset-password-form.html
├─ package.json
```

It is recommended to copy the default templates from the `@colyseus/auth` package, and customize them to your needs:

- [html/address-confirmation-email.html](https://github.com/colyseus/colyseus/tree/master/packages/auth/html/address-confirmation-email.html) → The email sent to the user to confirm their email address
- [html/address-confirmation.html](https://github.com/colyseus/colyseus/tree/master/packages/auth/html/address-confirmation.html) → The page where the user is redirected to confirm their email address
- [html/reset-password-email.html](https://github.com/colyseus/colyseus/tree/master/packages/auth/html/reset-password-email.html) → The email sent to the user to reset their password
- [html/reset-password-form.html](https://github.com/colyseus/colyseus/tree/master/packages/auth/html/reset-password-form.html) → The page where the user is redirected to reset their password

---

## Upgrading and linking user accounts

You may use the contents of the previous active token (`upgradingToken`) when registering an user via email/password or OAuth.

- Upgrade an anonymous user to an email/password or OAuth account
- Link multiple OAuth providers to the same account

**Example**

=== "`auth.settings.onRegisterWithEmailAndPassword`"

    ```typescript
    import { auth } from "@colyseus/auth";

    auth.settings.onRegisterWithEmailAndPassword = async function (email, password, options) {
        /**
         * options.upgradingToken contains the previous token payload
         * you can use its contents to link the user's account
         */
        options.upgradingToken
    }
    ```

=== "`auth.oauth.onCallback`"

    ```typescript
    import { auth } from "@colyseus/auth";

    auth.oauth.onCallback(async (data, provider) => {
        /**
         * data.upgradingToken contains the previous token payload
         * you can use its contents to link the user's account
         */
        data.upgradingToken
    });
    ```
