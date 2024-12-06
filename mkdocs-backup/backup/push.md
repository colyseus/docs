Push notifications are part of [`@colyseus/social`](http://github.com/colyseus/colyseus-social). They're experimental and not fully functional. Currently, only Web Push is supported.

## Environment variables

- `WEBPUSH_SUBJECT` - mailto: or URL.
- `WEBPUSH_PUBLIC_KEY` - VAPID Public Key
- `WEBPUSH_PRIVATE_KEY` - VAPID Private Key

You can generate VAPID keys using `npx web-push generate-vapid-keys`