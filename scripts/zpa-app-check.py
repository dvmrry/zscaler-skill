#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["zscaler-sdk-python>=1.7"]
# ///
"""zpa-app-check.py — "Is app X properly onboarded in ZPA end-to-end?"

Status: SCAFFOLD. Docstring, CLI, auth wiring, and dependency-traversal
structure are in place. The FQDN-to-segment filter, port-coverage parsing,
and policy-rule matching are marked TODO — they need real-tenant output to
finalize.

Implements the `onboard-app` / `onboard-application` validation workflow
documented by Zscaler's MCP server at:
  vendor/zscaler-mcp-server/commands/onboard-app.md
  vendor/zscaler-mcp-server/skills/zpa/onboard-application/SKILL.md

For a given app FQDN (or existing application segment ID), walks the full
ZPA onboarding chain and flags missing or misconfigured links:

  1. App Connector Group      (connectors in CONNECTED state? latest version?)
  2. Server Group              (attached to the connector group? dynamic_discovery
                                or explicit servers?)
  3. Segment Group             (parent for the application segment)
  4. Application Segment       (domain_names covers the FQDN? tcp/udp port
                                ranges include the expected port? enabled?
                                is_cname_enabled if web?)
  5. Access Policy Rule        (allows a relevant user/group to this segment?
                                order positioned correctly?)

Gaps in the chain cause cryptic 400s at API level and silent "can't access"
symptoms for end users. This script reports which links exist, which are
missing, and which are misconfigured.

Auth — reads credentials from environment (see references/zpa/api.md):
  ZSCALER_CLIENT_ID        required
  ZSCALER_CLIENT_SECRET    (or ZSCALER_PRIVATE_KEY for JWT auth)
  ZSCALER_VANITY_DOMAIN    required
  ZSCALER_CLOUD            optional
  ZSCALER_USE_LEGACY       set to "true" to use pre-ZIdentity legacy auth

Usage:
  ./scripts/zpa-app-check.py --fqdn app1.corp.example.com
  ./scripts/zpa-app-check.py --fqdn app1.corp.example.com --port 443
  ./scripts/zpa-app-check.py --segment-id 72057594037935171   # explicit segment
  ./scripts/zpa-app-check.py --json

Design notes (from MCP skill reasoning):
  - Dependency order matters at create time: App Connector Group → Server
    Group → Segment Group → Application Segment → Access Policy Rule.
    At validation time we traverse back upward — segment → group → server
    group → connector group — plus forward from segment → policy rules.
  - Wildcard segment matching: a request for `app1.corp.example.com` may
    be covered by an exact-match segment OR a wildcard segment like
    `*.corp.example.com`. Report ALL segments that could match and the
    most-specific one (which is what ZCC picks per the specificity rule
    documented in references/zpa/app-segments.md).
  - Port mismatch = ZPA drops the request — it does NOT fall back to a
    less-specific segment. If the FQDN matches but the port doesn't, the
    skill reports this specifically because it's the most common silent
    failure mode.
  - Multimatch changes this: if the matching segment has match_style =
    INCLUSIVE, multiple segments are consulted. Flag when match_style is
    mixed across covering segments (though ZPA rejects that config at save
    time — see clarification zpa-03).
  - Access policy is default-deny — no matching rule = blocked. Report the
    rule-chain (ordered) and the first match per common user scopes.
  - `zscaler_managed` / `read_only` flags on any resource in the chain
    mean "Deception or microtenant-managed — do not modify via customer
    admin" (see references/zpa/app-segments.md).
"""

from __future__ import annotations

import argparse
import os
import sys
from typing import Any


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    src = p.add_mutually_exclusive_group(required=True)
    src.add_argument("--fqdn", help="Application FQDN to validate")
    src.add_argument("--segment-id", help="Existing application segment ID to validate")
    p.add_argument("--port", type=int, help="Specific port to validate (default: all)")
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


def find_segments_for_fqdn(client: Any, fqdn: str) -> list[dict]:
    """Return all app segments whose domain_names cover the FQDN.

    Includes exact matches and wildcard matches up to the 5-level cap.
    Per references/zpa/app-segments.md, Zscaler Client Connector picks the
    most-specific match client-side.
    """
    # TODO: client.zpa.application_segment.list_segments() → filter by
    # fqdn-match against domain_names. Wildcard match pattern:
    # `*.example.com` matches fqdn iff fqdn endswith `.example.com` AND the
    # subdomain depth ≤ 5 levels from the wildcard's right-hand boundary
    # (see references/zia/wildcard-semantics.md — same 5-level cap applies).
    raise NotImplementedError


def inspect_port_coverage(segment: dict, port: int | None) -> dict:
    """Check whether a segment covers a specific port."""
    # TODO: parse tcp_port_ranges / udp_port_ranges (both wire formats per
    # references/zpa/api.md § dual port-range formats), return covered=bool
    # and the matching range if so.
    return {"covered": False, "reason": "not implemented"}


