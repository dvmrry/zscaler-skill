#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""diagnose-tenant.py — runnable diagnostic CLI.

Reads env vars (ZSCALER_*, ZIA_*, ZPA_*, etc.) and runs all five diagnostic
patterns from `scripts/agent_patterns.py` in one pass:

  1. Cloud class detection (commercial / gov / unknown)
  2. Auth framework detection (oneapi / *-legacy / unknown)
  3. Optional credential smoke test (if --smoke and creds resolve)
  4. Endpoint enumeration (if --enumerate and client instantiates)
  5. Advisory notes (e.g., "OneAPI vars set but tenant is gov-cloud")

Run:
    ./scripts/diagnose-tenant.py
    ./scripts/diagnose-tenant.py --admin-url admin.zscalertwo.net
    ./scripts/diagnose-tenant.py --smoke --product zia
    ./scripts/diagnose-tenant.py --json

The patterns themselves live in `scripts/agent_patterns.py` and are importable
from any other Python script. AI agents can lift the functions directly.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from dataclasses import asdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import agent_patterns as ap


def render_text(d: ap.TenantDiagnosis) -> str:
    lines = [
        "Zscaler tenant diagnosis",
        "=" * 40,
        "",
        f"Cloud class:   {d.cloud_class}",
        f"  details:     {d.cloud_details}",
        "",
        f"Auth framework: {d.auth_framework}",
        f"Forced legacy:  {d.forced_legacy} (true → must use legacy; OneAPI unsupported)",
        "",
    ]
    if d.smoke_test is not None:
        s = d.smoke_test
        lines += [
            f"Smoke test ({s.product}): {'PASS' if s.ok else 'FAIL'}",
            f"  note:        {s.note}",
            "",
        ]
    if d.endpoints is not None:
        lines.append("Endpoint enumeration:")
        for product, names in sorted(d.endpoints.items()):
            preview = ", ".join(names[:6]) + (f" ... ({len(names)} total)" if len(names) > 6 else "")
            lines.append(f"  {product}: {preview}")
        lines.append("")
    if d.advisories:
        lines.append("Advisories:")
        for a in d.advisories:
            lines.append(f"  - {a}")
    else:
        lines.append("Advisories: none")
    return "\n".join(lines)


def render_json(d: ap.TenantDiagnosis) -> str:
    out = asdict(d)
    # asdict can't serialize SmokeResult cleanly if nested via dataclass-in-dataclass
    # since both are dataclasses asdict handles fine; but ensure JSON-serializable
    return json.dumps(out, indent=2, default=str)


def main() -> int:
    parser = argparse.ArgumentParser(description="Diagnose a Zscaler tenant from env + admin URL.")
    parser.add_argument("--admin-url", help="Optional admin URL (e.g., admin.zscalertwo.net) for cloud detection")
    parser.add_argument(
        "--smoke",
        action="store_true",
        help="Run a credential smoke test (requires zscaler SDK + valid creds in env)",
    )
    parser.add_argument(
        "--product",
        default="zia",
        choices=sorted(ap.SMOKE_CALLS.keys()),
        help="Product to smoke-test against (default: zia)",
    )
    parser.add_argument(
        "--enumerate",
        action="store_true",
        help="Enumerate available SDK endpoints (requires SDK + valid creds)",
    )
    parser.add_argument("--json", action="store_true", help="Emit JSON instead of human-readable text")
    args = parser.parse_args()

    client = None
    if args.smoke or args.enumerate:
        try:
            from zscaler import ZscalerClient
            client_config = {
                "client_id": os.environ.get("ZSCALER_CLIENT_ID"),
                "client_secret": os.environ.get("ZSCALER_CLIENT_SECRET"),
                "vanity_domain": os.environ.get("ZSCALER_VANITY_DOMAIN"),
                "private_key": os.environ.get("ZSCALER_PRIVATE_KEY"),
                "cloud": os.environ.get("ZSCALER_CLOUD"),
            }
            client_config = {k: v for k, v in client_config.items() if v is not None}
            if not client_config.get("client_id"):
                print(
                    "WARN: --smoke / --enumerate requested but ZSCALER_CLIENT_ID is not set.\n"
                    "      Set OneAPI env vars or omit --smoke / --enumerate.",
                    file=sys.stderr,
                )
            else:
                client = ZscalerClient(client_config)
        except ImportError:
            print(
                "WARN: zscaler SDK not installed; --smoke / --enumerate skipped. "
                "Install with: uv add zscaler-sdk-python",
                file=sys.stderr,
            )

    diagnosis = ap.diagnose_tenant(
        env=dict(os.environ),
        admin_url=args.admin_url,
        client=client,
        smoke_test_product=args.product,
    )

    if args.json:
        print(render_json(diagnosis))
    else:
        print(render_text(diagnosis))

    return 0 if not diagnosis.advisories else 1


if __name__ == "__main__":
    sys.exit(main())
