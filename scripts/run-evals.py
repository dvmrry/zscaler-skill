#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""run-evals.py — exercise / validate the behavior eval suite.

Loads evals from `references/_meta/evals/evals.json`. Two modes:

  list                — emit each eval's prompt and metadata for manual run
  validate <file>     — read a JSON file of {id: response_text} pairs;
                        check each response against the eval's assertions,
                        must_cite_files, must_not_say criteria

This script does NOT call any model. The eval prompts are emitted for
manual run via Claude Code (or any session that loads this skill); the
captured responses are then validated by this script. This separation
keeps the runner cheap (no API key required) and lets the operator
choose which model / session to evaluate against.

Run:
    ./scripts/run-evals.py list                       # all evals
    ./scripts/run-evals.py list --id 2                # just one eval
    ./scripts/run-evals.py validate responses.json    # check responses

Validation rules (per eval):
  - assertions:       each substring should appear (case-insensitive)
  - must_cite_files:  each file path or basename should appear
  - must_not_say:     each substring should NOT appear (case-insensitive)
  - expected_confidence: advisory note (not validated mechanically)

Response file format:
    {
      "1": "the response text for eval 1",
      "2": "the response text for eval 2",
      ...
    }
    (only IDs you want to validate need to be present)

Validation output is human-readable to stdout AND saved as a markdown
report under `_data/logs/eval-results-<UTC-date>.md`.

Exit code: 0 if all listed/validated evals pass; 1 if any validation fails.
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
EVALS_FILE = REPO_ROOT / "references" / "_meta" / "evals" / "evals.json"
RESULTS_DIR = REPO_ROOT / "_data" / "logs"


def load_evals() -> list[dict]:
    if not EVALS_FILE.exists():
        print(f"✗ evals file not found: {EVALS_FILE}", file=sys.stderr)
        sys.exit(2)
    data = json.loads(EVALS_FILE.read_text())
    return data.get("evals", [])


def emit_eval(eval_entry: dict) -> str:
    """Format one eval as a markdown block suitable for manual run."""
    lines = []
    eid = eval_entry["id"]
    lines.append(f"## Eval #{eid}")
    lines.append("")
    lines.append(f"**Tenant data required**: {eval_entry.get('tenant_data_required', False)}")
    lines.append(f"**Expected confidence**: {eval_entry.get('expected_confidence', 'unspecified')}")
    cites = eval_entry.get("must_cite_files", [])
    if cites:
        lines.append(f"**Must cite**: {', '.join(cites)}")
    lines.append("")
    lines.append("### Prompt")
    lines.append("")
    lines.append(eval_entry["prompt"])
    lines.append("")
    lines.append("### Expected output (summary)")
    lines.append("")
    expected = eval_entry.get("expected_output", "(none provided)")
    lines.append(expected)
    lines.append("")
    asserts = eval_entry.get("assertions", [])
    if asserts:
        lines.append("### Assertions (response must contain)")
        lines.append("")
        for a in asserts:
            lines.append(f"- `{a}`")
        lines.append("")
    must_not = eval_entry.get("must_not_say", [])
    if must_not:
        lines.append("### Must NOT say (response must not contain)")
        lines.append("")
        for m in must_not:
            lines.append(f"- `{m}`")
        lines.append("")
    lines.append("---")
    return "\n".join(lines)


def cmd_list(args, evals: list[dict]) -> int:
    if args.id is not None:
        target = next((e for e in evals if e["id"] == args.id), None)
        if not target:
            print(f"✗ no eval with id={args.id}", file=sys.stderr)
            return 1
        print(emit_eval(target))
        return 0
    print(f"# Eval suite — {len(evals)} entries")
    print()
    print("Run each prompt against a Claude Code session loading this skill.")
    print("Capture responses to a JSON file shaped `{id: response_text}` and")
    print("validate via `./scripts/run-evals.py validate <file>`.")
    print()
    for e in evals:
        print(emit_eval(e))
        print()
    return 0


def validate_one(eval_entry: dict, response: str) -> dict:
    """Validate a response against one eval; return result dict."""
    eid = eval_entry["id"]
    response_lc = response.lower()
    result = {
        "id": eid,
        "prompt": eval_entry["prompt"],
        "assertions_passed": [],
        "assertions_failed": [],
        "citations_passed": [],
        "citations_failed": [],
        "traps_clean": [],
        "traps_hit": [],
        "expected_confidence": eval_entry.get("expected_confidence"),
        "passed": True,
    }

    for a in eval_entry.get("assertions", []):
        if a.lower() in response_lc:
            result["assertions_passed"].append(a)
        else:
            result["assertions_failed"].append(a)
            result["passed"] = False

    for cite in eval_entry.get("must_cite_files", []):
        cite_path = cite.lower()
        cite_name = Path(cite).name.lower()
        if cite_path in response_lc or cite_name in response_lc:
            result["citations_passed"].append(cite)
        else:
            result["citations_failed"].append(cite)
            result["passed"] = False

    for trap in eval_entry.get("must_not_say", []):
        if trap.lower() in response_lc:
            result["traps_hit"].append(trap)
            result["passed"] = False
        else:
            result["traps_clean"].append(trap)

    return result


