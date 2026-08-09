import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("./refresh-postman.sh", import.meta.url));
const fixtures = fileURLToPath(new URL("./fixtures/refresh-postman", import.meta.url));
const validCollection = fs.readFileSync(path.join(fixtures, "collection.json"), "utf8");

function makeState(t, initial = '{"info":{"name":"old"}}\n', mode = 0o644) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "refresh-postman-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const bin = path.join(root, "bin");
  const output = path.join(root, "vendor", "oneapi-postman-collection.json");
  fs.mkdirSync(bin, { recursive: true });
  fs.mkdirSync(path.dirname(output), { recursive: true });
  if (initial !== null) {
    fs.writeFileSync(output, initial);
    fs.chmodSync(output, mode);
  }

  const mockCurl = `#!/usr/bin/env bash
set -euo pipefail
output=""
url=""
write_out=""
proto=""
proto_redir=""
max_redirs=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    -o|--output) output="$2"; shift 2 ;;
    -w|--write-out) write_out="$2"; shift 2 ;;
    --proto) proto="$2"; shift 2 ;;
    --proto-redir) proto_redir="$2"; shift 2 ;;
    --max-redirs) max_redirs="$2"; shift 2 ;;
    --) shift; url="$1"; shift ;;
    -*) shift ;;
    *) url="$1"; shift ;;
  esac
done

if [[ "$proto" != "=https" || "$proto_redir" != "=https" ]]; then
  echo "mock curl requires HTTPS-only protocol flags" >&2
  exit 64
fi
if [[ "$max_redirs" != "0" ]]; then
  echo "mock curl requires a zero-redirect bound" >&2
  exit 64
fi
if [[ "$write_out" != "%{url_effective}" ]]; then
  echo "mock curl requires url_effective write-out" >&2
  exit 64
fi

case "$url" in
  https://automate.zscaler.com/docs/tools/postman/adding-oneapi-postman-collection)
    if [[ "$MOCK_CURL_MODE" == "requested-port" ]]; then
      source_file="$MOCK_CURL_FIXTURES/page-requested-port.html"
    else
      source_file="$MOCK_CURL_FIXTURES/page.html"
    fi ;;
  https://automate.zscaler.com/assets/js/runtime~main.test.js)
    source_file="$MOCK_CURL_FIXTURES/runtime.txt" ;;
  https://automate.zscaler.com/assets/js/main.test.js)
    source_file="$MOCK_CURL_FIXTURES/main.txt" ;;
  https://automate.zscaler.com/assets/js/f8b22e48.804c5b80.js)
    case "$MOCK_CURL_MODE" in
      missing|ambiguous|unsafe)
        source_file="$MOCK_CURL_FIXTURES/chunk-$MOCK_CURL_MODE.txt" ;;
      *)
        source_file="$MOCK_CURL_FIXTURES/chunk-success.txt" ;;
    esac ;;
  https://automate.zscaler.com/downloads/OneAPI_postman_collection_07_10_2026.json)
    case "$MOCK_CURL_MODE" in
      invalid-json) source_file="$MOCK_CURL_FIXTURES/not-json.txt" ;;
      json-error) source_file="$MOCK_CURL_FIXTURES/error.json" ;;
      json-scalar) source_file="$MOCK_CURL_FIXTURES/scalar.json" ;;
      empty-items) source_file="$MOCK_CURL_FIXTURES/empty-items.json" ;;
      wrong-schema) source_file="$MOCK_CURL_FIXTURES/wrong-schema.json" ;;
      blank-name) source_file="$MOCK_CURL_FIXTURES/blank-name.json" ;;
      *) source_file="$MOCK_CURL_FIXTURES/collection.json" ;;
    esac ;;
  *)
    echo "unexpected mock curl URL: $url" >&2
    exit 22 ;;
esac

if [[
  "$MOCK_CURL_MODE" == "redirect-failure" &&
  "$url" == "https://automate.zscaler.com/docs/tools/postman/adding-oneapi-postman-collection"
]]; then
  cp "$source_file" "$output"
  printf '%s' "$url"
  exit 47
fi

effective_url="$url"
case "$MOCK_CURL_MODE:$url" in
  effective-page-cross-origin:https://automate.zscaler.com/docs/tools/postman/adding-oneapi-postman-collection)
    effective_url="https://example.invalid/docs/tools/postman/adding-oneapi-postman-collection" ;;
  effective-asset-http:https://automate.zscaler.com/assets/js/runtime~main.test.js)
    effective_url="http://automate.zscaler.com/assets/js/runtime~main.test.js" ;;
  effective-collection-port:https://automate.zscaler.com/downloads/OneAPI_postman_collection_07_10_2026.json)
    effective_url="https://automate.zscaler.com:444/downloads/OneAPI_postman_collection_07_10_2026.json" ;;
  effective-collection-bad-path:https://automate.zscaler.com/downloads/OneAPI_postman_collection_07_10_2026.json)
    effective_url="https://automate.zscaler.com/downloads/not-a-collection.json" ;;
esac

cp "$source_file" "$output"
printf '%s' "$effective_url"
`;
  const curlPath = path.join(bin, "curl");
  fs.writeFileSync(curlPath, mockCurl);
  fs.chmodSync(curlPath, 0o755);

  return { root, output, initial };
}

