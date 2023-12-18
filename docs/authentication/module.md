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

###

### OAuth providers (Discord, Google, X/Twitter, etc)