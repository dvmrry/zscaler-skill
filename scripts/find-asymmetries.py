#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""find-asymmetries.py — surface candidate API mismatches across vendored upstream.

Status: functional. Passes 1 + 2 implemented.
  - Pass 1: TF validator extraction + cross-source diff, including map-based and
    slice-based validators and within-validator near-duplicate detection.
  - Pass 2: Postman request body vs response example field-path diff.
Passes 3-5 documented inline as future-work scaffolding.

Output: logs/asymmetry-candidates.md (gitignored upstream — populate per-fork).

Run:
    ./scripts/find-asymmetries.py

Manual review workflow:
    1. Run script.
    2. Open logs/asymmetry-candidates.md.
    3. For each candidate, eyeball: known finding (skip), real new finding
       (open clarification + thread into doc), false positive (note + move on).
    4. Re-run periodically as upstream submodules bump.

------------------------------------------------------------------------
PASS DESIGN
------------------------------------------------------------------------

Pass 1 — TF validator extraction + cross-source diff (IMPLEMENTED)
    Walk all `*.go` files in vendor/terraform-provider-{zia,zpa,ztc}/.
    Extract three complementary validator patterns:
      (a) `validation.StringInSlice([]string{...}, false)` — inline schema
          validators. Bound to nearest preceding `"field_name": {`.
      (b) `var <name> = map[string]struct{}{...}` — global named allowlist
          maps used by validator functions (e.g., supportedZiaTimeZones).
          Bound to the var name as the field. ZIA pattern.
      (c) `var <name> = []string{...}` — global named string slice used as
          allowlist (e.g., supportedLocationManagementCountries). Bound to
          the var name as the field. ZTC pattern.
    (b) and (c) added 2026-04-25 after the tz THE_NETHERLANDS finding was
    missed by (a) alone.

    Build a table of (provider, resource_file, field, allowed_values_set).

    Surface three candidate types:
      - Cross-provider mismatch: same field name, different value sets across providers.
      - Intra-provider mismatch: same field name, different value sets across resources within a provider.
      - Within-validator near-duplicate: two values in the same set where one is a strict
        prefix- or suffix-extension of the other (e.g., NETHERLANDS / THE_NETHERLANDS).
        Lower signal — most matches are legitimate variant families (BLOCK_DROP / BLOCK_RESET).
        Worth eyeballing for asymmetry-shaped patterns.

Pass 2 — Postman request body vs response example diff (IMPLEMENTED)
    Walk vendor/zscaler-api-specs/oneapi-postman-collection.json. For each
    request with a body AND a 2xx response example, parse both as JSON and
    diff the field paths. Surface fields present in response but absent from
    request (server-assigned candidates) and fields present in request but
    absent from response (write-only candidates).

    Limitation: Postman bodies use placeholder values (`<string>`, `<boolean>`,
    `<integer>`, etc.), not real data. This means Pass 2 catches FIELD-PRESENCE
    asymmetries (read-only / write-only fields) but NOT VALUE asymmetries
    (e.g., the tz THE_ pattern). For value-level asymmetries, lab observation
    against a real tenant is the only path; the Postman collection isn't
    sufficient.

Pass 3 — Cross-product field name fuzzy match (FUTURE)
    For each provider, list every field name. Compute Levenshtein distance
    across providers. Pairs at distance <= 2 are candidates for typo or
    cross-product naming inconsistency (e.g., names.givenName vs name.givenName,
    already manually caught for SCIM).

Pass 4 — TF validator git history diff (FUTURE)
    `git log --diff-filter=M -p -- vendor/terraform-provider-*/zia/.` over a
    rolling window. Parse StringInSlice changes between commits. Each value
    addition retroactively flags a previously-rejected enum (e.g., the v4.7.4
    addition of ENATDEDIP to forward_method).

Pass 5 — Python SDK enum extraction (FUTURE)
    Parse vendor/zscaler-sdk-python/zscaler/**/*.py for module-level constants
    shaped as enum lists (UPPER_SNAKE = ['VAL1', 'VAL2']) or `Literal[...]`
    type annotations. Compare against TF validators from Pass 1. Hardest pass
    because Python is duck-typed; lower signal-to-noise than structured Go
    validators. Skip until Passes 1+2 prove insufficient.

