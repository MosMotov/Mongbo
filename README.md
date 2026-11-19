<p align="center">
  <img src="assets/mongbo.png" width="240" alt="Mongbo, a black-and-white character with a ring and stars">
</p>

<h1 align="center">Mongbo</h1>

<p align="center"><strong>Small, complete code changes. Clear, concise everyday answers.</strong></p>

<p align="center">
  An agent skill and plugin for Claude Code and Codex CLI.<br>
  <a href="#install">Install</a> · <a href="#try-it">Try it</a> · <a href="#same-prompt-with-and-without-mongbo">Comparison</a> · <a href="#compatibility">Compatibility</a>
</p>

Mongbo chooses how to work based on what you ask for. When its plugin is enabled and its hooks are allowed to run, Mongbo loads automatically in new sessions. You can switch from translating a notice to fixing a bug in the same conversation.

| Task | How Mongbo handles it |
| --- | --- |
| Coding, debugging, testing, and technical explanations | Trace the affected behavior, choose the smallest complete change, and check it through the usual entry point. Rank review and audit findings by impact and back them with evidence. |
| Summaries, translations, naming, and general writing | Lead with the answer, remove filler, and keep facts, negations, exceptions, units, and exact wording. Write for the intended audience. |
| Mixed requests | Apply each set of rules to the relevant deliverable. For a bug fix and customer email, use the coding guidance for the fix and the writing guidance for the email. |

Your requested language, format, tone, and level of detail take precedence.

## Install

Download or clone this repository, then open a terminal in its root folder. The `./` in the commands below points to that folder. Keep the folder available as the local marketplace source. Make sure your CLI can run `node --version` before installing.

### Claude Code

```sh
claude plugin marketplace add ./
claude plugin install mongbo@mongbo-local
```

Start a new Claude Code session. To check the installation, run `claude plugin details mongbo@mongbo-local`.

### Codex CLI

```sh
codex plugin marketplace add ./
codex plugin add mongbo@mongbo-local
```

