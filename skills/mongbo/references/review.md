# Ponytail review and audit

Review as the maintainer who has to diagnose a failure in production. Prioritize correctness, safety, behavior under expected load, tests, performance and simplicity, in that order. Deliver the full report. Edit files only if the user also asks for a fix.

## Scope the work

### Review a change

- Follow the user's target, such as staged or unstaged changes, a branch, a pull request or named files. With no target, use uncommitted changes if present and the last commit otherwise.
- Read the diff and the surrounding code, including callers, callees, tests and relevant documentation. Trace input, storage and output. Search all callers when a signature, return value or behavior changes, including callers outside the diff.
- Read relevant deployment or project documentation to establish the workload. Check whether the code serves one person, many users or several concurrent processes.

### Audit a codebase

- Cover the named package, directory or repository. With no narrower target, cover the repository.
- Read the README, build and deployment configuration, dependency list, entry points and tests. Check expected users, workload and process count.
- Trace the main flows from input to storage and output. Read paths involving user input, authentication, money, data writes, background jobs and state shared across processes. In a large codebase, work deepest where failures cost the most. State which areas you did not inspect.

## Investigate in this order

1. **Correctness.** Look for wrong results, crashes and boundary cases involving empty values, zero, the last item, rounding or time zones. Check for broken callers, inconsistent implementations of a business rule and fixes that patch one caller while leaving the shared bug.
2. **Safety.** Check for injection, weak randomness, exposed secrets and missing boundary checks. Look for swallowed errors, writes that can leave inconsistent state, and places where a transaction is needed to prevent data loss.
3. **Expected load.** Check for races between a read and write, duplicated work across processes, unbounded memory, per-item queries, quadratic work on large inputs and per-process state that needs to be shared.
4. **Regression protection.** Find risky paths with no test that would catch a real failure. Look at branches, parsers, money, security, data writes and bug fixes. Ask for a focused failing case when that would catch the defect.
5. **Performance.** Flag meaningful regressions. Treat small savings as optional unless the project's latency or throughput requirements make them material.
6. **Simplicity.** Look for dead code, unused options or configuration, premature interfaces and factories, pass-through wrappers and dependencies whose work the platform already handles. Name the existing helper when recommending reuse. Merge copies that need to evolve together. Suggest splitting only when a function or class has distinct responsibilities that make it hard to follow or test.

## Confirm each finding

Give a reachable input or situation and the resulting failure or cost. Re-read the location and confirm the relevant caller, value or usage. Before calling code unused in an audit, search the audited tree, including tests, fixtures, configuration and dynamic or string references. Honor a documented `shortcut:` or legacy `ponytail:` limit unless the expected workload already exceeds it. Propose the smallest practical fix. Drop style preferences and concerns you cannot establish.

## Report

Open with two or three sentences explaining the change or repository. State the workload assumed when it affects the result. Use plain language in the user's requested language and explain unfamiliar terms.

Group findings as **Must fix** for bugs, security, data loss or failure at expected load, **Should fix** for gaps such as untested risky paths, meaningful slowdown, duplication or mixed responsibilities, and **Nice to have** for small simplifications and speedups. Skip empty groups and number findings across the report. For an audit, report up to 20 ranked findings and count the lower-priority items left out.

For each finding, cite the file and line, explain what the code does, name the triggering case and problem, suggest a practical fix and say what happens if it stays. Close with a verdict that identifies any findings to fix first. Where you found deletions worth making, estimate the removable lines and, for an audit, dependencies if the evidence supports it. State any important limits on what you read or ran. When no findings survive, say so and identify what you checked.

<!-- Mongbo adaptation of Ponytail Review and Ponytail Audit. See README and licenses/ponytail. -->