function run(state, mode) {
  return spawnSync("bash", [script], {
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: `${path.join(state.root, "bin")}:${process.env.PATH}`,
      MOCK_CURL_FIXTURES: fixtures,
      MOCK_CURL_MODE: mode,
      POSTMAN_OUTPUT_FILE: state.output,
    },
  });
}

test("discovers and validates the current collection through the Docusaurus page chunk", (t) => {
  const state = makeState(t);
  const result = run(state, "success");

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /OneAPI_postman_collection_07_10_2026\.json/);
  assert.match(result.stdout, /Updated:/);
  assert.deepEqual(JSON.parse(fs.readFileSync(state.output, "utf8")), {
    info: {
      name: "OneAPI fixture",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    item: [{ name: "Fixture folder", item: [] }],
  });
});

test("a new collection is installed with mode 0644", (t) => {
  const state = makeState(t, null);
  const result = run(state, "success");

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /New file:/);
  assert.equal(fs.statSync(state.output).mode & 0o777, 0o644);
});

test("a replacement collection is installed with mode 0644", (t) => {
  const state = makeState(t, undefined, 0o600);
  const result = run(state, "success");

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Updated:/);
  assert.equal(fs.statSync(state.output).mode & 0o777, 0o644);
});

test("an unchanged collection does not replace or touch the existing file", (t) => {
  const state = makeState(t, validCollection);
  const before = fs.statSync(state.output, { bigint: true });
  const result = run(state, "success");
  const after = fs.statSync(state.output, { bigint: true });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /No change/);
  assert.equal(fs.readFileSync(state.output, "utf8"), validCollection);
  assert.equal(after.ino, before.ino);
  assert.equal(after.mtimeNs, before.mtimeNs);
});

test("fails clearly when collection discovery returns no target", (t) => {
  const state = makeState(t);
  const result = run(state, "missing");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /No OneAPI Postman collection link was found/);
  assert.equal(fs.readFileSync(state.output, "utf8"), state.initial);
});

test("fails clearly when collection discovery is ambiguous", (t) => {
  const state = makeState(t);
  const result = run(state, "ambiguous");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /discovery was ambiguous; found 2 targets/);
  assert.match(result.stderr, /07_10_2026/);
  assert.match(result.stderr, /08_01_2026/);
  assert.equal(fs.readFileSync(state.output, "utf8"), state.initial);
});

test("rejects a discovered URL outside the approved HTTPS Zscaler path", (t) => {
  const state = makeState(t);
  const result = run(state, "unsafe");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /not an approved Zscaler download URL/);
  assert.match(result.stderr, /example\.invalid/);
  assert.equal(fs.readFileSync(state.output, "utf8"), state.initial);
});

test("a refused redirect cannot replace the existing collection", (t) => {
  const state = makeState(t);
  const result = run(state, "redirect-failure");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Could not fetch the official Zscaler Postman page/);
  assert.equal(fs.readFileSync(state.output, "utf8"), state.initial);
  assert.deepEqual(fs.readdirSync(path.dirname(state.output)), [path.basename(state.output)]);
});

for (const [mode, expected] of [
  ["invalid-json", /invalid JSON/],
  ["json-error", /info must be an object/],
  ["json-scalar", /top level must be a JSON object/],
  ["empty-items", /item must be a non-empty array/],
  ["wrong-schema", /info\.schema must equal/],
  ["blank-name", /info\.name must be a non-empty string/],
]) {
  test(`invalid Postman shape (${mode}) never replaces the existing collection`, (t) => {
    const state = makeState(t);
    const result = run(state, mode);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /not a valid Postman v2\.1 collection/);
    assert.match(result.stderr, expected);
    assert.equal(fs.readFileSync(state.output, "utf8"), state.initial);
    assert.deepEqual(fs.readdirSync(path.dirname(state.output)), [path.basename(state.output)]);
  });
}

for (const [mode, expected] of [
  ["effective-page-cross-origin", /example\.invalid/],
  ["effective-asset-http", /http:\/\/automate\.zscaler\.com/],
  ["effective-collection-port", /automate\.zscaler\.com:444/],
  ["effective-collection-bad-path", /Unapproved collection URL path/],
  ["requested-port", /automate\.zscaler\.com:444/],
]) {
  test(`rejects an unapproved requested or reported effective URL (${mode})`, (t) => {
    const state = makeState(t);
    const result = run(state, mode);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /Unapproved/);
    assert.match(result.stderr, expected);
    assert.equal(fs.readFileSync(state.output, "utf8"), state.initial);
  });
}
