# DeepSeek Second-Pass Review: Investigator Evidence Batching Plan

## Verdict: Approved

The revised plan successfully narrows the active implementation scope, resolves all previously identified blockers, and locks down crucial boundary contracts. Slices 0, 1, and 2 should proceed.

### Resolved Prior Blockers
1. **Capability Discovery**: Resolved by requiring an explicit `capabilities` subcommand or a parseable `--help` section for the agent to check before invoking.
2. **File Collision Handling**: Resolved by specifying that `import-evidence` rejects destination collisions by default and requires future design to override.
3. **Turn JSON Hash Ordering (Shape A2)**: Resolved by enforcing that the agent updates the journal first, and the helper independently computes `journalHashAfter` from disk at generation time rather than accepting a caller argument.
4. **Helper Output Contract**: Resolved with a stable machine-readable JSON envelope for both successes and partial failures.
5. **Shape B Deferral**: Resolved by moving batching entirely into an inactive annex gated by post-A2 measurement.

### Minor Recommendations for Implementation
- **Capability Discovery Format**: Ensure the capability output is simple JSON (e.g. `{"commands": ["import-evidence", "generate-turn-json"]}`) to make programmatic checking fast and robust.
- **Manifest Schema**: Standardize the destination file naming as `<slug>-<source>-<name>-<timestamp>.<ext>` during Slice 1.
