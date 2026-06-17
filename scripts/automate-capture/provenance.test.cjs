'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const { mergeProvenance } = require('./provenance.cjs');

const ok = (op, extra = {}) => ({ operation: op, raw_file: op + '.txt', sha256: 'x', ...extra });
const err = (op) => ({ operation: op, error: 'boom' });
const ops = (r) => r.merged.map((x) => x.operation);

test('merge accumulates new ops with existing ones', () => {
  const r = mergeProvenance([ok('zpa/a/one')], [ok('zpa/a/two')]);
  assert.deepStrictEqual(ops(r), ['zpa/a/one', 'zpa/a/two']);
});

test('a re-captured success replaces the prior entry', () => {
  const r = mergeProvenance([ok('zpa/a/one', { sha256: 'old' })], [ok('zpa/a/one', { sha256: 'new' })]);
  assert.strictEqual(r.merged[0].sha256, 'new');
});

test('a fresh error never clobbers an existing success', () => {
  const r = mergeProvenance([ok('zpa/a/one', { sha256: 'good' })], [err('zpa/a/one')]);
  assert.strictEqual(r.merged[0].sha256, 'good');
  assert.ok(!r.merged[0].error);
});

test('a fresh error replaces a prior error (still-failing retry)', () => {
  const r = mergeProvenance([err('zpa/a/one')], [err('zpa/a/one')]);
  assert.strictEqual(r.merged.length, 1);
  assert.ok(r.merged[0].error);
});

test('default (no prune) keeps everything, removes nothing', () => {
  const r = mergeProvenance([ok('zpa/a/old')], [ok('zpa/a/new')]);
  assert.deepStrictEqual(ops(r), ['zpa/a/new', 'zpa/a/old']);
  assert.deepStrictEqual(r.removedRawFiles, []);
});

test('prune removes a stale op under a swept product (endpoint gone upstream)', () => {
  // existing has zpa/a/gone; this run swept zpa but its URL list no longer includes it
  const r = mergeProvenance([ok('zpa/a/gone'), ok('zpa/a/keep')], [ok('zpa/a/keep')], { prune: true });
  assert.deepStrictEqual(ops(r), ['zpa/a/keep']);
  assert.deepStrictEqual(r.removedRawFiles, ['zpa/a/gone.txt']);
});

test('prune preserves an expected op that transiently failed this run', () => {
  // zpa/a/flaky is in the URL list (captured as error) and had a prior success —
  // it must be kept (expected + prior good), not pruned.
  const r = mergeProvenance([ok('zpa/a/flaky', { sha256: 'good' })], [err('zpa/a/flaky')], { prune: true });
  assert.deepStrictEqual(ops(r), ['zpa/a/flaky']);
  assert.strictEqual(r.merged[0].sha256, 'good');
  assert.deepStrictEqual(r.removedRawFiles, []);
});

test('prune never touches a product that was not swept this run', () => {
  // sweeping only zpa must not prune existing zia data
  const r = mergeProvenance([ok('zia/x/keep'), ok('zpa/a/gone')], [ok('zpa/a/new')], { prune: true });
  assert.deepStrictEqual(ops(r), ['zia/x/keep', 'zpa/a/new']);
  assert.deepStrictEqual(r.removedRawFiles, ['zpa/a/gone.txt']);
});
