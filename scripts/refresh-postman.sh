#!/usr/bin/env bash
# refresh-postman.sh — discover and refresh Zscaler's OneAPI Postman collection.
#
# The official Postman page is a Docusaurus application. Its collection link may
# be present in the page HTML or in the page's generated JavaScript chunk, so the
# refresh resolves that page rather than pinning a dated download filename.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEFAULT_OUTPUT_FILE="${REPO_ROOT}/vendor/zscaler-api-specs/oneapi-postman-collection.json"
OUTPUT_FILE="${POSTMAN_OUTPUT_FILE:-${DEFAULT_OUTPUT_FILE}}"
SPEC_DIR="$(dirname "${OUTPUT_FILE}")"
POSTMAN_PAGE_URL="https://automate.zscaler.com/docs/tools/postman/adding-oneapi-postman-collection"
AUTOMATE_ORIGIN="https://automate.zscaler.com"

mkdir -p "${SPEC_DIR}"

DISCOVERY_DIR="$(mktemp -d)"
# Keep the replacement candidate beside the destination so mv remains atomic.
TMP_FILE="$(mktemp "${SPEC_DIR}/.oneapi-postman-collection.XXXXXX")"
trap 'rm -rf "${DISCOVERY_DIR}"; rm -f "${TMP_FILE}"' EXIT

fetch() {
    local kind="$1"
    local url="$2"
    local destination="$3"
    local effective_url

    if ! validate_automate_url "${kind}" "${url}"; then
        return 1
    fi

    if ! effective_url="$(
        curl -sS --location --fail \
            --max-redirs 0 \
            --proto '=https' \
            --proto-redir '=https' \
            --output "${destination}" \
            --write-out '%{url_effective}' \
            -- "${url}"
    )"; then
        rm -f "${destination}"
        return 1
    fi

    if ! validate_automate_url "${kind}" "${effective_url}"; then
        rm -f "${destination}"
        return 1
    fi
}

validate_automate_url() {
    local kind="$1"
    local url="$2"

    node - "${AUTOMATE_ORIGIN}" "${kind}" "${url}" <<'NODE'
const expectedOrigin = process.argv[2];
const kind = process.argv[3];
const rawUrl = process.argv[4];

let url;
try {
  url = new URL(rawUrl);
} catch {
  console.error(`Unapproved ${kind} URL: ${rawUrl || "<empty>"} (not an absolute URL)`);
  process.exit(1);
}

if (
  url.origin !== expectedOrigin ||
  url.protocol !== "https:" ||
  url.username !== "" ||
  url.password !== "" ||
  url.search !== "" ||
  url.hash !== ""
) {
  console.error(
    `Unapproved ${kind} URL: ${rawUrl} (expected credential-free ${expectedOrigin} HTTPS URL with no query or fragment)`,
  );
  process.exit(1);
}

let validPath = false;
switch (kind) {
  case "page":
    validPath =
      url.pathname === "/docs/tools/postman/adding-oneapi-postman-collection" ||
      url.pathname === "/docs/tools/postman/adding-oneapi-postman-collection/";
    break;
  case "asset":
    validPath = url.pathname.startsWith("/assets/js/") && url.pathname.endsWith(".js");
    break;
  case "collection":
    validPath =
      /^\/downloads\/OneAPI_postman_collection_[0-9]{2}_[0-9]{2}_[0-9]{4}\.json$/.test(
        url.pathname,
      );
    break;
  default:
    console.error(`Unknown Zscaler Automate URL kind: ${kind}`);
    process.exit(1);
}

if (!validPath) {
  console.error(`Unapproved ${kind} URL path: ${url.pathname}`);
  process.exit(1);
}
NODE
}

validate_postman_collection() {
    node - "$1" <<'NODE'
const fs = require("node:fs");

const filename = process.argv[2];
const expectedSchema =
  "https://schema.getpostman.com/json/collection/v2.1.0/collection.json";
let collection;

try {
  collection = JSON.parse(fs.readFileSync(filename, "utf8"));
} catch (error) {
  console.error(`invalid JSON: ${error.message}`);
  process.exit(1);
}

if (collection === null || Array.isArray(collection) || typeof collection !== "object") {
  console.error("top level must be a JSON object");
  process.exit(1);
}
if (
  collection.info === null ||
  Array.isArray(collection.info) ||
  typeof collection.info !== "object"
) {
  console.error("info must be an object");
  process.exit(1);
}
if (collection.info.schema !== expectedSchema) {
  console.error(`info.schema must equal ${expectedSchema}`);
  process.exit(1);
}
if (typeof collection.info.name !== "string" || collection.info.name.trim() === "") {
  console.error("info.name must be a non-empty string");
  process.exit(1);
}
if (!Array.isArray(collection.item) || collection.item.length === 0) {
  console.error("item must be a non-empty array");
  process.exit(1);
}
NODE
}

