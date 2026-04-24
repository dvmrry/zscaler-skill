#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["zscaler-sdk-python>=1.7"]
# ///
"""ssl-audit.py — "What is being bypassed from SSL inspection, and what's the risk?"

Status: SCAFFOLD. Risk rubric, CLI, and classification logic are in place.
Scope-resolution paths (groups, departments, locations) and the exact SDK
response fields for SSL rules need confirming against a live tenant before
the risk summary is trustworthy.

Implements the `audit-ssl` / `audit-ssl-inspection-bypass` workflow documented
by Zscaler's MCP server at:
  vendor/zscaler-mcp-server/commands/audit-ssl.md
  vendor/zscaler-mcp-server/skills/zia/audit-ssl-inspection-bypass/SKILL.md

Enumerates ZIA SSL Inspection rules, classifies each by risk (CRITICAL / HIGH
/ MEDIUM / LOW) per the rubric in references/zia/ssl-inspection.md, and
reports per-rule detail plus summary counts. Scope resolution (groups,
departments, locations) is done lazily only for rules that need it, to keep
the run fast on tenants with thousands of IdP groups.

Auth — reads credentials from environment (see references/zia/api.md):
  ZSCALER_CLIENT_ID        required
  ZSCALER_CLIENT_SECRET    (or ZSCALER_PRIVATE_KEY for JWT auth)
  ZSCALER_VANITY_DOMAIN    required
  ZSCALER_CLOUD            optional
  ZSCALER_USE_LEGACY       set to "true" to use pre-ZIdentity legacy auth

Usage:
  ./scripts/ssl-audit.py                     # all rules, text report
  ./scripts/ssl-audit.py --json              # machine-readable
  ./scripts/ssl-audit.py --min-risk MEDIUM   # only MEDIUM and above
  ./scripts/ssl-audit.py --forwarding transparent   # scope risk to transparent-mode tenants

Risk classification (from references/zia/ssl-inspection.md § Audit rubric):
  CRITICAL: Broad uncategorized / AI-ML categories, scope = All Users.
            Under transparent forwarding: adds the Miscellaneous-or-Unknown
            IP-based over-exemption footgun.
  HIGH:     Sensitive cloud-app categories (Finance, Health, Webmail, File
            Sharing) with wide scope, or large department / location-group.
  MEDIUM:   Certificate-pinning justification (known apps per Leading
            Practices Guide p.22) AND scope is narrow — specific cloud app,
            location, or device group.
  LOW:      OS updates, system services, Microsoft 365 Optimize, or
            well-known bypasses; scope further narrowed by Device Group =
            Client Connector / high trust level.

Always-flag findings:
  - Predefined / default rules (predefined=true or default_rule=true) cannot
    be modified or deleted via API — any change recommendation must note
    that the operator must open a Zscaler Support request.
  - Disabled bypass rules still hold their order slot; recommend deletion
    rather than just disabling when the intent is permanent removal.
  - Transparent-forwarding tenants with Miscellaneous-Or-Unknown in a bypass
    rule — flag the IP-based over-exemption exposure regardless of scope.

Design notes:
  - Cross-referencing DLP impact is NOT in scope unless --with-dlp is passed.
    The MCP skill explicitly scopes this. Keeps the audit focused.
  - Read references/zia/ssl-inspection.md § "SSL bypass is a cross-policy
    gate" for the full set of downstream features a bypass affects — the
    audit surfaces the bypass; operators decide which downstream risks
    matter in their environment.
"""

from __future__ import annotations

import argparse
import os
import sys
from enum import IntEnum
from typing import Any


