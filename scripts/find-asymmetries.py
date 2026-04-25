#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""find-asymmetries.py — surface candidate API mismatches across vendored upstream.

Status: functional. Pass 1 implemented (TF validator extraction + cross-source diff).
Passes 2-5 documented inline as future-work scaffolding.

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
    Extract `validation.StringInSlice([]string{...}, false)` patterns and bind
    each to the nearest preceding `"field_name": {` schema-field declaration.

    Build a table of (provider, resource_file, field, allowed_values_set).

    Surface candidates where:
      - Same field name has different allowed-value sets ACROSS providers
        (cross-product naming with diverged semantics)
      - Same field name has different allowed-value sets WITHIN a provider
        across different resources (often legitimate; eyeballed for noise)

Pass 2 — Postman request body vs response example diff (FUTURE)
    Walk vendor/zscaler-api-specs/oneapi-postman-collection.json. For each
    request, compare the request body schema against the response example
    block. Surface fields present in response but absent from request (server
    -assigned), or values that differ between request and response examples
    for the same key (the `tz` THE_ pattern shape).

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
OUTPUT = REPO_ROOT / "logs" / "asymmetry-candidates.md"


@dataclass(frozen=True)
class Validator:
    provider: str
    resource_file: str
    field: str
    values: tuple
    line: int


VALIDATOR_RE = re.compile(
    r"validation\.StringInSlice\(\s*\[\]string\s*\{(.*?)\}\s*,",
    re.DOTALL,
)
VALUE_RE = re.compile(r'"([^"]*)"')
FIELD_NAME_RE = re.compile(r'"([a-z_][a-z0-9_]*)"\s*:\s*\{')


def extract_validators_from_file(provider: str, path: Path) -> list[Validator]:
    content = path.read_text(encoding="utf-8", errors="replace")
    out = []
    for m in VALIDATOR_RE.finditer(content):
        values = tuple(sorted(set(VALUE_RE.findall(m.group(1)))))
        if not values:
            continue
        prefix = content[: m.start()]
        last_match = None
        for fm in FIELD_NAME_RE.finditer(prefix):
            last_match = fm
        field_name = last_match.group(1) if last_match else "<unknown>"
        line_num = content[: m.start()].count("\n") + 1
        out.append(
            Validator(
                provider=provider,
                resource_file=path.name,
                field=field_name,
                values=values,
                line=line_num,
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
            all_v.extend(extract_validators_from_file(provider, path))
    return all_v


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

    return {
        "cross_provider": cross_provider,
        "intra_provider": intra_provider,
        "total_validators": len(validators),
        "unique_fields": len(by_field),
    }


def render_report(candidates: dict) -> str:
    lines = [
        "# Asymmetry candidates",
        "",
        "Generated by `scripts/find-asymmetries.py` (Pass 1 — TF validator extraction).",
        "",
        f"- Total validators found: {candidates['total_validators']}",
        f"- Unique field names: {candidates['unique_fields']}",
        f"- Cross-provider mismatches: {len(candidates['cross_provider'])}",
        f"- Intra-provider mismatches: {len(candidates['intra_provider'])}",
        "",
        "Each candidate below is a *signal*, not a confirmed finding. Triage:",
        "",
        "1. Known and resolved? Mark and move on.",
        "2. Real new finding? Thread into the topical doc + add a row to `references/<product>/api.md § Read/write shape asymmetries`.",
        "3. False positive (validators differ for legitimate reasons)? Note here and move on.",
        "",
        "---",
        "",
    ]

    if candidates["cross_provider"]:
        lines.append("## Cross-provider field-name collisions (highest signal)")
        lines.append("")
        lines.append(
            "Same field name across multiple TF providers, with different validator "
            "value-sets. Either a real finding (same logical field with diverged validators) "
            "or coincidentally-same name with different semantics (false positive)."
        )
        lines.append("")
        for field, sets_per_provider, vs in sorted(candidates["cross_provider"]):
            lines.append(f"### `{field}`")
            for provider, sets in sorted(sets_per_provider.items()):
                for s in sets:
                    files = sorted(
                        {v.resource_file for v in vs if v.provider == provider and v.values == s}
                    )
                    lines.append(f"- **{provider}** in `{', '.join(files)}` → `{list(s)}`")
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
            for s in sets:
                files = sorted({v.resource_file for v in vs if v.values == s})
                lines.append(f"- `{', '.join(files)}` → `{list(s)}`")
            lines.append("")

    return "\n".join(lines)


def main():
    validators = collect_all_validators()
    candidates = find_candidates(validators)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(render_report(candidates))
    print(f"Wrote {OUTPUT}")
    print(
        f"  {candidates['total_validators']} validators across "
        f"{candidates['unique_fields']} unique field names"
    )
    print(f"  {len(candidates['cross_provider'])} cross-provider mismatches")
    print(f"  {len(candidates['intra_provider'])} intra-provider mismatches")


if __name__ == "__main__":
    main()
