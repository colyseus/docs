# The `@colyseus/auth` module

The `@colyseus/auth` module is a highly configurable authentication provider to allow you to implement your own authentication. You own your data, and won't rely on third-party services.

!!! Tip "Full API Usage Example"
    For a complete example, check out the [colyseus/webgame-template](https://github.com/colyseus/webgame-template) repository.

**The main features of this module are:**

- Email/Password authentication
- Anonymous authentication
- OAuth 2.0 providers (200+ supported providers, including Discord, Google, Twitter, etc.)
- Forgot password + Password reset

Configurations **you need to provide** in order to work with this module:

- Storing and querying users from/into your database
- Sending emails (for "Email Verification" and "Password Reset")
- OAuth 2.0 providers (for OAuth authentication)

## Installation

```bash
npm install --save @colyseus/auth
```

## Usage

This module is highly configurable, and you may decide to leave some features disabled.

---

### Environment Secrets and Security Concerns

It is required to provide the following environment secrets:

- `AUTH_SALT` - used to hash the user's password (`scrypt` algorithm by default)
- `JWT_SECRET` - used to sign the JWT token
- `SESSION_SECRET` - used to sign the session cookie (only used during OAuth)

!!! Note "How to generate a random string"
    You may use the following command to generate a random string `openssl rand -base64 32`. Alternatively, you can use [an online strong password generator](https://1password.com/password-generator/).

#### Keep your secrets safe

The exposure of these secrets may lead to security breaches on your application. Make sure to never expose them publicly, and limit the number of people in your team who have access to them.

If any of these secrets are compromised, you must rotate them immediately. The implications of rotating them are:

- Rotating `AUTH_SALT` will invalidate all user's passwords. Users will need to reset their password.
- Rotating `JWT_SECRET` will invalidate all JWT tokens. Users will need to login again.
- Rotating `SESSION_SECRET` will invalidate all session cookies.

!!! Note "Using Colyseus Cloud?"
    If you're using [Colyseus Cloud](https://colyseus.io/cloud-managed-hosting/), it is recommended to fill your secrets on the "Environment Variables" section of your project's dashboard.

---

### Email/Password Authentication

In order to allow email/password authentication, you must implement the following callbacks:

- `auth.settings.onFindUserByEmail`: to query your database for the user's by its email address
- `auth.settings.onRegisterWithEmailAndPassword`: to insert a new user into your database

#### `auth.settings.onFindUserByEmail` callback

Use this callback to query your database for the user's by its email address. (The database module is not provided by this module, you must provide your own.)

The fields returned by this callback will be available in the JWT token as payload.

```typescript
import { auth } from "@colyseus/auth";

auth.settings.onFindUserByEmail = async function (email) {
    return await User.query().selectAll().where("email", "=", email).executeTakeFirst();
}
```

#### `auth.settings.onRegisterWithEmailAndPassword` callback

Use this callback to insert a new user into your database. The password is already hashed.

If throwing an error, the error message will be sent to the client.

```typescript
import { auth } from "@colyseus/auth";

auth.settings.onRegisterWithEmailAndPassword = async function (email, password, options) {
    return await User.insert({ name, email, password, });
}
```

---

### Anonymous Authentication

Anonymous authentication is enabled by default. You may customize how the anonymous user is created by providing the `onRegisterAnonymously` callback.

By default, the anonymous user will have the following fields on its JWT token payload:

```typescript
{
  "anonymous": true
  "anonymousId": "vRSN1FbtZx5uo19hKSqA1", // 21 characters
}
```

#### `auth.settings.onRegisterAnonymously` callback

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

---

### Email Verification

Email verification is optional. Users are allowed to login without verifying their email address.

You may enable email verification by providing both `onSendEmailConfirmation` and `onEmailConfirmed` callbacks.

It is your responsibility to limit the user access to your application until their email is verified.

### `auth.settings.onSendEmailConfirmation`

Use this callback to send the email verification to the user.

***Arguments:***

- `email` - the email address of the user
- `html` - the HTML contents of the email (uses the `address-confirmation-email.html` template)
- `link` - the URL to confirm the email address (optional, the template already includes this URL)

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

#### `auth.settings.onEmailConfirmed`

This this callback to update the user's database record as verified.

***Arguments:***

- `email` - the email address of the user

```typescript
import { auth } from "@colyseus/auth";

auth.settings.onEmailConfirmed = async function(email) {
    // update user database record as verified
    await User.update({ verified: true }).where("email", "=", email).execute();
}
```

---

### Forgot Password

To enable "Forgot Password" feature, you must provide the following callbacks:

- `auth.settings.onForgotPassword`: to send the email to the user
- `auth.settings.onResetPassword`: to update the user's password

!!! Note "How it works"
    The link to reset the password is sent to the user's email address. The link contains a JWT token with the user's email address as payload. The user is then redirected to a page where they can enter a new password. The token expires in 30 minutes and can't be re-used.

#### `auth.settings.onForgotPassword`

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

#### `auth.settings.onResetPassword`

Use this callback to update the user's password. The password is already hashed.

```typescript
import { auth } from "@colyseus/auth";

auth.settings.onResetPassword = async function (email: string, password: string) {
  await User.update({ password }).where("email", "=", email).execute();
}
```

---

### OAuth providers (Discord, Google, X/Twitter, etc)

In order to enable OAuth authentication, you must provide the following callbacks:

- `auth.oauth.addProvider`: to configure the OAuth provider with your application key/secret
- `auth.oauth.onCallback`: to handle the OAuth callback and create the user's account

!!! Note "This module supports 200+ OAuth 2.0 providers"
    This module leverages the hard work of [simov](https://github.com/simov/) on his [grant](https://github.com/simov/grant) open-source module, which supports 200+ OAuth 2.0 providers.

#### `auth.oauth.addProvider`

***Arguments:***

- `providerId` - the provider ID (e.g. "discord", "google", "twitter", etc)
- `options` - the provider options, may vary depending on the provider (see below)

```typescript
import { auth } from "@colyseus/auth";

auth.oauth.addProvider('[PROVIDER-ID]', {
  key: "XXXXXXXXXXXXXXXXXX", // Client ID
  secret: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Client Secret
  scope: ['identify', 'email'],
});
```

#### `auth.oauth.onCallback`

Use this callback to create the user's account after the OAuth provider redirects the user back to your application.

You must configure the "Redirect URL" on the OAuth provider's dashboard to point to the following URL:

```
https://[YOUR-DOMAIN]/auth/provider/[PROVIDER-ID]/callback
```

During development, you can use `http://localhost:2567/auth/provider/[PROVIDER-ID]/callback` as the "Redirect URL".

***Arguments:***

- `data` - the OAuth data (e.g. `profile`, `access_token`, etc)
- `providerId` - the provider ID (e.g. "discord", "google", "twitter", etc)

```typescript
import { auth } from "@colyseus/auth";

auth.oauth.onCallback(async function (data, provider) {
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

Under the "Settings -> OAuth2" you will find the Client ID (`key`) and Client Secret (`secret`), that must be used to configure the provider:

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

During development, you may use `http://localhost:2567/auth/provider/discord/callback` as the "Redirect URL".

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

- [html/address-confirmation-email.html](https://github.com/colyseus/colyseus/tree/master/packages/auth/html/address-confirmation-email.html)
- [html/address-confirmation.html](https://github.com/colyseus/colyseus/tree/master/packages/auth/html/address-confirmation.html)
- [html/reset-password-email.html](https://github.com/colyseus/colyseus/tree/master/packages/auth/html/reset-password-email.html)
- [html/reset-password-form.html](https://github.com/colyseus/colyseus/tree/master/packages/auth/html/reset-password-form.html)

---

### Advanced Settings

You may customize the following settings:

- `auth.settings.onParseToken`: to parse JWT token provided by the client-side
- `auth.settings.onGenerateToken`: to generate the auth token
- `auth.settings.onHashPassword`: to hash the user's password

#### `auth.settings.onParseToken`

Use this callback to parse the token provided by the client-side. The token is already verified and decoded.

```typescript
import { auth } from "@colyseus/auth";

auth.settings.onParseToken = async function (jwt) {
    return jwt;
}
```

#### `auth.settings.onGenerateToken`

Use this callback to generate the token from the user's data. The token is already verified and decoded.

```typescript
import { auth } from "@colyseus/auth";

auth.settings.onGenerateToken = async function (userdata) {
    return JWT.sign(userdata);
}
```

#### `auth.settings.onHashPassword`

Use this callback to hash the user's password.

```typescript
import { auth } from "@colyseus/auth";

auth.settings.onHashPassword = async function (password: string) {
    return Hash.make(password);
};
```