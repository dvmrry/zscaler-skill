#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""simulate-policy.py — runnable CLI for the policy simulator.

Loads ZIA URL filter rules + categories from _data/snapshot/, simulates a
request, and emits the matched rule + reasoning trace. Useful for "would this
URL be blocked?" / "what-if I change rule N?" questions.

Run:
    ./scripts/simulate-policy.py --url https://www.reddit.com
    ./scripts/simulate-policy.py --cloud zs2 --url https://www.reddit.com
    ./scripts/simulate-policy.py --url https://wiki.example.com --department engineering
    ./scripts/simulate-policy.py --url https://x.com --include-disabled    # what-if mode
    ./scripts/simulate-policy.py --url https://x.com --json                 # machine-readable

Reads product-first snapshots from _data/snapshot/zia/ by default. If --cloud
or ZSCALER_CLOUD is set, first tries _data/snapshot/<cloud>/zia/ and falls back
to the product-first layout. If empty, run `./scripts/snapshot-refresh.py
--zia-only` first.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from dataclasses import asdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import policy_simulator as ps

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_SNAPSHOT_ROOT = REPO_ROOT / "_data" / "snapshot"
ZIA_RULES_FILE = "url-filtering-rules.json"
ZIA_CATEGORIES_FILE = "url-categories.json"


def _rel(path: Path) -> str:
    try:
        return str(path.relative_to(REPO_ROOT))
    except ValueError:
        return str(path)


def _zia_snapshot_dirs(snapshot_root: Path, cloud: str | None) -> list[Path]:
    dirs: list[Path] = []
    if cloud:
        dirs.append(snapshot_root / cloud / "zia")
    else:
        cloud_dirs = sorted(
            path / "zia"
            for path in snapshot_root.iterdir()
            if path.is_dir() and (path / "zia" / ZIA_RULES_FILE).exists()
        ) if snapshot_root.exists() else []
        if len(cloud_dirs) == 1:
            dirs.extend(cloud_dirs)
    dirs.append(snapshot_root / "zia")
    return dirs


def load_snapshot(snapshot_root: Path, cloud: str | None) -> tuple[list[dict], list[dict], Path]:
    snapshot_root = snapshot_root.expanduser().resolve()
    checked = _zia_snapshot_dirs(snapshot_root, cloud)
    snapshot_dir = next(
        (path for path in checked if (path / ZIA_RULES_FILE).exists()),
        checked[0],
    )
    rules_path = snapshot_dir / ZIA_RULES_FILE
    cats_path = snapshot_dir / ZIA_CATEGORIES_FILE

    if not rules_path.exists():
        checked_paths = ", ".join(_rel(path / ZIA_RULES_FILE) for path in checked)
        print(
            f"ERROR: {ZIA_RULES_FILE} not found. Checked: {checked_paths}. "
            "Run ./scripts/snapshot-refresh.py --zia-only first, or pass --cloud/--snapshot-root.",
            file=sys.stderr,
        )
        sys.exit(2)
    rules = json.loads(rules_path.read_text())
    cats = []
    if cats_path.exists():
        cats = json.loads(cats_path.read_text())
    else:
        print(
            f"WARN: {_rel(cats_path)} not found. "
            "Category resolution will be skipped — rules with urlCategories will not match.",
            file=sys.stderr,
        )
    return rules, cats, snapshot_dir


def render_text(result: ps.SimulationResult, snapshot_dir: Path) -> str:
    lines = [
        "Policy simulation",
        "=" * 40,
        "",
        f"Snapshot:        {_rel(snapshot_dir)}",
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


def render_json(result: ps.SimulationResult, snapshot_dir: Path) -> str:
    payload = asdict(result)
    payload["snapshot"] = _rel(snapshot_dir)
    return json.dumps(payload, indent=2, default=str)


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
        "--cloud",
        default=os.environ.get("ZSCALER_CLOUD"),
        help=(
            "Snapshot cloud/tenant directory under _data/snapshot/ "
            "(default: ZSCALER_CLOUD if set, else product-first layout)."
        ),
    )
    p.add_argument(
        "--snapshot-root",
        type=Path,
        default=DEFAULT_SNAPSHOT_ROOT,
        help="Snapshot root directory (default: _data/snapshot)",
    )
    p.add_argument(
        "--include-disabled",
        action="store_true",
        help="Allow disabled rules to match (what-if mode). Default: realistic, disabled rules don't fire.",
    )
    p.add_argument("--json", action="store_true", help="Emit JSON instead of text")
    args = p.parse_args()

    rules, cats, snapshot_dir = load_snapshot(args.snapshot_root, args.cloud)
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
        print(render_json(result, snapshot_dir))
    else:
        print(render_text(result, snapshot_dir))

    return 0


if __name__ == "__main__":
    sys.exit(main())
