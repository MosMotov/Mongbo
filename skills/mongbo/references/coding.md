# Coding guidance

Complete the request with as little new code as the problem allows. Keep the change readable and verify the behavior through its normal entry point when possible.

## Before editing

Read the task and trace the affected behavior. Find callers, tests, fixtures, configuration and exports that depend on the change. Identify data that could be lost or exposed and behavior existing callers rely on. For a bug fix, search all callers of the affected function before editing and fix the shared cause once where the behavior belongs.

## Choose the first approach that fully works

1. Check whether code is needed at all. Leave out unrequested features, options and flexibility. For a broad request, deliver the smallest version that does the core job.
2. Reuse the project's existing helper, component, service or pattern when it fits.
3. Use a standard library or platform feature if the project has no equivalent convention.
4. Reuse an installed dependency where it fits. A few readable lines do not justify a new dependency.
5. Use a one-line solution only when a reader can understand it at a glance.
6. Otherwise, write the minimum readable code that meets the full need.

Prefer deletion when it solves the task. Keep the existing layers and interfaces. Leave values in their native form where possible and avoid speculative abstractions, wrappers, conversions, options, configuration and boilerplate. Pick the approach that handles edge cases when equally small alternatives exist. Finish related callers, tests and fixtures that the change affects.

Preserve validation at trust boundaries, safety checks, error handling that protects data, security, accessibility and any calibration real hardware requires. Keep validation and error handling when moving or merging code. Add a concise comment for reasoning the code cannot show. If a deliberate shortcut has a known limit, record it at the relevant code as `shortcut: <the limit>, <when to upgrade>`.

For a new nontrivial branch, loop, parser, money or security rule, script or app, leave a small test or assertion-based self-check that catches a real failure. For a trivial change, use the existing checks that cover it. Follow any stricter project requirements. Verify the affected behavior and relevant edge cases.

## Delivery

Use enough detail to explain the cause, effect and evidence. Report the checks run, any meaningful verification gap and any remaining risk in one or two closing lines when applicable. Mention material scope choices when they help the reader understand the result.

## Session levels

- **Full** is the default and uses the workflow above.
- **Lite** delivers what the user asked for. If an optional smaller scope would solve their need, describe it in one line and let them choose.
- **Ultra** also challenges parts of the request that the stated need does not justify before implementing them.
- **Off** follows the ordinary project workflow, including for routine reviews and audits.

“Coding mode full”, “coding mode lite”, “coding mode ultra” and “coding mode off” switch levels. “Mongbo review” or “Mongbo audit” runs that workflow once at any session level.

Continue to accept the legacy “Ponytail”, “Ponytail full”, “Ponytail lite”, “Ponytail ultra”, “Ponytail off”, “stop Ponytail”, “Ponytail review” and “Ponytail audit” prompts with the same behavior. Honor their slash forms if the host passes them through.
