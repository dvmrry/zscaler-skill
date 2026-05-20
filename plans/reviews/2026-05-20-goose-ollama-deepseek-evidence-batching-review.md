# Goose-Ollama-DeepSeek Review: Investigator Evidence Batching Plan

## Bottom Line
The plan correctly identifies the core friction points in long investigator runs and proposes a measured, safety-first approach to reducing clerical overhead. The phased implementation strategy (Slice 0 → Shape A → Shape B) is well-structured and preserves auditability while addressing real performance pain points. The plan should proceed with Slice 0 (journal shape refinement) as the immediate next step.

## Blockers
1. **No blockers for Slice 0** - Journal shape changes are purely agent-side and don't require helper modifications
2. **Shape A requires helper benchmarking** - Before implementing evidence import helper, must measure current helper performance to establish baseline
3. **Batch recovery tests needed** - Shape B requires comprehensive partial-failure recovery tests before canonical workflow changes

## Recommendations
1. **Implement Slice 0 immediately** - Update journal guidance to use short claim rows + append-only evidence timeline
2. **Benchmark current helper performance** - Measure `begin-turn`, `complete-turn`, `initialize-turn-ledger` latency before Shape A
3. **Add helper quiet mode** - Shape A should include `--quiet` flag to suppress verbose output by default
4. **Consider cheaper local change detection** - For purely local turn-state checks, explore file size + mtime + optional content digest instead of SHA-256 everywhere
5. **Test journal mutation detection** - Ensure `abandon-turn` correctly detects journal changes before Shape B batching

## Answers To Focus Questions

### 1. Is the plan correctly scoped as a soft refactor?
**Yes.** The plan explicitly states this is a "soft-refactor plan, not a replacement plan" and maintains all critical safety invariants: case-local evidence, manifest requirements, resume verification, pending-turn detection, hash-chain consistency, and resolution gate enforcement.

### 2. Are artifact visibility tiers correct?
**Mostly.** The proposed tiers are reasonable:
- **User-visible**: Current issue state, hypothesis status, evidence summaries, next actions
- **Review-visible**: Journal, manifest, evidence timeline, retro
- **Machine-visible**: Turn JSON, hash values, helper internals

**Recommendation**: Keep turn JSON summaries visible in chat for auditability, but hide full JSON details unless repair is needed.

### 3. Is the performance budget realistic?
**Yes, with measurement.** The 250ms target per helper command is reasonable. The real bottleneck is likely process spawn and JSONL parsing, not hashing. **Blocking condition**: If helper overhead exceeds 500ms per evidence item after optimization, reconsider the approach.

### 4. Which integrity checks are load-bearing?
**Load-bearing**:
- Evidence file hashes (SHA-256) for durable evidence and exported packets
- Hash-chain consistency for resume integrity
- Journal mutation detection for transaction safety

**Could be cheaper**:
- Local turn-state checks could use file size + mtime + optional content digest
- Pending-turn detection could use lighter verification for purely local transactions

### 5. Is Slice 0 the right first step?
**Absolutely.** Journal shape refinement addresses the largest source of friction (repeated context) without any helper changes or workflow modifications. This should be implemented and tested before any code changes.

### 6. Is Shape A enough before batching?
**Yes.** Shape A (evidence import + generated turn JSON) removes the most error-prone manual steps (artifact handling, JSON creation) while maintaining the one-action-per-turn contract. Many investigations may not need batching after Shape A.

### 7. What failure mode would make batching unsafe?
**Partial batch failure with undetected state corruption.** If the helper doesn't properly detect and recover from interrupted batches, cases could be left in inconsistent states that resume verification doesn't catch.

### 8. What minimal eval should block helper changes?
**Block if**:
- Helper records evidence without source/query/request metadata
- Helper permits evidence recording + mark-resolved in same action
- Helper leaves evidence outside case-local `evidence/`
- Helper doesn't detect pending transactions during resume
- Performance overhead exceeds 2x current manual protocol

## Minor Notes
1. **Consider BLAKE3** - If dependency policy allows, BLAKE3 offers faster hashing for local checks while maintaining SHA-256 for durable evidence
2. **Add version tracking** - Record helper command/version in each ledger event rather than persistent runtime mode
3. **Test weak runtime fallback** - Ensure current explicit protocol remains reliable when helper support is missing
4. **Document recovery procedures** - Add explicit repair guidance for partial batch failures
5. **Monitor real cases** - Use actual investigation packets to validate latency improvements before Shape B decision