#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["zscaler-sdk-python>=1.7"]
# ///
"""connector-health.py — "Is connector group X healthy, and what's wrong if not?"

Status: SCAFFOLD. CLI and per-check logic are in place. The provisioning-key
usage field names, runtime-status enum, and version-lag comparison thresholds
need confirming against live-tenant output before the report is trustworthy.

Implements the `troubleshoot-connector` / `troubleshoot-app-connector` workflow
documented by Zscaler's MCP server at:
  vendor/zscaler-mcp-server/commands/troubleshoot-connector.md
  vendor/zscaler-mcp-server/skills/zpa/troubleshoot-app-connector/SKILL.md

For a named ZPA App Connector group (or all groups), reports:
  - Per-connector runtime_status (CONNECTED / DISCONNECTED / etc.)
  - Current version vs expected version (upgrade lag / failure)
  - Certificate expiry window (<30 days is a warning)
  - Provisioning key usage (max_usage reached is #1 enrollment-failure cause)
  - Attached server groups + application segments (downstream dependencies)
  - Cross-flagged: any connector with last_upgrade_time much older than group
    peers, which correlates with the VM-cloning fingerprint-corruption issue
    the MCP skill calls out.

Auth — reads credentials from environment (see references/zpa/api.md):
  ZSCALER_CLIENT_ID        required
  ZSCALER_CLIENT_SECRET    (or ZSCALER_PRIVATE_KEY for JWT auth)
  ZSCALER_VANITY_DOMAIN    required
  ZSCALER_CLOUD            optional
  ZSCALER_USE_LEGACY       set to "true" to use pre-ZIdentity legacy auth

Usage:
  ./scripts/connector-health.py                          # all groups
  ./scripts/connector-health.py --group <name>          # single group
  ./scripts/connector-health.py --json                  # machine-readable

Design notes (from MCP skill reasoning):
  - Provisioning key exhaustion (max_usage reached) is the #1 cause of
    enrollment failures. Always the first thing to check.
  - SSL interception by a customer firewall on the path to ZPA brokers breaks
    both enrollment and ongoing connectivity. Local diagnosis: openssl s_client
    to broker*.*.prod.zpath.net should show a Zscaler CA; any other CA = SSL
    interception in the path. Can't check this via API — flag when enrollment
    failures cluster geographically.
  - VM clone / migration breaks enrollment via a corrupted hardware ID —
    logs would show "Cannot decrypt data from instance_id.crypt". Only full
    wipe-and-reprovision resolves it. The API signal is a connector that's
    been stuck disconnected for a long time despite provisioning key being OK.
  - Upgrade endpoints (dist.private.zscaler.com, yum.private.zscaler.com) are
    separate from broker endpoints. If a group is fully enrolled but all
    connectors stuck on an old version, firewall rules likely don't cover
    the upgrade endpoints.
  - Healthy connector local indicators (if shelled in, not API):
      * `zpa-connector-child` top CPU consumer
      * cert expiry >30 days
      * incrementing uptime
      * `Broker data connection count` > 0 with 0 backoffs
      * `curl -s 127.0.0.1:9000/memory/status` returns JSON
      * disk free >100 MB (falls below → connector auto-restarts)
"""

from __future__ import annotations

import argparse
import os
import sys
from datetime import datetime, timezone, timedelta
from typing import Any


CERT_WARN_DAYS = 30


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    p.add_argument("--group", help="Connector group name or ID (default: all groups)")
    p.add_argument("--json", action="store_true", help="Emit JSON instead of text report")
    return p.parse_args()


def build_zpa_client() -> Any:
    from zscaler import ZscalerClient
    from zscaler.oneapi_client import LegacyZPAClient

    use_legacy = os.environ.get("ZSCALER_USE_LEGACY", "").lower() == "true"
    if use_legacy:
        return LegacyZPAClient()

    cfg = {
        "client_id": os.environ["ZSCALER_CLIENT_ID"],
        "vanity_domain": os.environ["ZSCALER_VANITY_DOMAIN"],
    }
    if pk := os.environ.get("ZSCALER_PRIVATE_KEY"):
        cfg["private_key"] = pk
    else:
        cfg["client_secret"] = os.environ["ZSCALER_CLIENT_SECRET"]
    if cloud := os.environ.get("ZSCALER_CLOUD"):
        cfg["cloud"] = cloud
    return ZscalerClient(cfg)


def audit_provisioning_keys(client: Any) -> list[dict]:
    """Return list of provisioning-key findings.

    Per MCP skill: `max_usage` reached is the #1 cause of enrollment failures.
    Flags keys where current_usage / max_usage >= 0.9 (90% utilized).
    """
    # TODO: client.zpa.provisioning_keys.list_keys() — walk pages via resp.has_next()
    raise NotImplementedError


def audit_connector(connector: Any) -> list[str]:
    """Return a list of health issues for a single App Connector.

    Checks runtime_status, version vs expected, cert expiry, uptime anomalies.
    """
    issues: list[str] = []

    status = getattr(connector, "runtime_status", None)
    if status and status.upper() != "CONNECTED":
        issues.append(f"runtime_status={status}")

    current_ver = getattr(connector, "current_version", None)
    expected_ver = getattr(connector, "expected_version", None)
    if current_ver and expected_ver and current_ver != expected_ver:
        issues.append(f"version lag: {current_ver} != {expected_ver}")

    cert_exp = getattr(connector, "certificate_expiry", None)
    if cert_exp:
        # TODO: parse format (ISO8601? epoch?); warn if <CERT_WARN_DAYS.
        pass

    # TODO: last_disconnect_from_zscaler much older than last_connection — VM-clone signal
    # TODO: last_software_update significantly older than group peers — upgrade-path firewall issue

    return issues


def audit_group(client: Any, group_id: str) -> dict:
    """Audit all connectors in a group, plus downstream dependencies."""
    # TODO: client.zpa.app_connector_groups.get_group(group_id)
    # TODO: client.zpa.app_connectors.list_connectors(query_params={"app_connector_group_id": group_id})
    # TODO: resolve server_groups attached; application_segments attached (reverse lookup)
    raise NotImplementedError


def main() -> int:
    args = parse_args()
    try:
        client = build_zpa_client()
    except KeyError as e:
        print(f"ERROR: missing required env var {e}", file=sys.stderr)
        return 2

    report: dict = {"provisioning_keys": [], "groups": []}

    # Step 1 — always check provisioning keys first per MCP skill priority.
    try:
        report["provisioning_keys"] = audit_provisioning_keys(client)
    except NotImplementedError as e:
        print(f"WARN: provisioning key audit not implemented: {e}", file=sys.stderr)

    # Step 2 — per-group connector audit
    # TODO: if args.group, resolve name → id; else enumerate all groups
    groups_to_audit: list[str] = []  # populate

    for gid in groups_to_audit:
        try:
            report["groups"].append(audit_group(client, gid))
        except NotImplementedError as e:
            print(f"WARN: group audit not implemented: {e}", file=sys.stderr)

    if args.json:
        import json

        print(json.dumps(report, indent=2, default=str))
    else:
        # TODO: human-readable: group headers, per-connector status lines,
        # call out provisioning-key-near-limit and cert-expiring-soon separately.
        import pprint

        pprint.pprint(report)
    return 0


if __name__ == "__main__":
    sys.exit(main())