extract_script_urls() {
    node - "${POSTMAN_PAGE_URL}" "$1" <<'NODE'
const fs = require("node:fs");

const pageUrl = process.argv[2];
const html = fs.readFileSync(process.argv[3], "utf8");
const urls = new Set();
const scriptPattern = /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;

for (const match of html.matchAll(scriptPattern)) {
  let url;
  try {
    url = new URL(match[1], pageUrl);
  } catch {
    continue;
  }
  if (
    url.protocol === "https:" &&
    url.hostname === "automate.zscaler.com" &&
    url.pathname.startsWith("/assets/js/") &&
    url.pathname.endsWith(".js")
  ) {
    urls.add(url.href);
  }
}

const output = [...urls].sort();
if (output.length > 0) {
  process.stdout.write(`${output.join("\n")}\n`);
}
NODE
}

extract_collection_urls() {
    node - "${AUTOMATE_ORIGIN}" "$@" <<'NODE'
const fs = require("node:fs");

const origin = process.argv[2];
const urls = new Set();
const collectionPattern = /(?:(?:[A-Za-z][A-Za-z0-9+.-]*:)?\/\/[^"'\\\s<>]+)?\/downloads\/OneAPI_postman_collection_[^"'\\\s<>]+/g;

for (const filename of process.argv.slice(3)) {
  const content = fs.readFileSync(filename, "utf8");
  for (const match of content.matchAll(collectionPattern)) {
    try {
      urls.add(new URL(match[0], origin).href);
    } catch {
      // Preserve the absence of a valid candidate; validation happens in bash.
    }
  }
}

const output = [...urls].sort();
if (output.length > 0) {
  process.stdout.write(`${output.join("\n")}\n`);
}
NODE
}

extract_postman_chunk_urls() {
    node - "${AUTOMATE_ORIGIN}" "$@" <<'NODE'
const fs = require("node:fs");

const origin = process.argv[2];
const contents = process.argv.slice(3).map((filename) => fs.readFileSync(filename, "utf8"));
const sourceMarker = "@site/docs/tools/postman/02-adding-collection.md";
const chunkIds = new Set();

for (const content of contents) {
  let cursor = 0;
  while ((cursor = content.indexOf(sourceMarker, cursor)) !== -1) {
    const loader = content.slice(Math.max(0, cursor - 800), cursor);
    for (const match of loader.matchAll(/\.e\((\d+)\)/g)) {
      chunkIds.add(match[1]);
    }
    cursor += sourceMarker.length;
  }
}

const urls = new Set();
for (const id of chunkIds) {
  const values = [];
  const seen = new Set();
  const mappingPattern = new RegExp(
    `(?:\\{|,)\\s*${id}\\s*:\\s*(?:"([^"]+)"|([A-Za-z0-9]+))`,
    "g",
  );
  for (const content of contents) {
    for (const match of content.matchAll(mappingPattern)) {
      const value = match[1] ?? match[2];
      if (!seen.has(value)) {
        seen.add(value);
        values.push(value);
      }
    }
  }
  // Docusaurus' webpack runtime records the logical chunk name first and its
  // content hash second. Runtime-only chunks have no downloadable mapping.
  if (values.length >= 2) {
    urls.add(new URL(`/assets/js/${values[0]}.${values[1]}.js`, origin).href);
  }
}

const output = [...urls].sort();
if (output.length > 0) {
  process.stdout.write(`${output.join("\n")}\n`);
}
NODE
}

echo "→ Discovering the current OneAPI Postman collection from ${POSTMAN_PAGE_URL}"
PAGE_FILE="${DISCOVERY_DIR}/postman-page.html"
if ! fetch page "${POSTMAN_PAGE_URL}" "${PAGE_FILE}"; then
    echo "✗ Could not fetch the official Zscaler Postman page: ${POSTMAN_PAGE_URL}" >&2
    exit 1
fi

DISCOVERY_FILES=("${PAGE_FILE}")
SCRIPT_FILES=()
script_index=0
while IFS= read -r script_url; do
    [[ -n "${script_url}" ]] || continue
    script_file="${DISCOVERY_DIR}/page-script-${script_index}.js"
    if ! fetch asset "${script_url}" "${script_file}"; then
        echo "✗ Could not fetch Postman page asset: ${script_url}" >&2
        exit 1
    fi
    SCRIPT_FILES+=("${script_file}")
    DISCOVERY_FILES+=("${script_file}")
    script_index=$((script_index + 1))
done < <(extract_script_urls "${PAGE_FILE}")

COLLECTION_CANDIDATES="$(extract_collection_urls "${DISCOVERY_FILES[@]}")"

if [[ -z "${COLLECTION_CANDIDATES}" && ${#SCRIPT_FILES[@]} -gt 0 ]]; then
    chunk_index=0
    while IFS= read -r chunk_url; do
        [[ -n "${chunk_url}" ]] || continue
        chunk_file="${DISCOVERY_DIR}/postman-chunk-${chunk_index}.js"
        if ! fetch asset "${chunk_url}" "${chunk_file}"; then
            echo "✗ Could not fetch generated Postman page chunk: ${chunk_url}" >&2
            exit 1
        fi
        DISCOVERY_FILES+=("${chunk_file}")
        chunk_index=$((chunk_index + 1))
    done < <(extract_postman_chunk_urls "${SCRIPT_FILES[@]}")
    COLLECTION_CANDIDATES="$(extract_collection_urls "${DISCOVERY_FILES[@]}")"
fi

if [[ -z "${COLLECTION_CANDIDATES}" ]]; then
    echo "✗ No OneAPI Postman collection link was found on the official Postman page." >&2
    echo "  Expected one HTTPS automate.zscaler.com /downloads/OneAPI_postman_collection_*.json target." >&2
    exit 1
fi

CANDIDATE_COUNT="$(printf '%s\n' "${COLLECTION_CANDIDATES}" | awk 'NF { count += 1 } END { print count + 0 }')"
if [[ "${CANDIDATE_COUNT}" -ne 1 ]]; then
    echo "✗ Postman collection discovery was ambiguous; found ${CANDIDATE_COUNT} targets:" >&2
    while IFS= read -r candidate; do
        [[ -n "${candidate}" ]] && echo "  - ${candidate}" >&2
    done <<< "${COLLECTION_CANDIDATES}"
    exit 1
fi

COLLECTION_URL="${COLLECTION_CANDIDATES}"
if [[ ! "${COLLECTION_URL}" =~ ^https://automate\.zscaler\.com/downloads/OneAPI_postman_collection_[0-9]{2}_[0-9]{2}_[0-9]{4}\.json$ ]]; then
    echo "✗ Discovered Postman collection target is not an approved Zscaler download URL:" >&2
    echo "  ${COLLECTION_URL}" >&2
    exit 1
fi

echo "→ Downloading Postman collection from ${COLLECTION_URL}"
if ! fetch collection "${COLLECTION_URL}" "${TMP_FILE}"; then
    echo "✗ Download failed for the discovered Postman collection URL." >&2
    echo "  ${COLLECTION_URL}" >&2
    exit 1
fi

if ! VALIDATION_ERROR="$(validate_postman_collection "${TMP_FILE}" 2>&1)"; then
    echo "✗ Downloaded file is not a valid Postman v2.1 collection. Refusing to replace ${OUTPUT_FILE}." >&2
    echo "  ${VALIDATION_ERROR}" >&2
    exit 1
fi

NEW_SIZE="$(wc -c < "${TMP_FILE}" | tr -d ' ')"
NEW_HASH="$(shasum -a 256 "${TMP_FILE}" | awk '{print $1}')"

if [[ ! -f "${OUTPUT_FILE}" ]]; then
    chmod 0644 "${TMP_FILE}"
    mv "${TMP_FILE}" "${OUTPUT_FILE}"
    trap 'rm -rf "${DISCOVERY_DIR}"' EXIT
    echo "✓ New file: ${OUTPUT_FILE} (${NEW_SIZE} bytes, sha256: ${NEW_HASH})"
    exit 0
fi

OLD_SIZE="$(wc -c < "${OUTPUT_FILE}" | tr -d ' ')"
OLD_HASH="$(shasum -a 256 "${OUTPUT_FILE}" | awk '{print $1}')"

if [[ "${NEW_HASH}" == "${OLD_HASH}" ]]; then
    echo "✓ No change — committed copy is current."
    echo "  ${OLD_SIZE} bytes, sha256: ${OLD_HASH}"
    exit 0
fi

chmod 0644 "${TMP_FILE}"
mv "${TMP_FILE}" "${OUTPUT_FILE}"
trap 'rm -rf "${DISCOVERY_DIR}"' EXIT

echo "✓ Updated: ${OUTPUT_FILE}"
echo "  Old: ${OLD_SIZE} bytes, sha256: ${OLD_HASH:0:16}..."
echo "  New: ${NEW_SIZE} bytes, sha256: ${NEW_HASH:0:16}..."

if command -v jq &>/dev/null; then
    echo ""
    echo "Top-level folder count: $(jq '.item | length' "${OUTPUT_FILE}")"
    echo "Folders:"
    jq -r '.item[] | "  - \(.name) (\(.item | length // 0) sub-items)"' "${OUTPUT_FILE}"
fi

echo ""
echo "Next steps:"
echo "  1. Sanity check: jq '.info' ${OUTPUT_FILE}"
echo "  2. Review for sensitive content and significant structural changes"