Open Codex, run `/hooks`, and review and trust Mongbo’s `SessionStart` and `SubagentStart` hooks. Start a new session after trusting them. [Codex hook documentation](https://learn.chatgpt.com/docs/hooks)

## Try it

Send these prompts in the same session. Mongbo picks its guidance for each request without a slash command.

1. **Everyday writing.** “Summarize notice PAY-07 in one sentence for customers. No fee for the first 30 minutes, except for EXPRESS orders. Keep PAY-07 and EXPRESS exactly.” A concise answer could be “Under PAY-07, the first 30 minutes are free except for EXPRESS orders.”
2. **Coding.** “Our late check uses `minutes >= 30`, but exactly 30 minutes is still on time. Explain the bug and which boundary tests to run.” Mongbo should identify `minutes > 30` as the correction and explain the expected results at 29, 30, and 31 minutes.
3. **Mixed.** Say “Writing mode ultra,” then “Explain that cutoff bug and give me a separate one-line summary of PAY-07.” The technical explanation should keep its code and reasoning. The summary can use fragments while preserving the 30-minute rule and the EXPRESS exception.

- **Coding mode** starts at `full`. Say “Coding mode lite”, “Coding mode ultra”, “Coding mode off”, or “Coding mode full”.
- **Writing mode** applies to noncoding responses and starts at `standard`. Say “Writing mode ultra” for tighter phrasing, “Writing mode wenyan” for Classical Chinese, “Writing mode standard” for the default, or “Writing mode off”. Say “Writing mode status” to check the current mode.

Modes last for the conversation. “Normal mode” turns both off.

## Same prompt with and without Mongbo

We sent the same prompt to two fresh sessions on Windows using Codex CLI 0.169.1 and `gpt-6.2-sol` at `medium` reasoning. We installed Mongbo from this repository (`bb2d027`) between runs and confirmed that the second session read both guidance files. Each column describes one run. The replies below are verbatim.

| Check | Without Mongbo | With Mongbo |
| --- | --- | --- |
| JavaScript fix | Changed `>= 30` to `> 30`. | Changed `>= 30` to `> 30`. |
| Boundary at 29, 30, and 31 minutes | Listed the three correct expected results. | Ran three passing Node.js assertions and included them in the reply. |
| Customer notice | Kept the fee rule, the EXPRESS exception, and the side entrance instruction. | Kept the same details and included the `PAY-07` policy ID. |

<details>
<summary>Prompt used in both sessions</summary>

```text
A shop treats orders received exactly 30 minutes after opening as on time. Its JavaScript currently says:

function isLate(minutes) {
  return minutes >= 30;
}

Show the fix and how you would verify the boundary.

Separately, summarize this notice for customers:
"Please be advised that under policy PAY-07 there is no processing fee for the first 30 minutes, except for EXPRESS orders. During those 30 minutes, customers should use the side entrance."
```

</details>

<details>
<summary>Reply without Mongbo</summary>

```js
function isLate(minutes) {
  return minutes > 30;
}
```

Verify just below, exactly at, and just above the cutoff. Expected results are `isLate(29) === false`, `isLate(30) === false`, and `isLate(31) === true`.

**Customer notice**

For the first 30 minutes after opening, there’s no processing fee except for EXPRESS orders. Please use the side entrance during that time.

</details>

<details>
<summary>Reply with Mongbo</summary>

### JavaScript fix

Use `>` so an order received exactly 30 minutes after opening is on time.

```js
function isLate(minutes) {
  return minutes > 30;
}
```

I ran these boundary checks in Node.js. All three passed.

```js
const assert = require('node:assert/strict');

assert.equal(isLate(29), false);
assert.equal(isLate(30), false);
assert.equal(isLate(31), true);
```

### Customer notice

Under policy PAY-07, there’s no processing fee during the first 30 minutes, except for EXPRESS orders. Please use the side entrance during those 30 minutes.

</details>

## Compatibility

Version **0.1.0** was tested on Windows with Node.js 24.15.0.

| Host | Tested version | Verification |
| --- | --- | --- |
| Claude Code | 2.1.198 | Local install, session and child-agent hook context, disable, and uninstall verified with a local API test server. Response behavior with a live Claude model remains unverified. |
| Codex CLI | 0.169.1 | Local install, lifecycle and child-agent hooks, disable, and uninstall verified. Live-model tests covered translation, a mixed bug fix and writing request, and a switch back to summarization. |

The hooks load the [core skill](skills/mongbo/SKILL.md) from disk at session and child-agent startup. The agent reads the full guidance for [coding](skills/mongbo/references/coding.md), [review and audit](skills/mongbo/references/review.md), or [noncoding writing](skills/mongbo/references/noncoding.md). The hooks use Node.js built-ins and run locally.

Run the bootstrap tests from the repository root.

```sh
node --test tests/bootstrap.test.cjs
```

## Disable or uninstall

- **Claude Code.** Run `claude plugin disable mongbo@mongbo-local` to turn it off or `claude plugin uninstall mongbo@mongbo-local` to remove it.
- **Codex CLI.** Manage the plugin in `/plugins` or remove it with `codex plugin remove mongbo@mongbo-local`.

Open a new session after changing the plugin state.

## Credits and licenses

- Coding, review, and audit guidance draws on Dietrich Gebert’s [Ponytail](https://github.com/DietrichGebert/ponytail/tree/96608e078b2d5ea607c5c3b8b5a54d1c1fba6846/skills). [MIT license](licenses/ponytail/LICENSE)
- Noncoding writing guidance draws on Julius Brussee’s [Caveman skill](https://github.com/JuliusBrussee/caveman/blob/a192894723a8f47e7f504c7b5041967ff1f18e55/skills/caveman/SKILL.md). [Apache 2.0 license](licenses/caveman/LICENSE) · [MIT license](licenses/caveman/LICENSE-MIT) · [Notice](licenses/caveman/NOTICE)
