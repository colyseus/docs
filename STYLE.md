# Colyseus docs style guide

House style for docs.colyseus.io. Most of it is borrowed from
[ASD-STE100 Simplified Technical English][ste]: the rules that make technical
prose easier for non-native readers and for language models to parse correctly.

We deliberately adopt a **subset**. These docs are **not** ASD-STE100 compliant
and should never claim to be: STE is built for aerospace maintenance procedures,
and several of its rules actively work against developer documentation. The
[rules we reject](#rules-we-deliberately-reject) are listed at the bottom, with
reasons, so they don't get "fixed" by a later pass.

Enforcement is [Vale](#enforcement) in CI, plus this file.

[ste]: https://www.asd-ste100.org/

## Sentences and structure

- **One idea per sentence.** If a sentence needs a semicolon to hold two claims,
  it is two sentences.
- **≤ 25 words** in explanatory prose. **≤ 20 words** inside a `<Steps>`
  instruction. The corpus median is 12. These are ceilings, not targets.
- **One instruction per step.** A numbered step that does two things is two steps.
- **≤ 6 sentences per paragraph**, one topic each.
- **No noun stacks longer than three words.** `room state synchronization
  callback` → `the callback for room state changes`.

## Voice

- **Active voice in instructions.** Passive only when the actor is genuinely
  irrelevant or unknown: "Rooms are disposed when empty" is fine; "the option is
  passed by you" is not.
- **Every sentence-initial `This` or `It` takes a noun.** "This callback",
  "This option", "This method". Never a bare `This` pointing at the previous
  paragraph or a code block.
- **Prefer a plain verb to a phrasal verb or idiom.** These are the single
  biggest barrier for readers whose first language is not English:

  | Avoid | Use |
  | --- | --- |
  | under the hood | internally |
  | out of the box | built in |
  | take care of | handle |
  | figure out | determine |
  | run into | encounter |
  | clobber / swallow | overwrite / discard |

  Deliberate metaphor in a section opener is allowed (see
  [rules we reject](#rules-we-deliberately-reject)).

## Punctuation

- **No em-dashes.** Rewrite instead, in order of preference:
  1. Split into two sentences. An em-dash afterthought is usually a second
     idea, and the sentence rules above already want it separate.
  2. A comma, for a light appositive.
  3. A colon, when the right side explains or enumerates the left.
  4. Parentheses, for a true aside.
- **One permitted use:** the empty-table-cell placeholder `| — |`.
- **No lookalike dashes.** Spaced en-dashes (`word – word`) and spaced double
  hyphens (`word -- word`) are flagged by the same rule. Unspaced numeric
  ranges (`4011–4999`) stay legal.

`Colyseus.NoEmDash` enforces this section as a CI-gating error. Its carve-out
for `| — |` relies on the placeholder being a lone em-dash in its cell: give
the cell any other content and the dash must go.

## Terminology

STE's most valuable rule is **one word, one meaning**. Inconsistent terms are the
main reason a docs search or a coding agent returns the wrong API.

| Concept | Use | Not |
| --- | --- | --- |
| The client tier (noun) | **frontend** | front-end, client side |
| The client tier (adjective) | **client-side** | front-end, frontend |
| The server tier (noun) | **backend** | back-end, server side |
| The server tier (adjective) | **server-side** | back-end |
| A running room | **room**, or **room instance** when contrasting with the class | game session, match |
| A registered room definition | **room type** | room handler |
| The room subclass in user code | **room class** | room handler |
| A lifecycle method (`onCreate`, `onJoin`, `onLeave`, `onDispose`) | **hook** | callback, handler |
| A function registered for a message type | **handler** | callback |
| A function passed to an API by the user | **callback** | hook |
| An SDK event subscription (`onStateChange`, `onError`) | **listener** | callback |
| The matchmaking subsystem | **matchmaker** | matchmaking |
| The activity of matching players | **matchmaking** | matchmaker |
| The server's per-step advance | **timestep** | simulation interval |
| The rate the server ticks at | **tick rate** | — |

Defined terms that look like synonyms but are not. Keep them distinct:

- **queue room** vs **match room**: the room a player waits in, versus the room
  `QueueRoom` spawns them into. Both are rooms; the qualifier carries the meaning.
- **timestep** vs **tick rate**: the step size versus the frequency.
  `setFixedTimestep(step, tickRate)` takes both.

Domain terms specific to the netcode stack are approved vocabulary and need no
plain-English substitute: *reconcile, rollback, replay, rewind, dead-reckon,
lerp, interpolation, prediction, settle, drift, jitter*.

## Rules we deliberately reject

Recorded so they aren't reintroduced as "improvements".

- **Gerund headings stay.** `## Defining a Room`, `## Joining Rooms`. STE bans
  `-ing` outside technical names. We keep them because they match how people
  search, and because 214 of them are load-bearing heading slugs: renaming
  cascades into `check-links`, the `<MovedAnchors>` maps, and external inbound
  links. Two page routes (`/getting-started`, `/migrating`) are gerunds too.
- **Contractions stay.** `don't`, `it's`, `you'll`. They read as normal
  developer prose and cost nothing in comprehension.
- **Second person stays.** "You can define a room…". STE prefers the impersonal
  imperative; for a framework's docs, addressing the reader is clearer.
- **Causal connectives stay.** `but`, `instead of`, `because`, `would`.
  `CLAUDE.md` asks writers to keep the why alongside the what, and these words
  are what carry it. Stripping them is what makes STE prose feel like a parts
  list. Em-dash appositives once shared this bullet and no longer do: the
  [punctuation ban](#punctuation) wins, and the why moves into a comma clause
  or its own sentence.
- **Deliberate metaphor in section openers stays.** "controls feel underwater"
  earns its place in `netcode.mdx`. Metaphor in the middle of a procedure does not.
- **The ~900-word STE dictionary is not adopted.** `handle`, `provide`, `allow`,
  `via`, `may` and friends are ordinary technical English here, and `handler` is
  a real API concept.

## Enforcement

`npm run lint:prose` runs Vale over `pages/`. CI runs it alongside
`check-links`. Vale is a single Go binary and deliberately not an npm
dependency: `brew install vale`, or see <https://vale.sh/docs/install>.

- **`Colyseus.Terms` and `Colyseus.NoEmDash` are errors.** They gate CI. Fix
  the term, or rewrite the dash.
- **Everything else is a warning.** `SentenceLength`, `AmbiguousThis` and
  `Idioms` are advisory, and judgement beats the rule.

**Known limitation:** `SentenceLength` over-counts on nested lists and on
paragraphs whose sentences end in `)` or a backtick, because Vale's segmenter
merges them into one unit. A reported 47-word "sentence" is often two correct ones.
Check the source before rewriting.

Vocabulary lives in `styles/config/vocabularies/Colyseus/accept.txt`. Add
project nouns there rather than rewording around a false positive.

Two config details are load-bearing and easy to break:

- `filename` must stay out of `TokenIgnores`. It appears in code-fence info
  strings (` ```ts filename="MyRoom.ts" `), and blanking it there stops Vale
  recognizing the fence, so entire code blocks get linted as prose.
- `{/* … */}` must stay in `BlockIgnores`. Several of those comments document
  legacy slugs that must keep their old, now-wrong spelling.
