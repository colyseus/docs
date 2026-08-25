---
name: audit-against-source
description: Verify documented API signatures, option names, defaults, and version-specific behavior against the framework source under ~/Projects/colyseus. Use before asserting how an API behaves, and when auditing a page or section for accuracy.
---

Read the source before asserting behavior. The traps below are the ones that
have already produced wrong claims in these docs.

## Where the source lives

`~/Projects/colyseus/colyseus-0.18` is the 0.18 monorepo (`@colyseus/monorepo@0.18.1`).
Almost everything is a package inside it:

| Docs section | Package |
| --- | --- |
| `/room`, `/server`, `/matchmaker`, server-side `/state` | `packages/core` |
| `/sdk`, client-side `/netcode` | `packages/sdk` |
| `/auth` | `packages/auth` |
| `/database` | `packages/database` |
| `/admin` | `packages/admin` |
| `/room/plugins` | `packages/room-plugins` |
| `/tools` | `packages/tools`, `monitor`, `playground`, `loadtest`, `testing` |
| `/deployment`, `/scalability` | `packages/transport`, `presence`, `drivers`, `traefik` |

Repos of their own, outside the monorepo:

| Docs section | Repo |
| --- | --- |
| `/state/schema` and serialization | `~/Projects/colyseus/schema-5.0` |
| `/getting-started/unity` | `~/Projects/colyseus/colyseus-unity-sdk` |
| `/getting-started/haxe` | `~/Projects/colyseus/colyseus-haxe` |
| `/getting-started/defold` | `~/Projects/colyseus/colyseus-defold` |
| `/getting-started/native-sdk` | `~/Projects/colyseus/native-sdk` |
| `/getting-started/react`, React hooks | `~/Projects/colyseus/react-tools` |
| `/recipes/command-pattern` | `~/Projects/colyseus/command` |

## Stale look-alikes

Several top-level directories share a name with a monorepo package and hold an
older version. Reading one silently produces a claim about the wrong release:

| Do not read | Version | Read instead |
| --- | --- | --- |
| `~/Projects/colyseus/schema` | 4.0.30 | `~/Projects/colyseus/schema-5.0` (5.0.12; 0.18 depends on ^5.0.8) |
| `~/Projects/colyseus/database` | 0.0.13 | `colyseus-0.18/packages/database` (0.18.1) |
| `~/Projects/colyseus/admin` | unversioned | `colyseus-0.18/packages/admin` (0.18.1) |
| `~/Projects/colyseus/colyseus-0.15`, `-0.16` | older releases | `colyseus-0.18`, unless documenting a migration |

The rule generalizes: prefer the monorepo package, and check `package.json`
version before trusting a top-level directory.

## Method

1. Read `src/`, not `build/` or `dist/`. Compiled output loses the defaults and
   the comments that explain them.
2. Verify each claim against a specific line: the signature, the destructured
   option name, the literal default, the guard that decides the behavior.
3. Where source and docs disagree, decide which is wrong. Docs describe actual
   behavior, including behavior that looks like a bug.
4. When the source is the wrong side, record it rather than papering over it.

## Recording source-side findings

A framework bug found during an audit goes in a ledger under `TODO/`, following
`TODO/source-bugs-0.18.md`: a numbered entry naming the symbol, the file and
line that proves it, what actually happens, and what the docs say meanwhile.
The docs page still describes real behavior; the ledger is what lets the page be
simplified once the framework is fixed.

## Done when

- Every claim in scope is matched to a source line, or listed in the ledger with
  the source's actual behavior.
- The version behind each claim was confirmed, not assumed, for anything read
  from a top-level directory.