def render_result(result: dict) -> list[str]:
    """Render one validation result as markdown lines."""
    eid = result["id"]
    status = "✓ PASS" if result["passed"] else "✗ FAIL"
    lines = [f"### Eval #{eid} — {status}", ""]

    if result["assertions_failed"]:
        lines.append(f"**Assertions failed** ({len(result['assertions_failed'])}/{len(result['assertions_failed']) + len(result['assertions_passed'])}):")
        for a in result["assertions_failed"]:
            lines.append(f"  - ✗ `{a}` (not found)")
        lines.append("")
    if result["assertions_passed"]:
        lines.append(f"**Assertions passed** ({len(result['assertions_passed'])}):")
        for a in result["assertions_passed"]:
            lines.append(f"  - ✓ `{a}`")
        lines.append("")

    if result["citations_failed"]:
        lines.append("**Required citations missing**:")
        for c in result["citations_failed"]:
            lines.append(f"  - ✗ `{c}`")
        lines.append("")
    if result["citations_passed"]:
        lines.append("**Citations present**:")
        for c in result["citations_passed"]:
            lines.append(f"  - ✓ `{c}`")
        lines.append("")

    if result["traps_hit"]:
        lines.append("**Traps hit** (response contained text it should not have):")
        for t in result["traps_hit"]:
            lines.append(f"  - ✗ `{t}`")
        lines.append("")

    if result["expected_confidence"]:
        lines.append(f"**Expected confidence**: `{result['expected_confidence']}` (advisory — not mechanically checked)")
        lines.append("")

    lines.append("---")
    return lines


def cmd_validate(args, evals: list[dict]) -> int:
    response_file = Path(args.response_file)
    if not response_file.exists():
        print(f"✗ response file not found: {response_file}", file=sys.stderr)
        return 2
    try:
        responses = json.loads(response_file.read_text())
    except json.JSONDecodeError as e:
        print(f"✗ failed to parse response file as JSON: {e}", file=sys.stderr)
        return 2
    if not isinstance(responses, dict):
        print("✗ response file must be a JSON object {id: response_text}", file=sys.stderr)
        return 2

    eval_by_id = {e["id"]: e for e in evals}
    results = []
    for id_str, response in responses.items():
        try:
            eid = int(id_str)
        except ValueError:
            print(f"✗ invalid eval id: {id_str!r}", file=sys.stderr)
            continue
        if eid not in eval_by_id:
            print(f"⚠ no eval with id={eid}, skipping", file=sys.stderr)
            continue
        if not isinstance(response, str):
            print(f"⚠ eval id={eid}: response is not a string, skipping", file=sys.stderr)
            continue
        results.append(validate_one(eval_by_id[eid], response))

    if not results:
        print("✗ no valid responses to validate", file=sys.stderr)
        return 2

    passed = sum(1 for r in results if r["passed"])
    failed = len(results) - passed

    output = []
    output.append("# Eval validation results")
    output.append("")
    output.append(f"**Run**: {datetime.now(timezone.utc).isoformat()}")
    output.append(f"**Total**: {len(results)} | **Passed**: {passed} | **Failed**: {failed}")
    output.append("")

    for r in sorted(results, key=lambda x: x["id"]):
        output.extend(render_result(r))
        output.append("")

    report = "\n".join(output)
    print(report)

    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    out_path = RESULTS_DIR / f"eval-results-{datetime.now(timezone.utc).strftime('%Y-%m-%d')}.md"
    out_path.write_text(report)
    print(f"\nReport saved to {out_path.relative_to(REPO_ROOT)}", file=sys.stderr)

    return 0 if failed == 0 else 1


def main() -> int:
    parser = argparse.ArgumentParser(description="Eval-suite runner.")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_list = sub.add_parser("list", help="Print eval prompts for manual run.")
    p_list.add_argument("--id", type=int, help="Print only the eval with this id.")

    p_validate = sub.add_parser("validate", help="Validate response file against evals.")
    p_validate.add_argument("response_file", help="JSON file: {id: response_text}")

    args = parser.parse_args()
    evals = load_evals()

    if args.cmd == "list":
        return cmd_list(args, evals)
    if args.cmd == "validate":
        return cmd_validate(args, evals)
    parser.print_help()
    return 2


if __name__ == "__main__":
    sys.exit(main())
