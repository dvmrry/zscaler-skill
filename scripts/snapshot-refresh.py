#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["zscaler-sdk-python>=1.7"]
# ///
"""snapshot-refresh.py — dump ZIA and ZPA configuration to snapshot/ as JSON.

Status: FUNCTIONAL. End-to-end against a live OneAPI tenant. Resources the
current SDK doesn't expose are skipped with a `- <name>: service 'X' not on
client; skipping` line — the rest of the run continues.

The snapshot/ directory is the tenant-state side of this skill. It's gitignored
in the public upstream repo and committed in the private internal fork. Scripts
consuming the snapshot (e.g. url-lookup.py, skill reference docs) treat these
JSON files as the current config-of-record.

Auth — see scripts/url-lookup.py header, or references/zia/api.md. Same env
vars for both ZIA and ZPA with ZscalerClient under the OneAPI framework.
For legacy tenants, set ZSCALER_USE_LEGACY=true and use product-specific vars.

Usage:
  ./scripts/snapshot-refresh.py
  ./scripts/snapshot-refresh.py --zia-only
  ./scripts/snapshot-refresh.py --zpa-only
  ./scripts/snapshot-refresh.py --zcc-only

Writes to:
  snapshot/zia/url-categories.json
  snapshot/zia/url-filtering-rules.json
  snapshot/zia/cloud-app-control-rules.json
  snapshot/zia/ssl-inspection-rules.json
  snapshot/zia/advanced-settings.json
  snapshot/zpa/app-segments.json
  snapshot/zpa/segment-groups.json
  snapshot/zpa/server-groups.json
  snapshot/zpa/access-policy-rules.json
  snapshot/zcc/forwarding-profiles.json
  snapshot/zcc/trusted-networks.json
  snapshot/zcc/fail-open-policy.json
  snapshot/zcc/web-policy.json
  snapshot/_manifest.json   (fetch timestamps, counts, script version)

Each dump is a straight JSON serialization of the SDK's list response. Schema
versioning is informal — the files' contents change when Zscaler changes the
API responses, and the manifest records the fetch date so staleness is visible.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable


REQUIRED_ENV = ("ZSCALER_CLIENT_ID", "ZSCALER_VANITY_DOMAIN")
SNAPSHOT_DIR = Path(__file__).resolve().parent.parent / "snapshot"
SCRIPT_VERSION = "0.1"


def _check_env() -> None:
    missing = [k for k in REQUIRED_ENV if not os.environ.get(k)]
    if missing:
        print(f"error: missing required env vars: {', '.join(missing)}", file=sys.stderr)
        sys.exit(2)
    if not (os.environ.get("ZSCALER_CLIENT_SECRET") or os.environ.get("ZSCALER_PRIVATE_KEY")):
        print("error: need ZSCALER_CLIENT_SECRET or ZSCALER_PRIVATE_KEY", file=sys.stderr)
        sys.exit(2)


def _dump(path: Path, obj: Any) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, indent=2, default=str, sort_keys=True))
    return len(obj) if isinstance(obj, list) else 1


def _fetch_all(fn: Callable, label: str) -> list[dict] | None:
    """Call an SDK list method and return all pages. Returns None on failure."""
    try:
        results, resp, err = fn()
    except Exception as e:
        print(f"  ! {label}: exception {e}", file=sys.stderr)
        return None
    if err:
        print(f"  ! {label}: {err}", file=sys.stderr)
        return None
    out: list[dict] = list(results or [])
    while resp is not None and getattr(resp, "has_next", lambda: False)():
        try:
            more, resp, err = resp.next()
        except Exception as e:
            print(f"  ! {label}: pagination broke at {len(out)}: {e}", file=sys.stderr)
            break
        if err or not more:
            break
        out.extend(more)
    return out


def refresh_zia(client) -> dict[str, int]:
    target = SNAPSHOT_DIR / "zia"
    counts: dict[str, int] = {}
    print("zia:")
    for name, fn_path in (
        ("url-categories", "url_categories.list_categories"),
        ("url-filtering-rules", "url_filtering.list_rules"),
        ("cloud-app-control-rules", "cloudappcontrol.list_rules"),
        ("ssl-inspection-rules", "ssl_inspection_rules.list_rules"),
        ("advanced-settings", "advanced_settings.get_advanced_settings"),
    ):
        svc, method = fn_path.split(".")
        api = getattr(client.zia, svc, None)
        if api is None:
            print(f"  - {name}: service '{svc}' not on client; skipping")
            continue
        fn = getattr(api, method, None)
        if fn is None:
            print(f"  - {name}: method '{method}' not on service; skipping")
            continue
        data = _fetch_all(fn, name)
        if data is None:
            counts[name] = 0
            continue
        n = _dump(target / f"{name}.json", data)
        counts[name] = n
        print(f"  ✓ {name}: {n} records → {target / (name + '.json')}")
    return counts


def refresh_zpa(client) -> dict[str, int]:
    target = SNAPSHOT_DIR / "zpa"
    counts: dict[str, int] = {}
    print("zpa:")
    for name, fn_path in (
        ("app-segments", "application_segment.list_segments"),
        ("segment-groups", "segment_groups.list_groups"),
        ("server-groups", "server_groups.list_groups"),
        ("access-policy-rules", "policies.list_rules"),
    ):
        svc, method = fn_path.split(".")
        api = getattr(client.zpa, svc, None)
        if api is None:
            print(f"  - {name}: service '{svc}' not on client; skipping")
            continue
        fn = getattr(api, method, None)
        if fn is None:
            print(f"  - {name}: method '{method}' not on service; skipping")
            continue
        data = _fetch_all(fn, name)
        if data is None:
            counts[name] = 0
            continue
        n = _dump(target / f"{name}.json", data)
        counts[name] = n
        print(f"  ✓ {name}: {n} records → {target / (name + '.json')}")
    return counts


def refresh_zcc(client) -> dict[str, int]:
    target = SNAPSHOT_DIR / "zcc"
    counts: dict[str, int] = {}
    print("zcc:")
    for name, fn_path in (
        ("forwarding-profiles", "forwarding_profile.list_by_company"),
        ("trusted-networks", "trusted_networks.list_by_company"),
        ("fail-open-policy", "fail_open_policy.list_by_company"),
        ("web-policy", "web_policy.list_by_company"),
    ):
        svc, method = fn_path.split(".")
        api = getattr(client.zcc, svc, None)
        if api is None:
            print(f"  - {name}: service '{svc}' not on client; skipping")
            continue
        fn = getattr(api, method, None)
        if fn is None:
            print(f"  - {name}: method '{method}' not on service; skipping")
            continue
        data = _fetch_all(fn, name)
        if data is None:
            counts[name] = 0
            continue
        n = _dump(target / f"{name}.json", data)
        counts[name] = n
        print(f"  ✓ {name}: {n} records → {target / (name + '.json')}")
    return counts


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--zia-only", action="store_true")
    parser.add_argument("--zpa-only", action="store_true")
    parser.add_argument("--zcc-only", action="store_true")
    args = parser.parse_args()

    _check_env()

    from zscaler import ZscalerClient

    client = ZscalerClient({
        "client_id": os.environ["ZSCALER_CLIENT_ID"],
        "client_secret": os.environ.get("ZSCALER_CLIENT_SECRET"),
        "private_key": os.environ.get("ZSCALER_PRIVATE_KEY"),
        "vanity_domain": os.environ["ZSCALER_VANITY_DOMAIN"],
        "cloud": os.environ.get("ZSCALER_CLOUD"),
    })

    manifest = {
        "script": "snapshot-refresh.py",
        "script_version": SCRIPT_VERSION,
        "fetched_at_utc": datetime.now(timezone.utc).isoformat(),
        "zscaler_cloud": os.environ.get("ZSCALER_CLOUD") or "default",
        "counts": {},
    }

    run_zia = not (args.zpa_only or args.zcc_only)
    run_zpa = not (args.zia_only or args.zcc_only)
    run_zcc = not (args.zia_only or args.zpa_only)

    if run_zia:
        manifest["counts"]["zia"] = refresh_zia(client)
    if run_zpa:
        manifest["counts"]["zpa"] = refresh_zpa(client)
    if run_zcc:
        manifest["counts"]["zcc"] = refresh_zcc(client)

    manifest_path = SNAPSHOT_DIR / "_manifest.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, indent=2, sort_keys=True))
    print(f"\nmanifest → {manifest_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
