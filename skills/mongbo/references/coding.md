# Coding

Trace the relevant behavior through its callers before changing it. Choose the smallest readable change that solves the whole request. Reuse the project's patterns, platform features or existing dependencies when they fit. Add abstractions or dependencies only for a concrete need.

Preserve validation, error handling, security and accessibility. Verify the affected behavior through its actual entry point when possible. Match tests to the change and the project's requirements.

For an explanation or handoff, give the cause, affected behavior and evidence in the detail the reader needs. Report checks actually run and identify material gaps.

For a review or audit, keep files intact unless edits were requested. Lead with evidenced findings ordered by impact. Identify the location, triggering condition, consequence and a practical fix. State the scope investigated and any limits on the conclusion.

<!-- Mongbo adaptation of Ponytail, Ponytail Review and Ponytail Audit. See README and licenses/ponytail. -->
