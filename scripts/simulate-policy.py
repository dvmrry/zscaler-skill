#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""simulate-policy.py — runnable CLI for the policy simulator.

Loads ZIA URL filter rules + categories from snapshot/zia/, simulates a
request, and emits the matched rule + reasoning trace. Useful for "would
this URL be blocked?" / "what-if I change rule N?" questions.

Run:
    ./scripts/simulate-policy.py --url https://www.reddit.com
    ./scripts/simulate-policy.py --url https://wiki.example.com --department engineering
    ./scripts/simulate-policy.py --url https://x.com --include-disabled    # what-if mode
    ./scripts/simulate-policy.py --url https://x.com --json                 # machine-readable

Requires snapshot/zia/url-filtering-rules.json and url-categories.json to
exist. If empty, run `./scripts/snapshot-refresh.py --zia-only` first.
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import asdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import policy_simulator as ps

REPO_ROOT = Path(__file__).resolve().parent.parent
SNAPSHOT_RULES = REPO_ROOT / "snapshot" / "zia" / "url-filtering-rules.json"
SNAPSHOT_CATS = REPO_ROOT / "snapshot" / "zia" / "url-categories.json"


def load_snapshot() -> tuple[list[dict], list[dict]]:
    if not SNAPSHOT_RULES.exists():
        print(
            f"ERROR: {SNAPSHOT_RULES.relative_to(REPO_ROOT)} not found. "
            "Run ./scripts/snapshot-refresh.py --zia-only first.",
            file=sys.stderr,
        )
        sys.exit(2)
    rules = json.loads(SNAPSHOT_RULES.read_text())
    cats = []
    if SNAPSHOT_CATS.exists():
        cats = json.loads(SNAPSHOT_CATS.read_text())
    else:
        print(
            f"WARN: {SNAPSHOT_CATS.relative_to(REPO_ROOT)} not found. "
            "Category resolution will be skipped — rules with urlCategories will not match.",
            file=sys.stderr,
        )
    return rules, cats


def render_text(result: ps.SimulationResult) -> str:
    lines = [
        "Policy simulation",
        "=" * 40,
        "",
        f"Request URL:     {result.request.url}",
    ]
    if result.request.user_email:
        lines.append(f"  user:          {result.request.user_email}")
    if result.request.department:
        lines.append(f"  department:    {result.request.department}")
    if result.request.location:
        lines.append(f"  location:      {result.request.location}")
    lines.append("")
    lines.append(f"Matched category: {result.matched_url_category!r}")
    lines.append("")
    lines.append(f"Result: {result.summary()}")
    lines.append("")
    lines.append("Trace:")
    for i, step in enumerate(result.trace, 1):
        lines.append(
            f"  {i}. rule #{step.rule_id} {step.rule_name!r:50.50} → {step.decision}"
        )
        if step.note:
            lines.append(f"       note: {step.note}")
    return "\n".join(lines)


def render_json(result: ps.SimulationResult) -> str:
    return json.dumps(asdict(result), indent=2, default=str)


def main() -> int:
    p = argparse.ArgumentParser(description="Simulate ZIA URL filter rule evaluation.")
    p.add_argument("--url", required=True, help="URL to simulate")
    p.add_argument("--user-email", help="Acting user's email")
    p.add_argument("--user-groups", nargs="*", default=[], help="User's group memberships")
    p.add_argument("--department", help="User's department")
    p.add_argument("--location", help="Acting location")
    p.add_argument("--location-groups", nargs="*", default=[], help="Location group memberships")
    p.add_argument("--device-category", help="e.g., Windows, Mac, iOS")
    p.add_argument("--source-ip", help="Source IP address")
    p.add_argument(
        "--include-disabled",
        action="store_true",
        help="Allow disabled rules to match (what-if mode). Default: realistic, disabled rules don't fire.",
    )
    p.add_argument("--json", action="store_true", help="Emit JSON instead of text")
    args = p.parse_args()

    rules, cats = load_snapshot()
    request = ps.URLFilterRequest(
        url=args.url,
        user_email=args.user_email,
        user_groups=args.user_groups,
        department=args.department,
        location=args.location,
        location_groups=args.location_groups,
        device_category=args.device_category,
        source_ip=args.source_ip,
    )
    result = ps.simulate_url_filter(
        request,
        rules,
        cats,
        include_disabled_in_match=args.include_disabled,
    )

    if args.json:
        print(render_json(result))
    else:
        print(render_text(result))

    return 0


if __name__ == "__main__":
    sys.exit(main())
