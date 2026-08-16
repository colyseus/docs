---
name: docs-review
disable-model-invocation: true
description: Two-axis review of a docs diff: house style, and accuracy against the framework source.
---

Reviews the diff between `HEAD` and a fixed point along two axes that fail
independently. A page can read perfectly and document a signature that does not
exist; a page can be correct in every detail and violate every sentence rule.

- **Style**: does the prose follow `STYLE.md`?
- **Accuracy**: does it match the framework source?

Both run as **parallel subagents** so neither pollutes the other's context, then
this skill reports them side by side.

## Steps

### 1. Pin the fixed point

Whatever the user names: a branch, tag, SHA, or `master`. Ask if they gave none.

Confirm it resolves and the diff is non-empty before spawning anything:

```
git rev-parse <fixed-point>
git diff --stat <fixed-point>...HEAD -- pages/
git diff <fixed-point>...HEAD -- pages/
```

Three dots, so the comparison runs against the merge-base.

### 2. Run the machine checks first

```
pnpm check-links && pnpm check:ai-nav && pnpm lint:prose
```

Their findings belong to the tooling, not to the review. Note failures in the
final report and tell both subagents to skip anything already reported here. A
review that re-reports an em-dash Vale caught spends attention on solved work.

### 3. Spawn both subagents in parallel

**Style subagent.** Give it the diff command and the contents of `STYLE.md`.
Brief it to report only what Vale cannot catch:

- Sentences over 25 words in prose, or over 20 inside `<Steps>`. Vale's
  `SentenceLength` over-counts on nested lists and on sentences ending in `)` or
  a backtick, so it flags false positives and misses real ones. Count by hand.
- Sentence-initial `This` or `It` without a noun, including the cases Vale's
  pattern misses.
- Terminology from the `STYLE.md` table used wrongly inside headings, link text,
  and code-fence prose, which `.vale.ini` ignores.
- Noun stacks over three words, paragraphs over six sentences, numbered steps
  doing two things.
- Marketing copy and hedging adverbs.

Tell it that `STYLE.md` "Rules we deliberately reject" is binding: gerund
headings, contractions, second person, and causal connectives are correct here
and are not findings. Cap it at 400 words, each finding citing `file:line` and
the `STYLE.md` rule.

**Accuracy subagent.** Give it the diff command and the `audit-against-source`
skill. Brief it to report:

- Signatures, option names, and defaults in the diff that the source contradicts.
- Claims with no support in the source at all.
- Code samples that would not run against 0.18.
- Anything read from a stale look-alike directory.

Each finding cites the docs line and the source `file:line` that proves it. Cap
it at 400 words.

### 4. Report

Present the two under `## Style` and `## Accuracy`, and do not merge or rerank
across them. The separation is the point: one axis passing is what hides the
other. Close with the count per axis and the worst finding within each.

## Done when

- The machine checks ran, and their findings are attributed to the tooling.
- Both axes reported, or the accuracy axis is explicitly marked skipped because
  the diff touches no API claims.
- No finding duplicates a Vale or `check-links` result.
