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

- Storing and querying users into/from a database
- Sending emails (for "Email Verification" and "Password Reset")
- OAuth 2.0 providers (for OAuth authentication)

### Installation

```bash
npm install --save @colyseus/auth
```

### Configuration

```typescript

```

### Usage

In order to allow email/password authentication, you need to implement the `AuthOptions` interface:

End-user should implement the following callbacks:

auth.settings.onFindUserByEmail = async (email) => {/* query user by email */}
auth.settings.onRegisterWithEmailAndPassword = async (email, password, options) => {/* insert user */}
auth.settings.onRegisterAnonymously = async (options: T) => {/* insert anonymous user */}


```typescript
```

## Email Verification

Email verification is optional. Users are allowed to login without verifying their email address.

You may enable email verification by providing both `onSendEmailConfirmation` and `onEmailConfirmed` callbacks.

It is your responsibility to limit the user access to your application until their email is verified.

### `auth.settings.onSendEmailConfirmation`

Use this callback to send the email verification to the user.

***Arguments:***

- `email` - the email address of the user
- `htmlContents` - the HTML contents of the email (uses the `address-confirmation-email.html` template)
- `confirmEmailLink` - the URL to confirm the email address (optional, the template already includes this URL)

```typescript
import { auth } from "@colyseus/auth";

auth.settings.onSendEmailConfirmation = async function(email, htmlContents, confirmEmailLink) {
    // send email to the user (example using resend.com)
    await resend.emails.send({
        to: email,
        subject: '[Your game]: Confirm your email address',
        from: 'no-reply@your-domain.io',
        html: htmlContents,
    });
}
```

### `auth.settings.onEmailConfirmed`

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

###

### OAuth providers (Discord, Google, X/Twitter, etc)


---

### Customize email templates

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
