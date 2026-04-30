#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""check-scrape-freshness.py — flag stale Zscaler help-article scrapes.

`vendor/zscaler-help/*.md` files are Playwright captures with a
"**Captured:** YYYY-MM-DD" line in the body. This script extracts that date,
computes age, and flags scrapes older than the threshold.

Default threshold: 90 days. Exit 0 by default — advisory output only.

Run:
    ./scripts/check-scrape-freshness.py             # 90-day threshold
    ./scripts/check-scrape-freshness.py 60          # 60-day threshold
    ./scripts/check-scrape-freshness.py 30 --strict # exit 1 on stale
    ./scripts/check-scrape-freshness.py --json
"""

import argparse
import json
import re
import sys
from datetime import date, datetime, timedelta
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

CAPTURED_RE = re.compile(r"\*\*Captured:\*\*\s+(\d{4}-\d{2}-\d{2})")


def main() -> int:
    parser = argparse.ArgumentParser(description="Flag stale help-article scrapes.")
    parser.add_argument(
        "threshold_days",
        nargs="?",
        type=int,
        default=90,
        help="Days threshold (default: 90).",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Exit 1 if any scrape exceeds the threshold.",
    )
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    today = date.today()
    threshold = timedelta(days=args.threshold_days)

    scrape_dir = REPO_ROOT / "vendor" / "zscaler-help"
    if not scrape_dir.exists():
        print(f"✗ {scrape_dir} not found.")
        return 1

    scrapes = sorted(scrape_dir.rglob("*.md"))
    stale: list[dict] = []
    fresh: list[dict] = []
    no_marker: list[str] = []

    for path in scrapes:
        try:
            text = path.read_text(errors="ignore")
        except Exception:
            continue
        m = CAPTURED_RE.search(text)
        rel = str(path.relative_to(REPO_ROOT))
        if not m:
            no_marker.append(rel)
            continue
        try:
            captured = datetime.strptime(m.group(1), "%Y-%m-%d").date()
        except ValueError:
            no_marker.append(rel)
            continue
        age = today - captured
        record = {"path": rel, "captured": captured.isoformat(), "age_days": age.days}
        if age > threshold:
            stale.append(record)
        else:
            fresh.append(record)

    if args.json:
        print(
            json.dumps(
                {
                    "threshold_days": args.threshold_days,
                    "stale": stale,
                    "fresh_count": len(fresh),
                    "no_capture_marker": no_marker,
                },
                indent=2,
            )
        )
    else:
        if stale:
            print(f"⚠ {len(stale)} scrape(s) older than {args.threshold_days} days:")
            stale_sorted = sorted(stale, key=lambda x: x["age_days"], reverse=True)
            for s in stale_sorted[:15]:
                print(f"  {s['path']}: captured {s['captured']} ({s['age_days']} days ago)")
            if len(stale_sorted) > 15:
                print(f"  ... and {len(stale_sorted) - 15} more")
            print()

        if no_marker:
            print(f"ℹ {len(no_marker)} scrape(s) have no `**Captured:**` marker:")
            for p in no_marker[:10]:
                print(f"  {p}")
            if len(no_marker) > 10:
                print(f"  ... and {len(no_marker) - 10} more")
            print()

        if not stale and not no_marker:
            print(f"✓ All {len(fresh)} scrapes are within {args.threshold_days}-day threshold.")
        else:
            print(f"({len(fresh)} scrape(s) within threshold.)")

    if args.strict and stale:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