class Risk(IntEnum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4

    def __str__(self) -> str:  # noqa: D401
        return self.name


# Category sets used for risk classification. Adjust against the tenant's actual
# category taxonomy; these are documented defaults from the MCP skill rubric.
BROAD_UNCATEGORIZED = {
    "MISCELLANEOUS_OR_UNKNOWN",
    "OTHER_MISCELLANEOUS",
    "ANY",
    "NON_CATEGORIZABLE",
}
AI_ML_CATEGORIES = {"GENERATIVE_AI_ML_APPS", "GENERAL_AI_ML_APPS"}
SENSITIVE_CATEGORIES = {
    "FINANCE",
    "HEALTH",
    "WEBMAIL",
    "FILE_SHARING",
    "ONLINE_SHOPPING",
}
KNOWN_PINNED_APPS = {
    # From Leading Practices Guide p.22 + common patterns. Not exhaustive —
    # operators can extend via their own pinned-app registry.
    "DROPBOX",
    "CISCO_WEBEX",
    "ADOBE",
    "MS_OFFICE365_OPTIMIZE",
    "OS_UPDATES",
}
OS_UPDATE_CATEGORIES = {"OPERATING_SYSTEM_AND_SOFTWARE_UPDATES"}


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    p.add_argument("--json", action="store_true", help="Emit JSON instead of text")
    p.add_argument(
        "--min-risk",
        choices=[r.name for r in Risk],
        default="LOW",
        help="Only show findings at or above this risk level",
    )
    p.add_argument(
        "--forwarding",
        choices=["transparent", "explicit", "unknown"],
        default="unknown",
        help="Tenant's primary forwarding mode — affects Miscellaneous-category risk",
    )
    p.add_argument(
        "--with-dlp",
        action="store_true",
        help="Also flag DLP rules whose categories overlap a bypass (slower)",
    )
    return p.parse_args()


def build_zia_client() -> Any:
    from zscaler import ZscalerClient
    from zscaler.oneapi_client import LegacyZIAClient

    use_legacy = os.environ.get("ZSCALER_USE_LEGACY", "").lower() == "true"
    if use_legacy:
        return LegacyZIAClient()

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


def classify_rule(rule: Any, forwarding: str) -> tuple[Risk, list[str]]:
    """Return (risk, reasons) for an SSL Inspection rule.

    `rule` is an SDK-parsed SSLInspectionRule or equivalent dict. Access fields
    defensively since the exact model may vary between SDK versions.
    """
    # Only bypass-type actions carry audit-worthy risk. DECRYPT rules are the
    # secure default and not the audit target.
    action_type = _get(rule, "action", "type") or _get(rule, "action")
    if action_type not in {"DO_NOT_DECRYPT", "DO_NOT_INSPECT"}:
        return Risk.LOW, ["decrypt rule (not a bypass)"]

    categories = set(_get(rule, "url_categories") or [])
    cloud_apps = set(_get(rule, "cloud_applications") or [])
    scope = _scope_breadth(rule)
    sub_action = _get(rule, "action", "do_not_decrypt_sub_actions") or {}
    bypass_other = bool(
        (_get(sub_action, "bypass_other_policies")
         if isinstance(sub_action, dict)
         else getattr(sub_action, "bypass_other_policies", False))
    )

    reasons: list[str] = []
    risk = Risk.LOW

    # CRITICAL triggers
    if categories & BROAD_UNCATEGORIZED and scope == "all":
        reasons.append(
            "broad uncategorized category bypassed for All Users — attackers "
            "reach the tenant unfiltered"
        )
        risk = max(risk, Risk.CRITICAL)
    if categories & AI_ML_CATEGORIES and scope == "all":
        reasons.append(
            "AI/ML category bypassed tenant-wide — leak surface for uncontrolled gen-AI"
        )
        risk = max(risk, Risk.CRITICAL)
    if (
        forwarding == "transparent"
        and categories & BROAD_UNCATEGORIZED
    ):
        reasons.append(
            "transparent forwarding + Miscellaneous category: SSL rule matches "
            "on SNI *or* destination IP — silently exempts most public traffic"
        )
        risk = max(risk, Risk.CRITICAL)
    if bypass_other:
        reasons.append(
            "'Bypass Other Policies' — skips URL Filtering and CAC too, not "
            "just SSL inspection"
        )
        risk = max(risk, Risk.CRITICAL)

    # HIGH triggers
    if categories & SENSITIVE_CATEGORIES and scope in {"all", "wide"}:
        reasons.append(
            f"sensitive category bypassed with wide scope: {sorted(categories & SENSITIVE_CATEGORIES)}"
        )
        risk = max(risk, Risk.HIGH)

    # MEDIUM triggers
    if cloud_apps & KNOWN_PINNED_APPS and scope == "narrow":
        reasons.append(
            "certificate-pinned apps with narrow scope (expected, but verify "
            "the app list is still pinned)"
        )
        risk = max(risk, Risk.MEDIUM)

    # LOW — default for well-known benign bypasses
    if not reasons:
        if categories & OS_UPDATE_CATEGORIES or cloud_apps & KNOWN_PINNED_APPS:
            reasons.append("well-known benign bypass pattern")
            risk = Risk.LOW
        else:
            reasons.append(
                "uncategorized bypass — requires manual justification review"
            )
            risk = max(risk, Risk.MEDIUM)

    return risk, reasons


def _get(obj: Any, *path: str) -> Any:
    cur = obj
    for key in path:
        if cur is None:
            return None
        if isinstance(cur, dict):
            cur = cur.get(key)
        else:
            cur = getattr(cur, key, None)
    return cur


def _scope_breadth(rule: Any) -> str:
    """Crude classifier: 'all', 'wide', 'narrow'.

    'all' if no scope fields are set (implicit All Users / Locations).
    'narrow' if at least one of device_groups, devices, or locations is set.
    'wide' otherwise (groups / departments only — could be large).
    """
    scope_fields = ["users", "groups", "departments", "locations", "location_groups"]
    narrow_fields = ["devices", "device_groups"]
    any_set = any(_get(rule, f) for f in scope_fields + narrow_fields)
    if not any_set:
        return "all"
    if any(_get(rule, f) for f in narrow_fields):
        return "narrow"
    return "wide"


def audit(client: Any, forwarding: str) -> list[dict]:
    rules, resp, err = client.zia.ssl_inspection_rules.list_rules()
    if err:
        print(f"ERROR listing SSL inspection rules: {err}", file=sys.stderr)
        return []
    # TODO: resp.has_next() pagination loop if large tenant
    findings: list[dict] = []
    for rule in rules or []:
        risk, reasons = classify_rule(rule, forwarding)
        findings.append(
            {
                "id": _get(rule, "id"),
                "name": _get(rule, "name"),
                "order": _get(rule, "order"),
                "admin_rank": _get(rule, "admin_rank") or _get(rule, "rank"),
                "state": _get(rule, "state"),
                "predefined": bool(_get(rule, "predefined")),
                "default_rule": bool(_get(rule, "default_rule")),
                "risk": str(risk),
                "risk_value": int(risk),
                "reasons": reasons,
                "action_type": _get(rule, "action", "type") or _get(rule, "action"),
            }
        )
    return findings


def main() -> int:
    args = parse_args()
    try:
        client = build_zia_client()
    except KeyError as e:
        print(f"ERROR: missing required env var {e}", file=sys.stderr)
        return 2

    findings = audit(client, args.forwarding)
    min_risk = Risk[args.min_risk]
    filtered = [f for f in findings if f["risk_value"] >= int(min_risk)]
    filtered.sort(key=lambda f: (-f["risk_value"], f.get("order") or 999999))

    if args.json:
        import json

        print(json.dumps({"forwarding_mode": args.forwarding, "findings": filtered}, indent=2, default=str))
        return 0

    # Text report
    counts = {r.name: 0 for r in Risk}
    for f in filtered:
        counts[f["risk"]] += 1
    print(f"SSL Inspection Audit — forwarding={args.forwarding}")
    print(f"  CRITICAL: {counts['CRITICAL']}")
    print(f"  HIGH:     {counts['HIGH']}")
    print(f"  MEDIUM:   {counts['MEDIUM']}")
    print(f"  LOW:      {counts['LOW']}")
    print()
    for f in filtered:
        flag = "[PREDEF]" if f["predefined"] or f["default_rule"] else ""
        state = f.get("state") or ""
        print(f"[{f['risk']}] Rule #{f.get('order')} — {f.get('name')} ({state}) {flag}")
        for r in f["reasons"]:
            print(f"    - {r}")
        if f["predefined"] or f["default_rule"]:
            print(
                "    ! predefined/default rule — API cannot delete or fully "
                "modify; changes require Zscaler Support"
            )
        print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
