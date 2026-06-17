// provenance.cjs — pure merge/prune for capture provenance. No fs, no network, so
// it is unit-tested directly (provenance.test.cjs). capture.cjs does the I/O around it.
'use strict';

// Merge this run's provenance into the existing set, keyed by operation.
//   - a re-captured op replaces its prior entry,
//   - EXCEPT a fresh error never clobbers an existing successful capture
//     (so re-running just the failures recovers them without losing good data).
//
// Pruning (opt-in, for full sweeps only) removes entries for operations that are
// under a product swept THIS run but are no longer in the URL list — i.e. the
// endpoint was removed or renamed upstream. It is gated behind `prune` because a
// PARTIAL run (e.g. retrying two failed ops) must NOT delete the rest of the
// product; the caller passes prune:true only when the URL list is the complete
// expected set for the swept products.
//
// Returns { merged, removedRawFiles } — the caller deletes removedRawFiles from disk.
function mergeProvenance(existing, captured, { prune = false } = {}) {
  const byOp = new Map(existing.map((r) => [r.operation, r]));
  for (const r of captured) {
    const prev = byOp.get(r.operation);
    if (!r.error || !prev || prev.error) byOp.set(r.operation, r);
  }

  const removedRawFiles = [];
  if (prune) {
    const expected = new Set(captured.map((r) => r.operation));
    const sweptProducts = new Set([...expected].map((op) => op.split('/')[0]));
    for (const [op, entry] of byOp) {
      if (sweptProducts.has(op.split('/')[0]) && !expected.has(op)) {
        byOp.delete(op);
        if (entry.raw_file) removedRawFiles.push(entry.raw_file);
      }
    }
  }

  const merged = [...byOp.values()].sort((a, b) => a.operation.localeCompare(b.operation));
  return { merged, removedRawFiles };
}

module.exports = { mergeProvenance };