def validate_segment_dependencies(client: Any, segment: dict) -> list[dict]:
    """Walk segment → server_groups → connector_groups; report status."""
    findings: list[dict] = []
    # TODO: client.zpa.server_groups.get_group(sg_id) for each referenced
    # server group. Check: enabled, dynamic_discovery, servers count if not
    # dynamic, attached app_connector_group_ids.
    # TODO: client.zpa.app_connector_groups.get_group(cg_id) for each
    # connector group. Check: enabled, at least one CONNECTED connector,
    # version_profile_name, latitude/longitude sanity.
    # TODO: client.zpa.app_connectors.list_connectors(
    #     query_params={"app_connector_group_id": cg_id})
    return findings


def find_access_policies_for_segment(client: Any, segment_id: str) -> list[dict]:
    """Return ordered access policy rules that reference this segment or its group."""
    # TODO: client.zpa.policy_set.list_rules(policy_type="ACCESS_POLICY")
    # filter rules whose conditions include APP_SEGMENT with this id OR
    # APP_GROUP containing this segment.
    # Return rules in order (first-match-wins).
    return []


def check_microtenant_flags(obj: dict) -> list[str]:
    """Return warnings for zscaler_managed / read_only / restriction_type."""
    warnings: list[str] = []
    if obj.get("read_only"):
        warnings.append("read_only=true — resource cannot be modified via customer API")
    if obj.get("zscaler_managed"):
        warnings.append(
            "zscaler_managed=true — likely Zscaler Deception or similar; edit/delete unavailable"
        )
    if obj.get("restriction_type"):
        warnings.append(f"restriction_type={obj['restriction_type']!r} — microtenant scope applies")
    return warnings


def build_report(args: argparse.Namespace, client: Any) -> dict:
    report: dict = {
        "input": {"fqdn": args.fqdn, "segment_id": args.segment_id, "port": args.port},
        "segments": [],
        "dependencies": [],
        "access_policies": [],
        "gaps": [],
        "warnings": [],
    }

    if args.fqdn:
        try:
            segments = find_segments_for_fqdn(client, args.fqdn)
        except NotImplementedError:
            print("WARN: fqdn-to-segment lookup not implemented", file=sys.stderr)
            segments = []
        if not segments:
            report["gaps"].append(
                f"No application segment matches FQDN {args.fqdn!r}. The app is "
                "not onboarded in ZPA — users will not be able to reach it via ZPA."
            )
            return report
        # TODO: sort by specificity (exact > wildcard levels) and mark the most-specific
        report["segments"] = segments
    else:
        # fetch single segment by id
        # TODO: client.zpa.application_segment.get_segment(args.segment_id)
        seg = None  # placeholder
        if seg is None:
            report["gaps"].append(f"Segment ID {args.segment_id} not found")
            return report
        report["segments"] = [seg]

    # Port coverage
    for seg in report["segments"]:
        pc = inspect_port_coverage(seg, args.port)
        if args.port and not pc["covered"]:
            report["gaps"].append(
                f"Segment {seg.get('name')!r} matches the FQDN but does NOT cover "
                f"port {args.port}. Per ZPA's port-mismatch semantics, ZCC drops "
                f"the connection — it does NOT fall through to a less-specific "
                f"segment. Fix: add the port to this segment OR enable Multimatch "
                f"on the covering wildcard segment."
            )

    # Dependencies
    for seg in report["segments"]:
        report["warnings"].extend(
            f"{seg.get('name')!r}: {w}" for w in check_microtenant_flags(seg)
        )
        report["dependencies"].append(validate_segment_dependencies(client, seg))

    # Access policies
    for seg in report["segments"]:
        rules = find_access_policies_for_segment(client, str(seg.get("id")))
        if not rules:
            report["gaps"].append(
                f"No access policy rule references segment {seg.get('name')!r} "
                f"(neither directly nor via its segment group). Default-deny means "
                f"NO users can access this app — even though the segment exists."
            )
        report["access_policies"].append({"segment": seg.get("name"), "rules": rules})

    return report


def main() -> int:
    args = parse_args()
    try:
        client = build_zpa_client()
    except KeyError as e:
        print(f"ERROR: missing required env var {e}", file=sys.stderr)
        return 2

    report = build_report(args, client)

    if args.json:
        import json

        print(json.dumps(report, indent=2, default=str))
        return 0

    # Text report
    print("ZPA Application Onboarding Check")
    print("=" * 40)
    if args.fqdn:
        print(f"FQDN: {args.fqdn}" + (f" (port {args.port})" if args.port else ""))
    if args.segment_id:
        print(f"Segment ID: {args.segment_id}")
    print()
    if report["segments"]:
        print(f"Matching segments: {len(report['segments'])}")
        for seg in report["segments"]:
            print(f"  - {seg.get('name')!r} (id {seg.get('id')})")
    else:
        print("No matching segments found.")
    print()
    if report["gaps"]:
        print("Gaps:")
        for g in report["gaps"]:
            print(f"  - {g}")
        print()
    if report["warnings"]:
        print("Warnings:")
        for w in report["warnings"]:
            print(f"  - {w}")
        print()
    # TODO: render dependency tree and policy-rule chain in human-readable form
    if not report["gaps"] and not report["warnings"]:
        print("No gaps detected. App appears properly onboarded end-to-end.")
    return 0 if not report["gaps"] else 1


if __name__ == "__main__":
    sys.exit(main())