------------------------------------------------------------------------
"""

import json
import re
import sys
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
TF_PROVIDERS = [
    ("zia", REPO_ROOT / "vendor" / "terraform-provider-zia" / "zia"),
    ("zpa", REPO_ROOT / "vendor" / "terraform-provider-zpa" / "zpa"),
    ("ztc", REPO_ROOT / "vendor" / "terraform-provider-ztc" / "ztc"),
]
POSTMAN_COLLECTION = REPO_ROOT / "vendor" / "zscaler-api-specs" / "oneapi-postman-collection.json"
OUTPUT = REPO_ROOT / "logs" / "asymmetry-candidates.md"

# Thresholds tuned by triage:
#   - Skip near-duplicate scan for sets larger than NEAR_DUP_MAX_SET_SIZE
#     (huge enum lists like timezones generate too much noise).
#   - Suppress near-duplicate report sections with > NEAR_DUP_MAX_DISPLAY pairs
#     (likely legitimate variant family).
NEAR_DUP_MAX_SET_SIZE = 50
NEAR_DUP_MAX_DISPLAY = 8


@dataclass(frozen=True)
class Validator:
    provider: str
    resource_file: str
    field: str  # inline: schema field name; map-based or slice-based: var name
    values: tuple
    line: int
    kind: str  # "stringinslice", "mapstruct", or "stringslice"


# ---- Inline StringInSlice extraction (Pass 1a) ----
INLINE_VALIDATOR_RE = re.compile(
    r"validation\.StringInSlice\(\s*\[\]string\s*\{(.*?)\}\s*,",
    re.DOTALL,
)
VALUE_RE = re.compile(r'"([^"]*)"')
FIELD_NAME_RE = re.compile(r'"([a-z_][a-z0-9_]*)"\s*:\s*\{')


def extract_inline_validators(provider: str, path: Path, content: str) -> list[Validator]:
    out = []
    for m in INLINE_VALIDATOR_RE.finditer(content):
        values = tuple(sorted(set(VALUE_RE.findall(m.group(1)))))
        if not values:
            continue
        prefix = content[: m.start()]
        last_match = None
        for fm in FIELD_NAME_RE.finditer(prefix):
            last_match = fm
        field_name = last_match.group(1) if last_match else "<unknown>"
        out.append(
            Validator(
                provider=provider,
                resource_file=path.name,
                field=field_name,
                values=values,
                line=content[: m.start()].count("\n") + 1,
                kind="stringinslice",
            )
        )
    return out


# ---- Map-based validator extraction (Pass 1b, added 2026-04-25 for tz finding) ----
MAP_DECL_RE = re.compile(
    r"var\s+(\w+)\s*=\s*map\[string\]struct\{\}\s*\{",
)
MAP_KEY_RE = re.compile(r'^\s*"([^"]+)"\s*:\s*\{\s*\}\s*,?', re.MULTILINE)


def extract_map_validators(provider: str, path: Path, content: str) -> list[Validator]:
    """Find `var X = map[string]struct{}{...}` allowlist maps and extract their keys.

    Brace-tracking is required because the map body contains `{}` (empty struct values)
    plus the outer `{...}` braces. We track depth from the opening `{` of the map literal
    until depth returns to 0.
    """
    out = []
    for decl in MAP_DECL_RE.finditer(content):
        name = decl.group(1)
        # Walk forward from end of declaration to find the matching close brace.
        # Depth starts at 1 (we just consumed the opening brace).
        idx = decl.end()
        depth = 1
        body_start = idx
        while idx < len(content) and depth > 0:
            ch = content[idx]
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
            idx += 1
        if depth != 0:
            continue  # malformed; skip
        body = content[body_start : idx - 1]
        keys = tuple(sorted(set(MAP_KEY_RE.findall(body))))
        if not keys:
            continue
        out.append(
            Validator(
                provider=provider,
                resource_file=path.name,
                field=name,  # use var name as field-equivalent
                values=keys,
                line=content[: decl.start()].count("\n") + 1,
                kind="mapstruct",
            )
        )
    return out


# ---- Named string slice extraction (Pass 1c, added 2026-04-25 for ZTC validator pattern) ----
SLICE_DECL_RE = re.compile(
    r"var\s+(\w+)\s*=\s*\[\]string\s*\{",
)


def extract_slice_validators(provider: str, path: Path, content: str) -> list[Validator]:
    """Find `var X = []string{...}` allowlist slices and extract their values.

    ZTC's validator pattern wraps a named slice with `validation.StringInSlice(name, false)`,
    so the underlying allowlist isn't visible to the inline-validator regex. Capturing the
    named slice directly catches it.
    """
    out = []
    for decl in SLICE_DECL_RE.finditer(content):
        name = decl.group(1)
        idx = decl.end()
        depth = 1
        body_start = idx
        while idx < len(content) and depth > 0:
            ch = content[idx]
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
            idx += 1
        if depth != 0:
            continue
        body = content[body_start : idx - 1]
        values = tuple(sorted(set(VALUE_RE.findall(body))))
        if not values:
            continue
        out.append(
            Validator(
                provider=provider,
                resource_file=path.name,
                field=name,
                values=values,
                line=content[: decl.start()].count("\n") + 1,
                kind="stringslice",
            )
        )
    return out


def collect_all_validators() -> list[Validator]:
    all_v: list[Validator] = []
    for provider, root in TF_PROVIDERS:
        if not root.exists():
            print(f"WARN: missing TF provider tree at {root}", file=sys.stderr)
            continue
        for path in sorted(root.rglob("*.go")):
            if path.name.endswith("_test.go"):
                continue
            content = path.read_text(encoding="utf-8", errors="replace")
            all_v.extend(extract_inline_validators(provider, path, content))
            all_v.extend(extract_map_validators(provider, path, content))
            all_v.extend(extract_slice_validators(provider, path, content))
    return all_v


# ---- Within-validator near-duplicate detection (Pass 1c) ----
def find_near_duplicates_in_set(values: tuple[str, ...]) -> list[tuple[str, str, str]]:
    """For a single value set, find pairs where one value is a strict prefix-
    or suffix-extension of another via `_` separator.

    Examples that match:
      (NETHERLANDS, THE_NETHERLANDS) — prefix extension by "THE_"
      (URL_CATEGORY, TLD_URL_CATEGORY) — prefix extension
      (BLOCK, BLOCK_DROP) — suffix extension by "_DROP"

    These are signals worth eyeballing — most prefix/suffix extensions are legitimate
    variant families (BLOCK_DROP / BLOCK_RESET / BLOCK_ICMP for firewall actions),
    but some indicate read/write asymmetry (THE_X vs X) or stale enum sync.
    """
    pairs = []
    vals = list(values)
    for i, v1 in enumerate(vals):
        for v2 in vals[i + 1 :]:
            short, long = (v1, v2) if len(v1) < len(v2) else (v2, v1)
            if len(short) == len(long):
                continue
            if long.startswith(short + "_"):
                ext = long[len(short) + 1 :]
                pairs.append((short, long, f"prefix-extension: long = short + '_{ext}'"))
            elif long.endswith("_" + short):
                ext = long[: len(long) - len(short) - 1]
                pairs.append((short, long, f"suffix-extension: long = '{ext}_' + short"))
    return pairs


# ---- Pass 2: Postman request body vs response example field diff ----
# Server-assigned fields commonly visible in response but not request — suppress to reduce noise.
COMMON_SERVER_ASSIGNED_LEAVES = {
    "id",
    "creationTime",
    "modifiedTime",
    "modifiedBy",
    "modifiedTimestamp",
    "lastUpdatedTime",
    "lastUpdatedBy",
    "createdAt",
    "updatedAt",
    "createdBy",
    "objectId",
    "self",
    "href",
}

# Postman placeholder tags inside JSON string bodies — replace with a sentinel
# so the body parses as valid JSON for field-path extraction.
POSTMAN_PLACEHOLDER_TAGS = [
    "<string>",
    "<boolean>",
    "<integer>",
    "<long>",
    "<number>",
    "<float>",
    "<double>",
    "<array>",
    "<object>",
]


def walk_postman_items(items, path=()):
    """Recursively yield (path, leaf) for every leaf endpoint in a Postman tree."""
    for it in items:
        sub = path + (it.get("name", "?"),)
        if "item" in it:
            yield from walk_postman_items(it["item"], sub)
        else:
            yield sub, it


def parse_postman_body(raw: str) -> dict | list | None:
    """Postman bodies often contain `<string>` / `<boolean>` placeholders. Replace with
    a literal sentinel so the body parses as JSON; we only care about field paths,
    not the values."""
    if not raw or not raw.strip():
        return None
    cleaned = raw
    for tag in POSTMAN_PLACEHOLDER_TAGS:
        cleaned = cleaned.replace(tag, '"__PLACEHOLDER__"')
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return None


def extract_field_paths(obj, prefix: str = "") -> set[str]:
    """Recursively collect every field path in a parsed JSON object/array.
    Arrays use `[]` as their position marker (we don't index into list items)."""
    paths: set[str] = set()
    if isinstance(obj, dict):
        for k, v in obj.items():
            new = f"{prefix}.{k}" if prefix else k
            paths.add(new)
            paths.update(extract_field_paths(v, new))
    elif isinstance(obj, list):
        for v in obj:
            paths.update(extract_field_paths(v, f"{prefix}[]"))
    return paths


def is_obvious_server_field(field_path: str) -> bool:
    """Heuristic noise filter — common server-assigned field names like `id`,
    `creationTime`, etc. that show up in nearly every response but rarely in
    request bodies."""
    leaf = field_path.split(".")[-1].split("[]")[-1]
    return leaf in COMMON_SERVER_ASSIGNED_LEAVES


def find_postman_diffs() -> list[dict]:
    """Walk the Postman collection. For endpoints with both a request body and
    a 2xx response example, diff field paths and surface candidates."""
    if not POSTMAN_COLLECTION.exists():
        print(f"WARN: Postman collection missing at {POSTMAN_COLLECTION}", file=sys.stderr)
        return []
    try:
        with POSTMAN_COLLECTION.open(encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"WARN: Postman collection unparseable: {e}", file=sys.stderr)
        return []

    diffs = []
    for path, leaf in walk_postman_items(data.get("item", [])):
        req = leaf.get("request")
        if not isinstance(req, dict):
            continue
        method = req.get("method", "")
        if method not in ("POST", "PUT", "PATCH"):
            continue
        body_raw = (req.get("body") or {}).get("raw")
        request_body = parse_postman_body(body_raw) if body_raw else None
        if not request_body:
            continue

        # Pick the first 2xx response example with a body
        responses = leaf.get("response", []) or []
        chosen = None
        for resp in responses:
            code = resp.get("code", 0)
            if 200 <= code < 300 and resp.get("body"):
                chosen = resp
                break
        if not chosen:
            continue
        response_body = parse_postman_body(chosen.get("body", ""))
        if not response_body:
            continue

        request_fields = extract_field_paths(request_body)
        response_fields = extract_field_paths(response_body)
        only_in_response = response_fields - request_fields
        only_in_request = request_fields - response_fields

        # Filter common server-assigned noise (id, createdAt, etc.)
        only_in_response_signal = {f for f in only_in_response if not is_obvious_server_field(f)}
        only_in_request_signal = {f for f in only_in_request if not is_obvious_server_field(f)}

        if only_in_response_signal or only_in_request_signal:
            diffs.append(
                {
                    "path": path,
                    "method": method,
                    "name": leaf.get("name", "?"),
                    "response_only": sorted(only_in_response_signal),
                    "request_only": sorted(only_in_request_signal),
                    "response_only_filtered_count": len(only_in_response) - len(only_in_response_signal),
                    "request_only_filtered_count": len(only_in_request) - len(only_in_request_signal),
                }
            )
    return diffs


def find_candidates(validators: list[Validator]) -> dict:
    by_field: dict[str, list[Validator]] = defaultdict(list)
    for v in validators:
        by_field[v.field].append(v)

    cross_provider: list = []
    intra_provider: list = []

    for field, vs in by_field.items():
        sets_per_provider: dict[str, set] = defaultdict(set)
        for v in vs:
            sets_per_provider[v.provider].add(v.values)

        if len(sets_per_provider) > 1:
            all_value_sets = {s for sets in sets_per_provider.values() for s in sets}
            if len(all_value_sets) > 1:
                cross_provider.append((field, dict(sets_per_provider), vs))

        for provider, sets in sets_per_provider.items():
            if len(sets) > 1:
                provider_vs = [v for v in vs if v.provider == provider]
                intra_provider.append((field, provider, list(sets), provider_vs))

    # Near-duplicate scan: per-validator, only on small sets to control noise.
    near_dups: list = []
    for v in validators:
        if len(v.values) > NEAR_DUP_MAX_SET_SIZE:
            continue
        pairs = find_near_duplicates_in_set(v.values)
        if pairs:
            near_dups.append((v, pairs))

    return {
        "cross_provider": cross_provider,
        "intra_provider": intra_provider,
        "near_duplicates": near_dups,
        "total_validators": len(validators),
        "unique_fields": len(by_field),
        "inline_count": sum(1 for v in validators if v.kind == "stringinslice"),
        "map_count": sum(1 for v in validators if v.kind == "mapstruct"),
        "slice_count": sum(1 for v in validators if v.kind == "stringslice"),
    }


def render_postman_section(diffs: list[dict]) -> list[str]:
    if not diffs:
        return [
            "## Pass 2 — Postman request vs response field-path diff",
            "",
            "No field-presence asymmetries surfaced (or Postman collection unavailable).",
            "",
            "---",
            "",
        ]
    lines = [
        "## Pass 2 — Postman request vs response field-path diff",
        "",
        f"{len(diffs)} endpoints have field-path differences between request body and 2xx response example "
        "(after filtering common server-assigned fields like `id`, `createdAt`).",
        "",
        "**Read 'Response only' as: server returns this field but client never sent it → likely "
        "read-only / server-assigned attribute.** Operators round-tripping responses back as write payloads "
        "may include these and either get them ignored or trigger a write-validation error depending on the API.",
        "",
        "**Read 'Request only' as: client sends but response example doesn't echo → likely write-only "
        "(passwords, secrets) or response-trim.** Compare with corresponding GET examples to confirm.",
        "",
        "**Limitation reminder:** Postman placeholders block value-level asymmetry detection (the `tz` THE_ shape).",
        "",
    ]
    for d in diffs:
        title = " / ".join(d["path"][-2:]) if len(d["path"]) >= 2 else d["path"][-1]
        lines.append(f"### {d['method']} — {title}")
        if d["response_only"]:
            lines.append(f"- Response only: `{d['response_only']}`")
        if d["request_only"]:
            lines.append(f"- Request only: `{d['request_only']}`")
        if d["response_only_filtered_count"] or d["request_only_filtered_count"]:
            lines.append(
                f"- (Filtered as common server-assigned: "
                f"{d['response_only_filtered_count']} response-only, "
                f"{d['request_only_filtered_count']} request-only)"
            )
        lines.append("")
    lines.append("---")
    lines.append("")
    return lines


def render_report(candidates: dict) -> str:
    lines = [
        "# Asymmetry candidates",
        "",
        "Generated by `scripts/find-asymmetries.py` (Pass 1 — TF validator extraction).",
        "",
        f"- Total validators: {candidates['total_validators']} "
        f"({candidates['inline_count']} inline StringInSlice, "
        f"{candidates['map_count']} map[string]struct{{}}, "
        f"{candidates['slice_count']} named []string)",
        f"- Unique field/var names: {candidates['unique_fields']}",
        f"- Cross-provider mismatches: {len(candidates['cross_provider'])}",
        f"- Intra-provider mismatches: {len(candidates['intra_provider'])}",
        f"- Within-validator near-duplicates "
        f"(set size ≤ {NEAR_DUP_MAX_SET_SIZE}): {len(candidates['near_duplicates'])}",
        "",
        "Each candidate below is a *signal*, not a confirmed finding. Triage per "
        "[`references/_verification-protocol.md`](../references/_verification-protocol.md):",
        "",
        "1. Source-check the candidate against TF + Python SDK + Go SDK + Postman + help.",
        "2. Tier-A confirmed → thread into topical doc + add row to `references/<product>/api.md § Read/write shape asymmetries`.",
        "3. False positive (validators differ for legitimate reasons) → note here and move on.",
        "4. Tier-C single-source claim → file as a clarification candidate.",
        "",
        "---",
        "",
    ]

    if candidates["cross_provider"]:
        lines.append("## Cross-provider field-name collisions (highest signal)")
        lines.append("")
        lines.append(
            "Same field/var name across multiple TF providers, with different validator "
            "value-sets. Either a real finding (same logical field with diverged validators) "
            "or coincidentally-same name with different semantics (false positive)."
        )
        lines.append("")
        for field, sets_per_provider, vs in sorted(candidates["cross_provider"]):
            lines.append(f"### `{field}`")
            for provider, sets in sorted(sets_per_provider.items()):
                for s in sorted(sets):
                    files = sorted(
                        {v.resource_file for v in vs if v.provider == provider and v.values == s}
                    )
                    kind = next(iter({v.kind for v in vs if v.provider == provider and v.values == s}))
                    truncated = list(s) if len(s) <= 12 else list(s[:10]) + [f"...({len(s)} total)"]
                    lines.append(f"- **{provider}** ({kind}) in `{', '.join(files)}` → `{truncated}`")
            lines.append("")
        lines.append("---")
        lines.append("")

    if candidates["intra_provider"]:
        lines.append("## Intra-provider field-name collisions (medium signal)")
        lines.append("")
        lines.append(
            "Same field name appears in multiple resources within one provider with "
            "different validator value-sets. Often legitimate (different resources "
            "have different valid values for `action`, etc.) but worth eyeballing."
        )
        lines.append("")
        for field, provider, sets, vs in sorted(candidates["intra_provider"]):
            lines.append(f"### `{provider}.{field}`")
            for s in sorted(sets):
                files = sorted({v.resource_file for v in vs if v.values == s})
                truncated = list(s) if len(s) <= 12 else list(s[:10]) + [f"...({len(s)} total)"]
                lines.append(f"- `{', '.join(files)}` → `{truncated}`")
            lines.append("")
        lines.append("---")
        lines.append("")

    if candidates["near_duplicates"]:
        lines.append("## Within-validator near-duplicates (lower signal — many false positives)")
        lines.append("")
        lines.append(
            "Pairs of values within the same validator where one is a strict prefix- or "
            "suffix-extension of the other (with `_` separator). Most matches are legitimate "
            "variant families (BLOCK_DROP / BLOCK_RESET share `BLOCK_` prefix); some indicate "
            "asymmetry candidates (THE_X / X). Eyeball with the asymmetry pattern in mind, not "
            "the variant pattern."
        )
        lines.append("")
        for validator, pairs in sorted(
            candidates["near_duplicates"], key=lambda x: (-len(x[1]), x[0].field)
        ):
            if len(pairs) > NEAR_DUP_MAX_DISPLAY:
                # Likely a legitimate variant family; suppress detail, just summarize.
                lines.append(
                    f"### `{validator.provider}.{validator.field}` "
                    f"({validator.resource_file}) — {len(pairs)} pairs (suppressed; likely variant family)"
                )
                lines.append("")
                continue
            lines.append(
                f"### `{validator.provider}.{validator.field}` ({validator.resource_file})"
            )
            for short, long, kind in pairs:
                lines.append(f"- `{short}` → `{long}` ({kind})")
            lines.append("")

    return "\n".join(lines)


def main():
    validators = collect_all_validators()
    candidates = find_candidates(validators)
    postman_diffs = find_postman_diffs()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    full_report = render_report(candidates) + "\n\n" + "\n".join(render_postman_section(postman_diffs))
    OUTPUT.write_text(full_report)
    print(f"Wrote {OUTPUT}")
    print(
        f"  Pass 1: {candidates['total_validators']} validators "
        f"({candidates['inline_count']} inline + {candidates['map_count']} map-based + "
        f"{candidates['slice_count']} slice-based) "
        f"across {candidates['unique_fields']} unique field/var names"
    )
    print(f"    {len(candidates['cross_provider'])} cross-provider mismatches")
    print(f"    {len(candidates['intra_provider'])} intra-provider mismatches")
    print(f"    {len(candidates['near_duplicates'])} within-validator near-duplicates")
    print(f"  Pass 2: {len(postman_diffs)} Postman request/response field diffs")


if __name__ == "__main__":
    main()
